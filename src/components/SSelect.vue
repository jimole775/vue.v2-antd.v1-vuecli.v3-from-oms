<template>
  <a-select
    :mode="mode"
    :size="size"
    :value="value"
    :filter-option="false"
    :disabled="disabled"
    :allow-clear="allowClear"
    :show-search="showSearch"
    :show-arrow="!showSearch"
    :placeholder="placeholder"
    :not-found-content="fetching ? undefined : null"
    @search="searchEvent"
    @change="handleChange"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
    <a-select-option v-for="(option, index) in optionList" :key="index" :value="option[field.key]" :title="option[field.label]">{{ option[field.label] }}</a-select-option>
  </a-select>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
export default {
  name: 'SSelect',
  props: {
    field: {
      type: Object,
      default: ({ key: 'key', label: 'label' })
    },
    value: {
      type: [String, Number, Array],
      default: undefined
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    mode: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 需要注意：options 和 searchor 和 api 互斥
    api: {
      type: String,
      default: ''
    },
    dataDir: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => ({})
    },
    // 需要注意：options 和 searchor 和 api 互斥
    options: {
      type: Array,
      default: () => []
    },
    // 需要注意：options 和 searchor 和 api 互斥
    searchor: {
      type: Function,
      default: undefined
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    // 是否允许空值查询
    nullable: {
      type: Boolean,
      default: true
    },
    immediate: {
      type: Boolean,
      default: true
    },
    allowClear: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      optionList: [],
      fetching: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    params: {
      handler (params) {
        params && this.searchEvent()
      },
      deep: true
    },
    options: {
      handler (options) {
        options && (this.optionList = utils.clone(options))
      },
      immediate: true
    }
  },
  mounted () {
    if (this.immediate) {
      this.fetchor()
    }
  },
  methods: {
    async searchEvent (value) {
      if (!value && !this.nullable) return false
      this.optionList = []
      this.fetching = true
      this.optionList = await this.fetchor(value)
      this.fetching = false
    },
    async execApiEvent (value) {
      const params = {
        ...this.params,
        value,
        $slient: true
      }
      const res = await api[this.api](params)
      const finalData = this.evalResponseData(res)
      return Promise.resolve(finalData)
    },
    evalResponseData (res) {
      if (res.code === 200) {
        if (this.$props.dataDir && utils.isString(this.$props.dataDir)) {
          return utils.readTreeByPath(res.data, this.$props.dataDir)
        } else {
          return res.data
        }
      }
    },
    async execSearchor (value) {
      let evalRes = await this.searchor(value)
      if (utils.isBackendResponse(evalRes)) {
        if (this.$props.dataDir && utils.isString(this.$props.dataDir)) {
          evalRes = utils.readTreeByPath(evalRes.data, this.$props.dataDir)
        } else {
          evalRes = evalRes.data
        }
      }
      return Promise.resolve(evalRes)
    },
    fetchor (value) {
      if (this.api) {
        return this.execApiEvent(value)
      }
      if (this.searchor) {
        return this.execSearchor(value)
      }
      if (this.options) {
        return Promise.resolve(this.nativeFilter(value))
      }
    },
    nativeFilter (value) {
      if (utils.isNone(value)) return this.options
      return this.options.filter(option => {
        if (!option) return false
        return option[this.field.label].includes(value)
      })
    },
    handleChange (value) {
      const selectedItems = this.optionList.filter(option => {
        if (utils.isArray(value)) {
          return value.includes(option[this.field.key])
        } else {
          return option[this.field.key] === value
        }
      })
      this.$emit('change', value, selectedItems)
    }
  }
}
</script>
