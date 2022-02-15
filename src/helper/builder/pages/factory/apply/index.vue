<template>
  <div>
    <!-- <ApprovalNodesMap :api-name="''" :params="{ organizationCode: '' }" /> -->
    <!-- <BuildCollapsePanels @update="panelsUpdate" /> -->
    <BuildCollapsePanels :data-source="collapsePanels" @update="panelsUpdate" />
    <SubmitBar @update="apiUpdate" />
  </div>
</template>
<script>
import Vue from 'vue'
import utils from '@/utils'
// import ApprovalNodesMap from '@/components/ApprovalNodesMap'
import BuildCollapsePanels from '@/helper/builder/pages/factory/common/build-collapse-panels'
import SubmitBar from './submit-bar.vue'
export default {
  components: {
    SubmitBar,
    // ApprovalNodesMap,
    BuildCollapsePanels
  },
  props: {
    rank: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      collapsePanels: []
    }
  },
  methods: {
    apiUpdate (data) {
      this.handupApi(data)
    },
    panelsUpdate (data) {
      this.collapsePanels = data
      this.transfer()
    },
    handupApi (data) {
      Vue.bus.$emit('_apimap_', this.rank, data)
    },
    handup (data) {
      Vue.bus.$emit('_apply_', this.rank, data)
    },
    transfer () {
      const model = {
        panels: []
      }
      const tabPanels = utils.clone(this.collapsePanels || [])
      tabPanels.forEach((aPanel) => {
        const panels = model['panels']
        const cFormItems = utils.clone(aPanel.formItems)
        aPanel.formItems = [] // 先清空，再重新存
        cFormItems.forEach((formItem) => {
          delete formItem.originProps
          delete formItem.stepNodes
          delete formItem.configType
          if (Object.keys(formItem.props).length === 0) {
            delete formItem.props
          }
          aPanel.formItems.push(formItem)
        })
        const panelModel = {
          mode: 'edit',
          show: true,
          title: aPanel.title,
          formItems: aPanel.formItems,
          component: aPanel.component || 'FormItemRender'
        }
        panels.push(panelModel)
      })
      console.log('model:', model)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-row {
  line-height: 2.5;
}
</style>
