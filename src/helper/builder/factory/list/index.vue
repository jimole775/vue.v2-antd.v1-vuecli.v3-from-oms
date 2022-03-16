<template>
  <div>
    <div class="panel-content">
      <BuildFormItems :config="{ anchorText: '配置查询表单' }" @update="updateSearchor" />
    </div>
    <div class="panel-content">
      <TableSummary @update="updateSummary" />
    </div>
    <div v-if="canShowTable" class="panel-content">
      <TableColumns :data-source="listData" @projectApproval="projectApproval" @update="updateColumns" />
    </div>
    <div v-else class="panel-content btn-wrap">
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import utils from '@/utils'
import http from '@/utils/http'
import TableSummary from './modules/table-summary'
import BuildFormItems from '@/helper/builder/common/config-modules/build-form-items'
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
      default: 0
    },
    tab: {
      type: Object,
      default: () => ({})
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
  watch: {
    tab: {
      handler (tab) {
        if (this.canShowTable) {
          this.testFetch(tab.api)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    updateSummary (data) {
      this.summaryObject = data
      this.handupApimap(this.summaryObject)
    },
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
      this.listConfig.searchor = transferFormItems(data)
      this.handup()
    },
    updateColumns (data) {
      this.listConfig.columns = transferColumns(data)
      this.handup()
    },
    handup () {
      Vue.bus.$emit('__list__', this.rank, this.listConfig)
    },
    handupApimap (data) {
      Vue.bus.$emit('__apimap__', this.rank, data)
    }
  }
}

function transferColumns (originColumns) {
  const copyColumns = utils.clone(originColumns)
  const columns = []
  copyColumns.forEach((col) => {
    const propsObject = col.props
    if (!propsObject) return false
    delete propsObject['anchor']
    delete propsObject['titleTips']
    delete propsObject['originTitle']
    // 当前只支持 "0":内部 "1":外部, 其他的情况，就把字段删除
    if (propsObject['permission'] === '0' || propsObject['permission'] === '1') {
      const permission = propsObject['permission']
      propsObject['permission'] = [permission]
    } else {
      delete propsObject['permission']
    }
    // 拼装 slotsRender 函数
    if (propsObject['slotsRender']) {
      const fnInstance = propsObject['slotsRender']
      propsObject['slotsRender'] = `(h, vm) => {\n${fnInstance}\n}\n`
    }
    // 拼装 scopedSlotsRender 函数
    if (propsObject['scopedSlotsRender']) {
      const fnInstance = propsObject['scopedSlotsRender']
      propsObject['scopedSlotsRender'] = `(h, record, vm) => {\n${fnInstance}\n}\n`
    }
    columns.push(propsObject)
  })
  return columns
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
