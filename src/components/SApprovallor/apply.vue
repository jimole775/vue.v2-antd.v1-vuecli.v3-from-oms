<template>
  <div>
    <a-collapse
      :bordered="false"
      :active-key="['1','2','3','4','5']"
    >
      <template v-for="(panel, index) in activePanels">
        <a-collapse-panel
          v-if="panel.show"
          :key="`${index + 1}`"
          class="m-block"
        >
          <div slot="header">
            <span>
              {{ panel.title }}&nbsp;
              <a-tooltip v-if="panel.tips">
                <template slot="title">
                  <span>{{ panel.tips }}</span>
                </template>
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
          </div>
          <component
            :ref="`${panel.componentName}_${index}`"
            :apply-scope="scope"
            :is="panel.component"
            :option="panel.option"
            :before-render="beforeRender"
            :before-submit="beforeSubmit"
            :form-items="panel.formItems"
            :active-panels="activePanels"
            :mode="panel.mode"
            :tab-proxy="tabProxy"
            :share-chanel="shareChanel"
            :bridge="{
              ...bridge,
              panel,
              apply,
              apimap,
              tabProxy,
              activePanels,
              option: panel.option,
              columns: panel.columns,
              formItems: panel.formItems
            }"
            @updateRadio="updateRadio"
            @shareChanel="onShareEvent"
          />
        </a-collapse-panel>
      </template>
    </a-collapse>
    <div class="ppproject-footer">
      <a-button class="submit" type="primary" @click="emitApply">提交</a-button>
      <a-button class="close" type="primary" ghost @click="$emit('close')">取消</a-button>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
import { mapState } from 'vuex'
export default {
  props: {
    apply: {
      type: Object,
      required: true
    },
    apimap: {
      type: Object,
      required: true
    },
    tabProxy: {
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
      currentRadio: '1',
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
    currentApimap () {
      return this.apimap.apply || {}
    }
  },
  watch: {
    apply: {
      handler (apply) {
        this.activePanels = this.evalPanels(apply)
      },
      immediate: true
    }
  },
  methods: {
    evalPanels (apply) {
      const panels = apply.panels || []
      return panels.map((panel) => {
        this.evalPanelName(panel)
        this.$set(panel, 'mode', this.evalModeState(panel))
        this.$set(panel, 'show', this.evalShowState(panel))
        this.evalFormItemsProps(panel)
        return panel
      })
    },
    evalFormItemsProps (panel) {
      if (panel.formItems && panel.formItems.length) {
        panel.formItems.forEach((formItem) => {
          this.extendsPanelProps(panel, formItem)
          this.$set(formItem, 'mode', this.evalModeState(formItem))
          this.$set(formItem, 'show', this.evalShowState(formItem))
          this.cutFieldsByMode(formItem)
        })
      }
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
    extendsPanelProps (panel, formItem) {
      // 继承 panel 的 editOnNodes
      if (formItem.editOnNodes === undefined && panel.editOnNodes) {
        formItem.editOnNodes = panel.editOnNodes
      }
      // 继承 panel 的 showOnNodes
      if (formItem.showOnNodes === undefined && panel.showOnNodes) {
        formItem.showOnNodes = panel.showOnNodes
      }
    },
    evalModeState (item) {
      let res = 'readonly'
      // 如果限定角色，那么其他显示逻辑一律无视
      if (item.editOnRoles) {
        res = this.isInEditRole(item) ? 'edit' : 'readonly'
      } else {
        if (item.editOnRadios) {
          res = this.isInEditRadio(item) ? 'edit' : 'readonly'
        } else if (item.editOnNodes) {
          res = this.isInEditNode(item) ? 'edit' : 'readonly'
        }
      }
      return res
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
      } else if (utils.isValuable(item.show)) {
        res = !!item.show // 如果用户设置了show，直接取值，不用再进行估算
      } else {
        // 只有当前 item 在可显示节点的状态下，才接受 isShowByRadios 的逻辑
        if (item.showOnRadios && this.isShowByNodes(item)) {
          res = this.isShowByRadios(item)
        } else {
          res = this.isShowByNodes(item)
        }
      }
      return res
    },
    cutFieldsByMode (item) {
      // edit 模式需要删掉 readonly 下的属性
      if (item.mode === 'edit') {
      }
      // readonly 模式需要删掉 edit 下的所有渲染辅助项
      if (item.mode === 'readonly') {
        delete item.required
        delete item.component
        delete item.paramsTransfer
        delete item.onChange
      }
    },
    isInEditRole (item) {
      const roleType = this.isOutsideStuff ? 1 : 0
      return !!(item.editOnRoles && item.editOnRoles.includes(roleType))
    },
    isInEditRadio (item) {
      return !!(item.editOnRadios && item.editOnRadios.includes(this.currentRadio))
    },
    isInEditNode (item) {
      return !!(item.editOnNodes && item.editOnNodes.includes('apply'))
    },
    isShowByRadios (item) {
      return !!(item.showOnRadios && item.showOnRadios.includes(this.currentRadio))
    },
    isShowByEnvs (item) {
      return !!(item.showOnEnv && item.showOnEnv.includes('handler'))
    },
    isShowByRoles (item) {
      const roleType = this.isOutsideStuff ? 1 : 0
      return !!(item.showOnRoles && item.showOnRoles.includes(roleType))
    },
    isShowByNodes (item) {
      return !!(item.showOnNodes && item.showOnNodes.includes('apply'))
    },
    updateRadio (radio) {
      this.currentRadio = radio
    },
    async emitApply () {
      const { successData, failureTips } = await this.getComponentsSubmitData()
      if (failureTips.length) {
        return this.$modal.warning({
          title: '提示',
          content: failureTips[0]
        })
      }
      this.startApprove({ ...successData })
    },
    // 发起审批
    async startApprove (params) {
      const cparams = this.$props.beforeSubmit(params, this.scope)
      const res = await api[this.currentApimap.submit](cparams)
      if (res.code === 200) {
        this.$message.success('操作成功')
        this.$emit('close')
      } else {
        this.$modal.warning({
          title: '提示',
          content: res.message
        })
      }
    },
    getComponentsSubmitData () {
      return new Promise(async (resolve) => {
        let successData = {}
        const failureTips = []
        for (let index = 0; index < this.activePanels.length; index++) {
          const panel = this.activePanels[index]
          if (panel.show === false) continue
          const panelVM = await this.$refs[`${panel.componentName}_${index}`][0] || {}
          const handupFunc = panelVM['@GetResult']
          if (!handupFunc) continue
          const handupData = await handupFunc()
          if (handupData.type === 'failure') {
            failureTips.push(handupData.message)
          } else {
            successData = { ...successData, ...handupData.data }
          }
        }
        return resolve({ failureTips, successData })
      })
    },
    onShareEvent (key = '', data) {
      this.$set(this.shareChanel, key, data)
    }
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
