<template>
  <div>
    <div class="panel-content">
      <ConfigFormItems
        :key="table.searchor.length"
        :value="table.searchor"
        anchor-text="配置查询表单"
        @update="updateSearchor"
      />
    </div>
    <div class="panel-content">
      <TableSummary
        :key="table.columns.length"
        :value="summary"
        @updateBatchButton="updateBatchButton"
        @updateListDataApi="updateListDataApi"
        @updateApplySubmitApi="updateApplySubmitApi"
      />
    </div>
    <div class="panel-content">
      <TableColumns
        :key="table.columns.length"
        :data-api="summary.dataApi"
        :value="table.columns"
        :bridge="{ projectApproval }"
        @update="updateColumns"
      />
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import builder from '@builder/mixins/builder'
import TableSummary from './modules/table-summary'
import TableColumns from './modules/table-columns'
import ConfigFormItems from '@builder/config-modules/config-form-items'
export default {
  mixins: [builder],
  components: {
    TableSummary,
    TableColumns,
    ConfigFormItems
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
      summary: {
        batch: {},
        dataApi: {},
        applySubmitApi: {}
      },
      table: {
        columns: [],
        searchor: []
      }
    }
  },
  watch: {
    viewData: {
      handler (data) {
        if (data.list && data.list[this.currentRank]) {
          const { table = {}, summary = {} } = data.list[this.currentRank] || {}
          table.columns && (this.table['columns'] = utils.clone(table.columns))
          table.searchor && (this.table['searchor'] = utils.clone(table.searchor))
          summary.batch && (this.summary['batch'] = utils.clone(summary.batch))
          summary.dataApi && (this.summary['dataApi'] = utils.clone(summary.dataApi))
          summary.applySubmitApi && (this.summary['applySubmitApi'] = utils.clone(summary.applySubmitApi))
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
      this.table.searchor = data
      this.handup()
    },
    updateColumns (data) {
      this.table.columns = data
      this.handup()
    },
    updateApplySubmitApi (data) {
      this.summary.applySubmitApi = data
      this.handup()
    },
    updateListDataApi (data) {
      this.summary.dataApi = data
      this.handup()
    },
    updateBatchButton (data) {
      this.summary.batch = data
      this.handup()
    },
    handup () {
      const cacheData = {
        table: utils.clone(this.table),
        summary: utils.clone(this.summary)
        // batch: utils.clone(this.batch),
        // dataApi: utils.clone(this.dataApi),
        // applySubmitApi: utils.clone(this.applySubmitApi)
      }
      this.setViewData({ key: 'list', value: cacheData })
    }
  }
}

</script>
