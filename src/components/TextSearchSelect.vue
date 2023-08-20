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
import utils from '@/utils'
export default {
  name: 'TextSearchSelect',
  props: {
    // 需要注意：options 和 searchor 互斥
    searchor: {
      type: Function
    },
    // 需要注意：options 和 searchor 互斥
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
      threadConsuming: false,
      threads: [],
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
    if (this.nullable && this.searchor) {
      this.request('').then(res => {
        this.handleResponse(res)
      })
    }
  },
  methods: {
    searchEvent (val = '') {
      val = utils.trim(val)
      // 有查询接口，就走多线程模式
      if (this.searchor) {
        if (utils.isValuable(val) || (utils.isNone(val) && this.nullable)) {
          this.collection(val)
          if (!this.threadConsuming) {
            this.consumeThreads()
          }
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
    collection (val = '') {
      this.threads.push(val)
    },
    async consumeThreads () {
      if (this.threads.length === 0) {
        this.threadConsuming = false
        return false
      }
      if (this.loading === true) {
        return this.next()
      }
      this.threadConsuming = true
      const sval = this.useThread()
      const res = await this.request(sval)
      this.handleResponse(res)
      return this.next()
    },
    // 只使用最后一个，其他的全部弃用
    useThread () {
      const item = this.threads.pop()
      this.threads = []
      return item
    },
    request (sval) {
      if (!this.$props.searchor) {
        const msg = 'TextSearchSelect 未绑定查询接口！'
        return this.$message.warning(msg)
      }
      this.loading = true
      return this.$props.searchor(sval)
    },
    handleResponse (res) {
      this.loading = false
      if (res.code === 200) {
        const correctData = this.getCorrectServerData(res.data)
        this.dataCache = correctData
        this.optionList = correctData.map(item => this.field ? item[this.field] : item)
      }
    },
    next () {
      setTimeout(() => {
        return this.consumeThreads()
      }, 500)
    },
    getCorrectServerData (data) {
      return this.dataDir ? data[this.dataDir] : data
    }
  }
}

</script>