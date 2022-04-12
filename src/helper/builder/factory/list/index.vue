<template>
  <div>
    <div class="panel-content">
      <BuildFormItems :data-source="list.searchor" :config="{ anchorText: '配置查询表单' }" @update="updateSearchor" />
    </div>
    <div class="panel-content">
      <TableSummary :data-source="summaryObject" @update="updateSummary" />
    </div>
    <div class="panel-content">
      <TableColumns
        :data-source="list.columns"
        :tab="tab"
        :bridge="{
          projectApproval
        }"
        @update="updateColumns"
      />
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import mixins from '@builder/mixins'
import TableSummary from './modules/table-summary'
import BuildFormItems from '@builder/config-modules/build-form-items'
import TableColumns from './modules/table-columns'
export default {
  mixins: [mixins],
  components: {
    TableSummary,
    TableColumns,
    BuildFormItems
  },
  props: {
    rank: {
      type: Number,
      default: 0
    },
    tab: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      summaryObject: {},
      list: {
        columns: [],
        searchor: []
      }
    }
  },
  computed: {
    canShowTable () {
      return this.tab.type === '0' && this.tab.api && this.tab.api.url
    }
  },
  watch: {
    viewData: {
      handler (data) {
        if (data.list) {
          const currentModule = data.list[this.currentRank]
          this.summaryObject = currentModule.summaryObject
          this.list = currentModule.list
        }
      },
      immediate: true
    }
  },
  methods: {
    projectApproval () {
      this.$emit('switchTab', '2')
    },
    updateSearchor (data) {
      this.list.searchor = data
      this.handup()
    },
    updateColumns (data) {
      this.list.columns = data
      this.handup()
    },
    updateSummary (data) {
      this.summaryObject = data
      this.handup()
      this.handupApimap(this.summaryObject)
    },
    handup () {
      const cacheData = {
        list: utils.clone(this.list),
        summaryObject: utils.clone(this.summaryObject)
      }
      this.setViewData({ key: 'list', value: cacheData })
      this.setBuildData({ key: 'list', value: cacheData })
    },
    handupApimap (data) {
      this.setViewData({ key: 'apimap', value: data })
      this.setBuildData({ key: 'apimap', value: data })
    }
  }
}

</script>
