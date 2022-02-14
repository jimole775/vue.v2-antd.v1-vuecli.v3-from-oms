<template>
  <div>
    <div class="panel-content">
      <BuildFormItems :config="{ anchorText: '配置查询表单' }" @update="updateSearchor" />
    </div>
    <div class="panel-content">
      <TableSummary @update="updateSummary" />
    </div>
    <div v-if="isShowTable" class="panel-content">
      <TableColumns :data-source="tableAgent.data" @projectApproval="projectApproval" @update="updateColumns" />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import http from '@/utils/http'
import TableSummary from './modules/table-summary'
import BuildFormItems from '@/helper/builder/pages/factory/common/build-form-items'
import TableColumns from './modules/table-columns'
export default {
  components: {
    TableSummary,
    TableColumns,
    BuildFormItems
  },
  props: {
    rank: {
      type: Number,
      default: 1
    }
  },
  computed: {
    isShowTable () {
      const list = this.summaryObject['list'] || {}
      return !!list.url
    }
  },
  data () {
    return {
      listConfig: {
        cloumns: [],
        searchor: []
      },
      summaryObject: {},
      tableAgent: {
        url: undefined,
        method: undefined,
        params: undefined,
        data: undefined
      }
    }
  },
  methods: {
    isTableModify (list) {
      return this.tableAgent.url !== list.url ||
        this.tableAgent.method !== list.method ||
        this.tableAgent.params !== list.params
    },
    async updateSummary (data) {
      this.summaryObject = data
      this.handupApimap(this.summaryObject)
      const list = this.summaryObject.list
      if (this.isTableModify(list)) {
        this.tableAgent.url = list.url
        this.tableAgent.method = list.method
        this.tableAgent.params = list.params
        this.tableAgent.data = await this.testFetch(list)
      }
    },
    projectApproval () {
      this.$emit('switchTab', '2')
    },
    // 尝试获取样例数据
    async testFetch (list) {
      if (list.url) {
        const fn = http[list.method.toLocaleLowerCase()] || function () {}
        const params = list.method === 'GET' ? { params: list.params } : list.params
        const res = await fn.apply(http, [list.url, params])
        if (res.code === 200) {
          return Promise.resolve(res.data)
        } else {
          return Promise.resolve(undefined)
        }
      }
    },
    updateSearchor (data) {
      this.listConfig.searchor = data
      this.handup()
    },
    updateColumns (data) {
      this.listConfig.columns = data
      this.handup()
    },
    handup () {
      Vue.bus.$emit('_list_', this.rank - 1, this.listConfig)
    },
    handupApimap (data) {
      Vue.bus.$emit('_apimap_', this.rank - 1, data)
    }
  }
}
</script>
