<script>
import api from '@/api'
import utils from '@/utils'
import { mapState } from 'vuex'
import baseMixins from '@/mixins/baseMixins.js'
export default {
  mixins: [baseMixins],
  props: {
    tabProxy: {
      type: Object,
      required: true
    },
    apimap: {
      type: Object,
      required: true
    },
    approval: {
      type: Object,
      required: true
    },
    beforeRender: {
      type: Function,
      default: p => p
    },
    beforeSubmit: {
      type: Function,
      default: p => p
    },
    bridge: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      scope: this,
      basicData: {},
      currentTab: {},
      currentNode: {},
      currentRadio: '',
      activePanels: [],
      shareChanel: {}
    }
  },
  computed: {
    ...mapState({
      user: state => state.global.user,
      roleType: state => state.global.userRole.type
    }),
    isOutsideStuff () {
      return this.roleType === '0' || this.roleType === '1'
    },
    recordData () {
      return this.currentTab.recordData || {}
    },
    isApprovallor () {
      return this.currentNode &&
        this.currentNode.approvalAccountList &&
          this.currentNode.approvalAccountList.includes(this.currentAccount)
    },
    currentOption () {
      return (this.approval.operator && this.approval.operator.option) || {}
    },
    currentApimap () {
      return this.apimap.approval || {}
    },
    iShowOperator () {
      const inputs = this.currentOption.inputs || []
      const radios = this.currentOption.radios || []
      return this.isApprovallor && !!(inputs.length || radios.length)
    },
    // todo 看看有没有更好的自定义板块的方案
    customRender () {
      return this.approval.customRender
    }
  },
  watch: {
    tabProxy: {
      async handler (tabProxy) {
        if (!tabProxy) return false
        this.currentTab = tabProxy.tabs.find((pane) => pane.tabId === tabProxy.activeId)
        let func
        if (utils.isFunction(this.currentApimap.detail)) {
          func = this.currentApimap.detail
        } else {
          func = api[this.currentApimap.detail]
        }
        if (!func) return false
        const res = await func(this.currentTab.recordData)
        if (res.code === 200) {
          this.basicData = { ...res.data }
        } else {
          this.$message.warning(res.message)
        }
      },
      immediate: true
    },
    isApprovallor: {
      handler () {
        if (!this.currentNode.nodeCode) return false
        this.evalActivePanels()
      },
      deep: true,
      immediate: true
    },
    currentRadio: {
      handler () {
        if (!this.currentNode.nodeCode) return false
        // todo radio 不能直接决定所有项的显示与隐藏，否则会破坏字段值之间的动态关联
        // todo 只能通过 showOnRadios 属性下手：只运算 mode === 'edit' && x.showOnRadios，其他的不管
        const panels = this.activePanels || []
        const evalShowState = (item) => {
          let res = !!item.show
          if (item.showOnRadios || item.showOnNodes) {
            // 只有当前 item 在可显示节点的状态下，才接受 isShowByRadios 的逻辑
            if (item.showOnRadios && this.isShowByNodes(item) && item.mode === 'edit') {
              res = this.isShowByRadios(item)
            } else {
              res = this.isShowByNodes(item)
            }
          }
          return res
        }
        panels.map((panel) => {
          this.$set(panel, 'show', evalShowState(panel))
          const formItems = panel.formItems || []
          const inputs = (panel.option || {}).inputs || []
          const radios = (panel.option || {}).radios || []
          formItems.concat(inputs, radios).forEach((item) => {
            if (panel.mode && utils.isNone(item.mode)) {
              item.mode = panel.mode
            }
            if (panel.showOnNodes && utils.isNone(item.showOnNodes)) {
              item.showOnNodes = panel.showOnNodes
            }
            this.$set(item, 'show', evalShowState(item))
          })
          return panel
        })
      },
      immediate: true
    }
  },
  methods: {
    onShareEvent (key = '', data) {
      this.$set(this.shareChanel, key, data)
    },
    evalActivePanels () {
      this.activePanels.length = 0
      this.activePanels = this.evalPanelsProps()
      if (this.iShowOperator) {
        this.activePanels.push(this.evalOperatorProps())
      }
      // 当前默认展示 log
      if (this.activePanels.length) {
        this.activePanels.push({ component: 'ApproveLog', title: '操作日志', mode: 'readonly', show: true })
      }
    },
    evalOperatorProps () {
      const operator = this.approval.operator || {}
      utils.isNone(operator.show) && (operator.show = true)
      utils.isNone(operator.mode) && (operator.mode = 'edit')
      utils.isNone(operator.componentName) && (operator.componentName = 'SOperator')
      return operator
    },
    evalPanelsProps () {
      const panels = utils.clone(this.approval.panels || [])
      return panels.map((panel) => {
        this.evalPanelName(panel)
        this.$set(panel, 'mode', this.evalModeState(panel))
        this.$set(panel, 'show', this.evalShowState(panel))
        this.evalFormItemsProps(panel)
        return panel
      })
    },
    evalPanelName (panel) {
      if (utils.isString(panel.component)) {
        panel.componentName = panel.component
      }
      if (utils.isObject(panel.component)) {
        panel.componentName = panel.component.name || 'customRender'
      }
      if (utils.isNone(panel.component)) {
        panel.componentName = 'customRender'
      }
    },
    evalFormItemsProps (panel) {
      const formItems = panel.formItems || []
      formItems.forEach((formItem) => {
        this.extendsPanelProps(panel, formItem)
        this.$set(formItem, 'mode', this.evalModeState(formItem))
        this.$set(formItem, 'show', this.evalShowState(formItem))
        this.cutFieldsByMode(formItem)
      })
    },
    cutFieldsByMode (formItem) {
      // edit 模式需要删掉 readonly 下的属性
      if (formItem.mode === 'edit') {
      }
      // readonly 模式需要删掉 edit 下的所有渲染辅助项
      if (formItem.mode === 'readonly') {
        delete formItem.required
        delete formItem.component
        delete formItem.paramsTransfer
        delete formItem.onChange
      }
    },
    extendsPanelProps (panel, formItem) {
      // 继承 panel 的 editOnNodes
      if (formItem.editOnNodes === undefined && panel.editOnNodes) {
        formItem.editOnNodes = panel.editOnNodes
      }
      // 继承 panel 的 showOnNodes
      if (formItem.showOnNodes === undefined && panel.showOnNodes) {
        formItem.showOnNodes = panel.showOnNodes
      }
      // 继承 panel 的 showOnRadios
      if (formItem.showOnRadios === undefined && panel.showOnRadios) {
        formItem.showOnRadios = panel.showOnRadios
      }
    },
    evalShowState (item) {
      let res = false
      // 如果限定角色或环境，那么其他显示逻辑一律无视
      if (item.showOnRoles || item.showOnEnv) {
        if (item.showOnRoles && item.showOnEnv) {
          res = this.isShowByRoles(item) && this.isShowByEnvs(item)
        }
        if (item.showOnRoles && !item.showOnEnv) {
          res = this.isShowByRoles(item)
        }
        if (!item.showOnRoles && item.showOnEnv) {
          res = this.isShowByEnvs(item)
        }
      } else if (item.showOnNodes) {
        // 只有当前 item 在可显示节点的状态下，才接受 isShowByRadios 的逻辑
        // if (item.showOnRadios && this.isShowByNodes(item) && item.mode === 'edit') {
        //   res = this.isShowByRadios(item)
        // } else {
        //   res = this.isShowByNodes(item)
        // }
        res = this.isShowByNodes(item)
      } else {
        res = !!item.show
      }
      return res
    },
    evalModeState (item) {
      let res = 'readonly'
      // 如果限定角色，那么其他显示逻辑一律无视
      if (item.editOnRoles) {
        res = this.isInEditRole(item) ? 'edit' : 'readonly'
      } else {
        if (this.isApprovallor) {
          if (item.editOnRadios) {
            res = this.isInEditRadio(item) ? 'edit' : 'readonly'
          } else if (item.editOnNodes) {
            res = this.isInEditNode(item) ? 'edit' : 'readonly'
          }
        }
      }
      return res
    },
    isInEditRole (item) {
      const roleType = this.isOutsideStuff ? 1 : 0
      return !!(item.editOnRoles && item.editOnRoles.includes(roleType))
    },
    isInEditRadio (item) {
      return !!(item.editOnRadios && item.editOnRadios.includes(this.currentRadio))
    },
    isInEditNode (item) {
      return !!(item.editOnNodes && item.editOnNodes.includes(this.currentNode.nodeCode))
    },
    isShowByEnvs (item) {
      const env = this.isApprovallor ? 'handler' : 'viewer'
      return !!(item.showOnEnv && item.showOnEnv.includes(env))
    },
    isShowByRoles (item) {
      const roleType = this.isOutsideStuff ? 1 : 0
      return !!(item.showOnRoles && item.showOnRoles.includes(roleType))
    },
    isShowByRadios (item) {
      let def = utils.isValuable(item.show) ? item.show : true
      let res = !!(item.showOnRadios && item.showOnRadios.includes(this.currentRadio))
      // 如果 mode 类型为 readonly，就不需要隐藏
      // 因为 radio 只关乎是否需要取值，readonly 默认不会取值
      if (res === false && item.mode === 'readonly') {
        res = def
      }
      return res
    },
    isShowByNodes (item) {
      return !!(item.showOnNodes && item.showOnNodes.includes(this.currentNode.nodeCode))
    },
    updateRadio (radio) {
      this.currentRadio = radio
    },
    updateCurrentNode (node) {
      // 获取审批节点信息，并刷新组件
      this.currentNode = node
    },
    // 获取每个模块的form数据
    async getComponentsValues () {
      const params = {}
      const tips = []
      for (let index = 0; index < this.activePanels.length; index++) {
        const panel = this.activePanels[index]
        if (panel.show === false) continue
        const panelRef = `${panel.componentName}_${index}`
        if (panel.mode === 'edit') {
          const panelVM = await (this.$refs[panelRef][0] || this.$refs[panelRef]) || {}
          const handupFunc = panelVM['@GetResult']
          if (!handupFunc) continue
          const validRes = await handupFunc()
          if (validRes.type === 'success') {
            Object.assign(params, validRes.data)
          } else {
            tips.push(validRes.message)
          }
        }
      }
      return Promise.resolve({ params, tips })
    },
    getComponentsRequiredFields (params) {
      let requiredFields = []
      if (this.isApprovallor && this.currentOption) {
        // 要获取当前显示的input
        const inputs = this.currentOption.inputs || []
        inputs.forEach((item) => {
          if (item.show === true && item.required === true) {
            requiredFields.push(item.key)
          }
        })
      }
      return requiredFields
    },
    validateRequiredField ({ tips, params }) {
      const requiredFields = this.getComponentsRequiredFields(params)
      let isFinishRequiredField = true
      // 操作模块的必填字段验证
      if (requiredFields.length) {
        requiredFields.forEach((field) => {
          if (utils.isNone(params[field])) {
            isFinishRequiredField = false
          }
        })
      }
      // 默认情况下，如果选择 “通过” “重新提交”，tips有值的话，就代表必填条件未完成
      const requiredRaios = this.currentApimap.requiredRaios || ['1', '6']
      if (requiredRaios.includes(params.approvalResult) && tips.length) {
        isFinishRequiredField = false
      }
      return isFinishRequiredField
    },
    async submitHandler () {
      const values = await this.getComponentsValues()
      if (this.validateRequiredField(values)) {
        this.startApprove({
          ...values.params,
          id: this.recordData.id,
          instanceId: this.basicData.flowInstanceId || this.basicData.instanceId,
          currentFlowNode: this.basicData.flowNode || this.basicData.currentFlowNode
        })
      } else {
        this.$modal.warning({
          title: '提示',
          content: values.tips[0] || '请完成必填字段!'
        })
      }
    },
    // 发起审批
    async startApprove (params) {
      if (this.$props.beforeSubmit) {
        this.$props.beforeSubmit(params, this.scope)
      }
      let func
      if (utils.isFunction(this.currentApimap.submit)) {
        func = this.currentApimap.submit
      } else {
        func = api[this.currentApimap.submit]
      }
      const res = await func(params)
      if (res.code === 200) {
        this.$message.success('操作成功')
        this.$emit('close')
      } else {
        this.$modal.warning({
          title: '提示',
          content: res.message
        })
      }
    }
  },
  render (h) {
    const bridge = {
      ...this.bridge,
      apimap: this.apimap,
      tabProxy: this.tabProxy,
      recordData: this.recordData,
      currentNode: this.currentNode,
      activePanels: this.activePanels,
      dataSource: this.basicData
    }
    const renderPanel = (h) => {
      return this.activePanels.map((panel, index) => {
        if (!panel.show) return ''
        return <a-collapse-panel
          key={`${index}`}
          class="m-block"
          v-operator-panel-style={
            panel.show && panel.componentName === 'Operator'
          }
        >
          <div slot="header">
            <span>
              { panel.title }&nbsp;
              {
                panel.tips && <a-tooltip>
                  <template slot="title">
                    <s-lines value={panel.tips} len={999} />
                  </template>
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              }
            </span>
            <panel.component
              ref={`${panel.componentName}_${index}`}
              mode={panel.mode}
              columns={panel.columns}
              form-items={panel.formItems}
              approval-scope={this.scope}
              share-chanel={this.shareChanel}
              active-panels={this.activePanels}
              option={this.option}
              data-source={this.basicData}
              tab-proxy={this.tabProxy}
              current-panel={this.panel}
              current-node={this.currentNode}
              before-render={this.beforeRender}
              business-id={this.recordData.id}
              business-type={this.currentApimap.busunessType}
              bridge={{ ...bridge, panel }}
              onUpdateRadio={this.updateRadio}
              onSubmit={this.submitHandler}
              onShareChanel={this.onShareEvent}
            />
          </div>
        </a-collapse-panel>
      })
    }
    const renderCustom = (h) => {
      if (!this.customRender) return ''
      return <this.customRender
        approval-scope={this.scope}
        mode={this.customRender.mode}
        tab-proxy={this.tabProxy}
        bridge={{
          ...bridge,
          panel: this.customRender
        }}
        onSubmit={this.submitHandler}
      />
    }
    return <div>
      <ApprovalStepBar
        id={this.recordData.flowInstanceId || this.recordData.instanceId}
        nodes={utils.isFunction(this.currentApimap.stepNodes) ? this.currentApimap.stepNodes(this.scope) : this.currentApimap.stepNodes}
        onUpdate={this.uodateCurrentNode}
      />
      <a-collapse
        bordered={false}
        active-key={this.activePanels.map((i, ii) => `${ii}`)}
      >
        { renderPanel(h) }
      </a-collapse>
      {
        renderCustom(h)
      }
    </div>
  }
}

</script>
<style lang="less" scoped>
.ppproject-footer {
  text-align: center;
  margin: 2rem 0;
  button {
    width: 16rem;height:2.6rem;
  }
}
/deep/.ant-row {
  line-height: 2.5;
}
</style>
