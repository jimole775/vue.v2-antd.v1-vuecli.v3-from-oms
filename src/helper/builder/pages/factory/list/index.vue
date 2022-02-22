<template>
  <div>
    <div class="panel-content">
      <BuildFormItems :config="{ anchorText: '配置查询表单' }" @update="updateSearchor" />
    </div>
    <div class="panel-content">
      <TableSummary @update="updateSummary" />
    </div>
    <div v-if="isShowTable" class="panel-content">
      <TableColumns :data-source="listData" @projectApproval="projectApproval" @update="updateColumns" />
    </div>
    <div v-else class="panel-content btn-wrap">
      <ApiButton v-model="listApi" />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import utils from '@/utils'
import http from '@/utils/http'
import TableSummary from './modules/table-summary'
import BuildFormItems from '@/helper/builder/pages/factory/common/build-form-items'
import ApiButton from '@/helper/builder/pages/factory/common/api-button'
import TableColumns from './modules/table-columns'
export default {
  components: {
    ApiButton,
    TableSummary,
    TableColumns,
    BuildFormItems
  },
  props: {
    rank: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isShowTable () {
      return !!this.listApi.url
    }
  },
  data () {
    return {
      listData: [],
      summaryObject: {},
      listConfig: {
        columns: [],
        searchor: []
      },
      listApi: {
        key: 'list',
        label: '列表',
        url: undefined,
        method: undefined,
        params: undefined
      }
    }
  },
  watch: {
    listApi: {
      handler (api) {
        this.handupApimap({ list: api })
        this.testFetch(api)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async updateSummary (data) {
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
    // permission 为 0, 代表为全部，可以删除这个字段
    if (propsObject['permission'] === '0') {
      delete propsObject['permission']
    } else {
      const permission = propsObject['permission']
      propsObject['permission'] = [permission]
    }
    // 拼装 slotsRender 函数
    if (propsObject['slotsRender']) {
      const fnInstance = propsObject['slotsRender']
      propsObject['slotsRender'] = `function (h, vm) {\n${fnInstance}\n}\n`
    }
    // 拼装 scopedSlotsRender 函数
    if (propsObject['scopedSlotsRender']) {
      const fnInstance = propsObject['scopedSlotsRender']
      propsObject['scopedSlotsRender'] = `function (h, record, vm) {\n${fnInstance}\n}\n`
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
