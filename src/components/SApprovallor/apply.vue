<template>
  <div>
    <a-collapse
      :bordered="false"
      :active-key="['1','2','3','4','5']"
    >
      <template v-for="(panel, index) in panels">
        <a-collapse-panel
          v-if="panel.show"
          :header="panel.title"
          :key="`${index + 1}`"
          class="m-block"
        >
          <component
            :ref="`${panel.panelName}_${index}`"
            :is="panel.component"
            :operation-item="panel.operationItem"
            :before-render="beforeRender"
            :before-submit="beforeSubmit"
            :form-items="panel.formItems"
            :panels="panels"
            :mode="panel.mode"
            :tab-proxy="tabProxy"
            :bridge="{
              ...bridge,
              panel,
              panels,
              apply,
              apimap,
              tabProxy,
              columns: panel.columns,
              formItems: panel.formItems,
              operationItem: panel.operationItem,
            }"
          />
        </a-collapse-panel>
      </template>
    </a-collapse>
    <div class="ppproject-footer">
      <a-button type="primary" ghost @click="emitApply">发起</a-button>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
export default {
  props: {
    apimap: {
      type: Object,
      required: true
    },
    apply: {
      type: Object,
      required: true
    },
    tabProxy: {
      type: Object,
      required: true
    },
    bridge: {
      type: Object,
      default: () => ({})
    },
    beforeRender: {
      type: Function,
      default: p => p
    },
    beforeSubmit: {
      type: Function,
      default: p => p
    }
  },
  data () {
    return {
      scope: this,
      panels: []
    }
  },
  watch: {
    apply: {
      handler (aModulesMap) {
        const panels = aModulesMap.panels || []
        this.panels = panels.map((item) => {
          if (utils.isString(item.component)) {
            item.panelName = item.component
          }
          if (utils.isObject(item.component)) {
            item.panelName = item.component.name || 'customRender'
          }
          if (utils.isNone(item.component)) {
            item.panelName = 'customRender'
          }
          if (item.show === undefined) {
            item.show = true
          }
          return item
        })
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async emitApply () {
      const { successData, failureTips } = await this.getComponentsFieldsValue()
      if (failureTips.length) {
        return this.$modal.warning({
          title: '提示',
          content: failureTips[0]
        })
      }
      const params = {
        ...successData
      }
      this.startApprove(params)
    },
    // 发起审批
    async startApprove (params) {
      const cparams = this.$props.beforeSubmit(params, this.scope)
      const res = await api[this.apimap.apply](cparams)
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
    getComponentsFieldsValue () {
      return new Promise(async (resolve) => {
        let successData = {}
        const failureTips = []
        for (let index = 0; index < this.panels.length; index++) {
          const panel = this.panels[index]
          if (panel.show === false) continue
          const panelDom = await this.$refs[`${panel.panelName}_${index}`][0]
          const editData = await panelDom.getFieldsValue()
          if (editData.type === 'failure') {
            failureTips.push(editData.message)
          } else {
            successData = { ...successData, ...editData.data }
          }
        }
        return resolve({ failureTips, successData })
      })
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
