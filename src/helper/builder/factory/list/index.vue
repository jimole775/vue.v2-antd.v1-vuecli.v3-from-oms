<template>
  <div>
    <div class="panel-content">
      <BuildFormItems :config="{ anchorText: '配置查询表单' }" @update="updateSearchor" />
    </div>
    <div class="panel-content">
      <TableSummary :data-source="summaryObject" @update="updateSummary" />
    </div>
    <div v-if="canShowTable" class="panel-content">
      <TableColumns :data-source="listData" @projectApproval="projectApproval" @update="updateColumns" />
    </div>
    <div v-else class="panel-content btn-wrap">
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import http from '@/utils/http'
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
      listData: [],
      summaryObject: {},
      listConfig: {
        columns: [],
        searchor: []
      }
    }
  },
  computed: {
    canShowTable () {
      return this.tab.type === '0' && this.tab.api && this.tab.api.url
    },
    isListTab () {
      return this.tab.type === '0'
    }
  },
  watch: {
    tab: {
      handler (tab) {
        if (this.canShowTable) {
          this.testFetch(tab.api)
        }
      },
      deep: true,
      immediate: true
    },
    viewData: {
      handler (data) {
        if (data.list) {
          const currentModule = data.list[this.currentRank]
          this.listData = currentModule.listData
          this.summaryObject = currentModule.summaryObject
          this.listConfig = currentModule.listConfig
        }
      },
      immediate: true
    }
  },
  methods: {
    projectApproval () {
      this.$emit('switchTab', '2')
    },
    // 尝试获取样例数据
    async testFetch (api) {
      if (api.url) {
        const fn = http[api.method.toLocaleLowerCase()] || function () {}
        const params = api.method === 'GET' ? { params: api.params } : api.params
        try {
          const res = await fn.apply(http, [api.url, params])
          if (res.code === 200) {
            this.listData = res.data
          }
        } catch (error) {
          console.log(error)
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
    updateSummary (data) {
      this.summaryObject = data
      this.handup()
      this.handupApimap(this.summaryObject)
    },
    handup () {
      const cacheData = {
        listData: utils.clone(this.listData),
        listConfig: utils.clone(this.listConfig),
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
