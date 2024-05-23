/**
 * @ Author: Your name
 * @ Create Time: 2024-04-10 23:33:41
 * @ Modified by: Your name
 * @ Modified time: 2024-04-28 01:09:34
 * @ Description:
 */

import Vue from 'vue'
import utils from '@/utils'
import { Anchor } from 'ant-design-vue'
const monitorDesc1 = '使用500ms的轮询，监听 v-panels-anchor 指令的宿主 DOM 是否处于显示状态，显示后再挂载 v-panels-anchor 指令的实例对象，挂载后会关闭此轮询'
const mainContainer = document.querySelector('html')
let validateEvent
const PROPS = {
  // 一般指被锚点内容的盒子中，第一个带有滚动属性的父级元素
  container: {
    type: String,
    default: ''
  },
  // 是否支持 “收集挂载元素下的所有 ant-collapse 组件”
  recursion: {
    type: Boolean,
    default: true
  },
  selector: {
    type: String | Array,
    default: () => ['.ant-collapse-item']
  }
}

Vue.directive('panels-anchor', {
  inserted: function (el, binding, vnode) {
    // 每次挂载，都创建一个唯一标识
    el.id = `anchor_mounted_${new Date().getTime()}`
    mountedByDomState(el, binding, vnode)
  },
  unbind: function (el, binding, vnode) {
    const vm = el.__vue__ || {}
    vm.diswatchValidateState && vm.diswatchValidateState()
    mountMonitorTermination(el)
  }
})

function mountedByDomState (el, binding, vnode) {
  mountMonitorTermination(el)
  const isVisible = utils.hasDomVisibility(el)
  if (isVisible) {
    const vm = vnode.context || {}
    const props = createProps(vnode.data.attrs)
    const bindScopeName = binding.expression
    const PanelsAnchor = createFormAnchor(el, props)
    const instance = new PanelsAnchor().$mount()
    // 把 anchor 实例绑定到指令的挂载对象上，让挂载对象可以调用 anchor 的实例方法
    bindScopeName && (vm[bindScopeName] = instance)
    el && el.appendChild(instance.$el)
  } else {
    // 如果父级元素隐藏就卸载
    el.PanelsAnchorRunTimer = setInterval(() => mountedByDomState(el, binding, vnode), 500, monitorDesc1)
  }
}

function mountMonitorTermination (el) {
  clearInterval(el.PanelsAnchorRunTimer)
  el.PanelsAnchorRunTimer = null
  removeEvents()
}

function bindEvents () {
  removeEvents()
  if (!mainContainer) return false
  mainContainer.addEventListener('mouseup', validateEvent, false)
  mainContainer.addEventListener('mousedown', validateEvent, false)
  mainContainer.addEventListener('keydown', validateEvent, false)
}

function removeEvents () {
  if (!mainContainer) return false
  mainContainer.removeEventListener('mouseup', validateEvent, false)
  mainContainer.removeEventListener('mousedown', validateEvent, false)
  mainContainer.removeEventListener('keydown', validateEvent, false)
}

function createProps (attributes) {
  const props = utils.clone(PROPS)
  Object.entries(props).forEach(([key, config]) => {
    if (attributes.hasOwnProperty(key)) {
      config.default = attributes[key]
    }
  })
  return props
}

