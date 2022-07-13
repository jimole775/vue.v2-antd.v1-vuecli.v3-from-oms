<template>
  <a-modal
    v-if="modal.show"
    title="表单配置"
    v-model="modal.show"
    width="60%"
    @ok="confirm"
  >
    <a-form :form="form">
      <a-row>
        <a-col :span="24">
          <a-form-item label="key" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input
              v-decorator="['key', {
                rules: [
                  { required: true, message: '请确认关键字' },
                  { pattern: /^[a-zA-Z]([a-zA-Z0-9]*)$/g, message: '只支持大小写英文字母、数字'}
                ]
              }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="label" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['label', {rules: [{ required: true, message: '请确认字段标签' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="宽度调整" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-row>
              <a-col span="8">
                <span class="width-adjust-label">全长: </span>
                <a-input style="width: 100px" v-decorator="['layoutSpan', { rules: [{ required: false }]}]" addon-after="/24" />
              </a-col>
              <a-col span="8">
                <span class="width-adjust-label">左: </span>
                <a-input style="width: 100px" v-decorator="['layoutLabel', { rules: [{ required: false }]}]" addon-after="/24" />
              </a-col>
              <a-col span="8">
                <span class="width-adjust-label">右: </span>
                <a-input style="width: 100px" v-decorator="['layoutWrapper', { rules: [{ required: false }]}]" addon-after="/24" />
              </a-col>
            </a-row>
          </a-form-item>
        </a-col>
      </a-row>
      <ConfigVisibleEditable
        v-if="nodes && nodes.length"
        :nodes="nodes"
        :radios="radios"
        v-model="veConfig"
      />
      <a-row>
        <a-col :span="24">
          <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <span slot="label">
              提交字段调整函数
              <a-tooltip title="当一个组件需要提交至少两个字段时，可以使用">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <FunctionBuilder
              v-decorator="['paramTransferFunction', {
                rules: [{ required: false }]
              }]"
            />
            <!-- <code v-if="showParamTransfer">
              <span>paramTransfer (params, vm) {</span>
              <a-textarea v-decorator="['paramTransfer', {rules: [{ required: false }]}]" />
              <span>}</span>
            </code>
            <a v-else @click="showParamTransfer = true"><a-icon type="plus-circle" /></a> -->
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="组件配置方式" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-radio-group v-model="configType">
              <a-radio value="selection">
                配选
              </a-radio>
              <a-radio value="function">
                手写
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <div v-if="configType === 'selection'">
        <ConfigComponent v-model="componentInfo" />
      </div>
      <a-row>
        <div v-if="configType === 'function'">
          <a-col :span="24">
            <a-form-item label="自定义组件" :label-col="{span: 6}" :wrapper-col="{span: 16}">
              <!-- <code>
                <span>wrapperCustomRender (h, formItem, vm) {</span>
                <a-textarea v-decorator="['wrapperCustomRender', {rules: [{ required: true, message: '请输入函数实体' }]}]" />
                <span>}</span>
              </code> -->
              <FunctionBuilder
                v-decorator="['wrapperCustomRenderFunction', {
                  rules: [{ required: false }]
                }]"
              />
            </a-form-item>
          </a-col>
        </div>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import utils from '@/utils'
