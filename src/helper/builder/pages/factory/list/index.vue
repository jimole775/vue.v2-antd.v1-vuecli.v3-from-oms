<template>
  <div>
    <div class="panel-content">
      <BuildFormItems :config="{ anchorText: '配置查询表单' }" />
    </div>
    <div class="panel-content">
      <TableSummary @update="updateSummary" />
    </div>
    <div v-if="isShowTable" class="panel-content">
      <TableColumns :data-source="tableAgent.data" @projectApproval="projectApproval" />
    </div>
  </div>
</template>
<script>
// import utils from '@/utils'
import http from '@/utils/http'
import TableSummary from './modules/table-summary.vue'
import BuildFormItems from '@/helper/builder/pages/factory/common/build-form-items'
import TableColumns from './modules/table-columns.vue'
export default {
  components: {
    TableSummary,
    TableColumns,
    BuildFormItems
  },
  computed: {
    isShowTable () {
      return !!this.summary.find(i => i.title === '列表')
    }
  },
  data () {
    return {
      summary: [],
      tableAgent: {
        url: undefined,
        method: undefined,
        params: undefined,
        data: undefined
      }
    }
  },
  methods: {
    isTableModify (item) {
      return this.tableAgent.url !== item.url ||
        this.tableAgent.method !== item.method ||
        this.tableAgent.params !== item.params
    },
    updateSummary (data) {
      this.summary = data
      this.summary.forEach(async (item) => {
        if (item.title === '列表' && this.isTableModify(item)) {
          this.tableAgent.url = item.url
          this.tableAgent.method = item.method
          this.tableAgent.params = item.params
          this.tableAgent.data = await this.testFetch(item)
        }
      })
    },
    projectApproval () {
      this.$emit('switchTab', '2')
    },
    // 尝试获取样例数据
    async testFetch (componentInfo) {
      if (componentInfo.url) {
        const fn = http[componentInfo.method.toLocaleLowerCase()] || function () {}
        const params = componentInfo.method === 'GET' ? { params: componentInfo.params } : componentInfo.params
        const res = await fn.apply(http, [componentInfo.url, params])
        if (res.code === 200) {
          return Promise.resolve(res.data)
        } else {
          return Promise.resolve(undefined)
        }
      }
    }
  }
}
</script>
