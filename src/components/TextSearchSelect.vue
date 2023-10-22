<template>
  <a-auto-complete
    ref="TextSearchSelectRef"
    style="width: 100%"
    :show-arrow="false"
    :allow-clear="false"
    :filter-option="false"
    :show-search="true"
    :value="value"
    :mode="'default'"
    :disabled="disabled"
    :placeholder="placeholder"
    :not-found-content="loading ? undefined : null"
    :data-source="optionList"
    @search="searchEvent"
    @change="changeEvent"
  >
    <a-spin v-if="loading" slot="notFoundContent" size="small" />
  </a-auto-complete>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
import flow from '@/utils/flow'
export default {
  name: 'TextSearchSelect',
  props: {
    // 需要注意：options 和 api 互斥
    api: {
      type: String | Function
    },
    // 需要注意：options 和 api 互斥
    options: {
      type: Array
    },
    field: {
      type: String
    },
    dataDir: {
      type: String
    },
    value: {
      type: String,
      default: undefined
    },
    disabled: {
      type: String,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    // 是否允许空值查询
    nullable: {
      type: Boolean,
      default: false
    }
  },
  model: {
    props: 'value',
    event: 'change'
  },
  data () {
    return {
      loading: false,
      wholeList: [],
      optionList: [],
      dataCache: []
    }
  },
  watch: {
    options: {
      handler (data = []) {
        this.dataCache = utils.clone(data)
        this.wholeList = utils.clone(data).map(i => this.field ? i[this.field] : i)
        this.optionList = utils.clone(this.wholeList)
      },
      immediate: true
    }
  },
  mounted () {
    // 如果允许空值搜索，那么提供一版默认数据供用户选择
    if (this.nullable && this.api) {
      this.request('').then(res => {
        this.handleResponse(res)
      })
    }
  },
  methods: {
    searchEvent (val = '') {
      val = utils.trim(val)
      if (this.$props.api) {
        if (utils.isValuable(val) || (utils.isNone(val) && this.nullable)) {
          flow.debounce(this.request, val).then((res) => {
            res && this.handleResponse(res)
          })
        }
      } else {
        // 没有查询接口，直接根据查询值，对列表进行筛选
        if (val === '') {
          this.optionList = utils.clone(this.wholeList)
        } else {
          this.optionList = this.wholeList.filter(i => i.includes(val))
        }
      }
    },
    changeEvent (val = '') {
      const checkedItem = this.dataCache.find(item => (this.field ? item[this.field] : item) === val)
      this.$emit('change', val, checkedItem)
    },
    request (sval) {
      if (!this.$props.api) {
        const msg = 'TextSearchSelect 未绑定查询接口！'
        return this.$message.warning(msg)
      }
      const func = utils.isFunction(this.$props.api)
        ? this.$props.api
        : api[this.$props.api]
      this.loading = true
      return func(sval)
    },
    handleResponse (res) {
      this.loading = false
      if (res.code === 200) {
        const correctData = this.getCorrectServerData(res.data)
        this.dataCache = correctData
        this.optionList = correctData.map(item => this.field ? item[this.field] : item)
      }
    },
    getCorrectServerData (data) {
      return this.dataDir ? data[this.dataDir] : data
    }
  }
}

</script>