import FunctionBuilder from '@/components/FunctionBuilder'
import ConfigComponent from '@builder/config-modules/config-component'
import ConfigVisibleEditable from '@builder/config-modules/config-visible-editable.vue'
export default {
  components: {
    FunctionBuilder,
    ConfigComponent,
    ConfigVisibleEditable
  },
  props: {
    modal: { type: Object, default: () => ({}) },
    nodes: { type: Array, default: () => [] },
    radios: { type: Array, default: () => [] } // 显示operations的radio选项
  },
  data () {
    return {
      form: this.$form.createForm(this),
      componentInfo: {
        props: {},
        component: '',
        originProps: {}
      },
      veConfig: {
        showOnEnv: [],
        showOnRoles: [],
        editOnRoles: [],
        showOnRadios: [],
        showOnNodes: [],
        editOnNodes: []
      },
      configType: 'selection',
      defaultProps: {
        paramTransferFunction: {
          functionType: 'arrow',
          arguments: ['params', 'formItem', 'vm'],
          fixedLines: {
            front: [],
            behind: ['return params']
          },
          defaultLines: {
            front: ['const dataSource = vm.dataSource \/\/ 详情接口数据'],
            behind: []
          },
          expression: ''
        },
        wrapperCustomRenderFunction: {
          functionType: 'arrow',
          arguments: ['h', 'formItem', 'vm'],
          fixedLines: {
            front: [],
            behind: []
          },
          defaultLines: {
            front: ['const dataSource = vm.dataSource \/\/ 详情接口数据'],
            behind: []
          },
          expression: ''
        }
      },
      showParamTransfer: false
    }
  },
  watch: {
    modal: {
      handler ({ data, show }) {
        if (show) {
          if (data) {
            this.editInitialize(data)
          } else {
            this.addInitialize()
          }
        } else {
          this.reset()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    editInitialize (data) {
      // this.defaultProps.paramTransferFunction.expression
      const itemInfo = {
        key: data.key,
        label: data.label,
        layoutSpan: data.layout ? data.layout.span : 6,
        layoutLabel: data.layout ? data.layout.label : 8,
        layoutWrapper: data.layout ? data.layout.wrapper : 16,
        // showOnRadios: data.showOnRadios || [],
        // editOnNodes: data.editOnNodes || [],
        // showOnNodes: data.showOnNodes || this.nodes.map(i => i.value), // 默认全部节点都显示
        // paramTransfer: data.paramTransfer && getFunctionBody(data.paramTransfer),
        paramTransferFunction: data.paramTransferFunction || this.defaultProps.paramTransferFunction
      }
      this.initVEConfig(data)
      if (data.wrapperCustomRenderFunction) {
        this.configType = 'function'
        // itemInfo.paramTransferFunction = getFunctionBody(data.wrapperCustomRender)
        itemInfo.wrapperCustomRenderFunction = data.wrapperCustomRenderFunction || this.defaultProps.wrapperCustomRenderFunction
      } else {
        // console.log('bind component info', this.componentInfo)
        this.configType = 'selection'
        this.componentInfo.props = data.props
        this.componentInfo.component = data.component
        this.componentInfo.originProps = data.originProps
      }
      setTimeout(() => {
        this.form.setFieldsValue(itemInfo)
      })
    },
    addInitialize () {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          span: 6,
          label: 8,
          wrapper: 16
        })
        this.initVEConfig()
      })
    },
    initVEConfig (data) {
      this.veConfig.showOnRadios = (data && data.showOnRadios) || []
      this.veConfig.showOnRoles = (data && data.showOnRoles) || []
      this.veConfig.editOnNodes = (data && data.editOnNodes) || []
      this.veConfig.showOnNodes = (data && data.showOnNodes) || this.nodes.map(i => i.value) // 默认全部节点都显示
      this.veConfig.showOnEnv = (data && data.showOnEnv) || []
      this.veConfig.editOnRoles = (data && data.editOnRoles) || []
    },
    reset () {
      this.form.resetFields()
      this.initVEConfig()
      this.showParamTransfer = false
      this.configType = 'selection'
      this.componentInfo = {
        props: {},
        component: '',
        originProps: {}
      }
    },
    confirm () {
      this.form.validateFields((err, values) => {
        if (err) {
          return false
        }
        this.modal.show = false
        const model = {
          ...this.veConfig,
          key: values.key,
          label: values.label,
          configType: this.configType,
          layout: {
            span: values.layoutSpan,
            label: values.layoutLabel,
            wrapper: values.layoutWrapper
          }
        }
        if (values.paramTransfer) {
          // model.paramTransfer = buildFunction('paramTransfer (params, vm) {', values.paramTransfer)
          model.paramTransferFunction = values.paramTransferFunction
        }
        if (this.configType === 'selection') {
          model.props = this.componentInfo.props
          model.component = this.componentInfo.component
          model.originProps = this.componentInfo.originProps
        } else {
          model.wrapperCustomRenderFunction = values.wrapperCustomRenderFunction
          // model.wrapperCustomRender = buildFunction('wrapperCustomRender (h, formItem, vm) {', values.wrapperCustomRender)
        }
        // console.log('formItem confirm:', model)
        this.$emit('update', utils.clone(model))
      })
    }
  }
}

// 从函数字符串中，获取函数实体
// function getFunctionBody (string) {
//   let regTail = /\}$/
//   // 普通函数
//   let regHead = /^(async\s)?function\s?([\w\$][\w\d\$]*?)*\s?\([(\r\n)\R\N\t\T]?([\w\d\$]*?,?\s?)*\)\s?{/
//   let head = string.match(regHead)
//   if (!head) {
//     // 箭头函数
//     regHead = /^(async\s)?([\w\$][\w\d\$]*?)*\s?\([(\r\n)\R\N\t\T]?([\w\d\$]*?,?\s?)*\)\s?=>\s?{/
//     head = string.match(regHead)
//   }
//   if (head) {
//     head = head[0]
//   }
//   return string.replace(regHead, '').replace(regTail, '')
// }

// 把函数body构造成函数字符串
// function buildFunction (functionHead, functionBody) {
//   return `${functionHead}\n${functionBody}\n}`
// }

</script>
<style lang="less" scoped>
span.width-adjust-label {
  padding: 0 1rem;
}
.object-ctrl {
  display: flex;
  padding: 4px;
  button {
    margin-left: 4px;
  }
}
.reference-object {
   display: flex;
   > span {
     padding: 0 0.3rem;
     border: 1px solid rgb(217 217 217);
   }
   > span:first-child {
     border-right: 0;
     border-radius: 0;
     border-radius: 3px 0 0 3px;
   }
   > span:last-child {
     border-left: 0;
     border-radius: 0 3px 3px 0;
   }
   > textarea {
     margin-bottom: 0;
     border-radius: 0;
   }
}
</style>
