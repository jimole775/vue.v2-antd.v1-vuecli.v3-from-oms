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
      Vue.bus.$emit('__apimap__', this.rank, data)
    },
    handup (data) {
      Vue.bus.$emit('__apply__', this.rank, data)
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
      this.handup(model)
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
