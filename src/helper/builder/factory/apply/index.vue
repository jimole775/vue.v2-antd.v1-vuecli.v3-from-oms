<template>
  <div>
    <!-- <ApprovalNodesMap :api-name="''" :params="{ organizationCode: '' }" /> -->
    <!-- <BuildCollapsePanels @update="panelsUpdate" /> -->
    <BuildCollapsePanels :data-source="collapsePanels" @update="panelsUpdate" />
    <SubmitBar @update="apiUpdate" />
  </div>
</template>
<script>
import utils from '@/utils'
import mixins from '@builder/mixins'
// import ApprovalNodesMap from '@/components/ApprovalNodesMap'
import BuildCollapsePanels from '@builder/config-modules/build-collapse-panels'
import SubmitBar from './submit-bar.vue'
export default {
  mixins: [mixins],
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
      this.setViewData({ key: 'apimap', value: data })
      this.setBuildData({ key: 'apimapConfig', index: this.rank, value: data })
    },
    handupBuildData (data) {
      this.setBuildData({ key: 'applyConfig', index: this.rank, value: data })
      this.handupViewData()
    },
    handupViewData () {
      const cacheData = {
        collapsePanels: utils.clone(this.collapsePanels)
      }
      this.setViewData({ key: 'apply', value: cacheData })
    },
    transfer () {
      const model = {
        panels: []
      }
      const tabPanels = utils.clone(this.collapsePanels || [])
      tabPanels.forEach((aPanel) => {
        const panels = model['panels']
        const panelModel = {
          mode: 'edit',
          show: true,
          title: aPanel.title,
          formItems: transferFormItems(aPanel.formItems),
          component: aPanel.component || 'FormItemRender'
        }
        panels.push(panelModel)
      })
      this.handupBuildData(model)
    }
  }
}

function transferFormItems (originFormItems, fields = ['originProps', 'stepNodes', 'configType']) {
  const cFormItems = utils.clone(originFormItems)
  const formItems = []
  cFormItems.forEach((formItem) => {
    fields.forEach((field) => {
      delete formItem[field]
    })
    deleteNoneFields(formItem)
    formItems.push(formItem)
  })
  return formItems
}

// 清掉空值的字段
function deleteNoneFields (formItem) {
  const fields = ['props', 'operations', 'component']
  fields.forEach((field) => {
    const val = formItem[field]
    if (
      val === undefined ||
      (utils.isObject(val) && Object.keys(val).length === 0) ||
      (utils.isArray(val) && val.length === 0)
    ) {
      delete formItem[field]
    }
  })
}

</script>
<style lang="less" scoped>
/deep/.ant-row {
  line-height: 2.5;
}
</style>