function createFormAnchor (mountDom, props) {
  return Vue.extend({
    name: 'PanelsAnchor',
    props: props,
    data () {
      return {
        mountDom,
        isMounted: false,
        anchorTexts: [], // 存储文本
        panelDoms: [], // 存储文本
        formVms: [], // 存储文本
        validateCompleteMap: {} // 存储文本
      }
    },
    mounted () {
      this.isMounted = true
      this.queryPanelDoms()
      this.queryFormVms()
      this.watchingValidateState()
    },
    beforeDestroy () {
      this.diswatchValidateState()
    },
    methods: {
      diswatchValidateState () {
        removeEvents()
      },
      watchingValidateState () {
        this.validateCompleteMap = {}
        validateEvent = utils.debounce((e) => {
          this.formVms.forEach(async (vm, index) => {
            if (!vm) return false
            if (vm.mode === 'readonly') return false
            if (vm.mode === 'edit' && !vm.$validate()) return false
            const validateState = !!(await vm.$validate())
            if (this.validateCompleteMap.hasOwnProperty(index)) {
              this.validateCompleteMap[index] = validateState
            } else {
              this.$set(this.validateCompleteMap, index, validateState)
            }
          })
        }, 500)
        const hasEditModule = !!this.formVms.find(vm => vm && vm.mode === 'edit')
        if (!hasEditModule) return false
        validateEvent() // @rongxis 如果有编辑模块，第一时间执行，先往 validateCompleteMap 存储未校验的状态
        bindEvents()
      },
      queryPanelDoms () {
        const selectors = utils.isString(this.$props.selector) ? [this.$props.selector] : this.$props.selector
        const allPanels = selectors.map(s => Array.from(this.mountDom.querySelectorAll(s)) || [])
        const panelDoms = allPanels.flat().filter(panel => {
          const recursion = this.$props.recursion
          const hasParent = selectors.some(s => utils.findDomUntilEnd(panel, s))
          return recursion || !hasParent
        })
        this.anchorTexts = []
        this.panelDoms = panelDoms.map((panel, index) => {
          this.anchorTexts[index] = utils.findFirstDomText(panel)
          return panel
        })
      },
      queryFormVms () {
        // @rongxis 获取 form 表单的时候，会出现获取不到某些属性或方法的情况
        // @rongxis 因为有些组件嵌套的比较深，抓取不到 vm 时，生命周期还不完整
        // @rongxis 这时候，就需要使用 $reload 进行重载，否则可能无法读取要提交的表单
        this.formVms = this.panelDoms.map(dom => {
          const vm = dom.__vue__ || {}
          if (vm.mode === 'edit') return vm
          if (vm.$children && vm.$children.length) return loop(vm.$children, 5)
        })
        function loop (children, level) {
          let nexts = []
          const correct = children.find(child => {
            if (child.mode === 'edit') return true
            else nexts = [...nexts, ...(child.$children || [])]
          })
          if (correct) return correct
          else if (level > 0 && nexts.length) return loop(nexts, --level)
        }
      },
      evalAnchorLinks () {
        return this.panelDoms.map((panel, index) => {
          panel.id = `panel_anchor_${index}_${this.mountDom.id}`
          const title = this.evalTitleNode(index)
          return title && <Anchor.Link href={`#${panel.id}`} title={title} />
        }).filter(Boolean)
      },
      evalTitleNode (index) {
        let checkIcon = ''
        const formVm = this.formVms[index] || {}
        // 显示 checked 的必要条件：
        if (formVm.mode === 'edit' && formVm.$validate) {
          const isValidated = this.validateCompleteMap[index] || false
          const iconStyle = {
            'margin-left': '0.3rem',
            'font-size': '0.8rem',
            color: isValidated ? '#2DC84D' : '#DEDEDE'
          }
          checkIcon = <a-icon style={iconStyle} type='check-circle' theme='filled' />
        }
        const titleText = this.anchorTexts[index]
        // 忽略审批操作模块
        return titleText ? <span>{titleText} {checkIcon}</span> : ''
      },
      $reload () {
        this.diswatchValidateState()
        this.queryPanelDoms()
        this.queryFormVms()
        this.watchingValidateState()
      },
      async $getFieldsValue () {
        const formVms = this.formVms || []
        let data = {}
        for (let index = 0; index < formVms.length; index++) {
          const formVm = formVms[index] || {}
          const handler = formVm.$getFieldsValue || formVm.getFieldsValue
          if (!handler) continue
          const res = await handler()
          data = { ...data, ...res }
        }
        return Promise.resolve(data)
      },
      $validate () {
        const keys = Object.keys(this.validateCompleteMap)
        const invalidateIndex = keys.find(k => this.validateCompleteMap[k] === false)
        const panel = this.panelDoms[invalidateIndex]
        const formVm = this.formVms[invalidateIndex]
        const anchor = panel && this.mountDom.querySelector(`[href="#${panel.id}"]`)
        if (anchor) {
          anchor.click()
          /** 所有表单校验必填字段，并报红显示提示文本，如果不是表单，则需要自己实现 */
          const validateFields = formVm.$validateFields || formVm.validateFields || formVm.form.validateFields
          validateFields?.()
          return false
        } else {
          return true
        }
      },
      $scrollTo (target) {
        let panel
        if (utils.isNumber(target)) {
          panel = this.panelDoms[target]
        }
        if (utils.isString(target)) {
          const index = this.anchorTexts.indexOf(target)
          panel = this.panelDoms[index]
        }
        if (panel) {
          const anchor = this.mountDom.querySelector(`[href="#${panel.id}"]`)
          anchor && anchor.click()
        }
      }
    },
    render (h) {
      if (this.isMounted) {
        const container = utils.findFirstDomWitchScrollBar(this.$props.container || this.mountDom)
        return <div class='panels-anchor-container'>
          <Anchor
            ref="panels-anchor"
            class='panels-anchor-box'
            getContainer={() => container}
          >
            {this.evalAnchorLinks()}
          </Anchor>
        </div>
      } else {
        return ''
      }
    }
  })
}
