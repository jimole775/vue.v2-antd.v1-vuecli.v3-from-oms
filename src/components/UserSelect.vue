<template>
  <a-select
    label-in-value
    style="width: 100%"
    :mode="mode"
    :value="valueList"
    :show-arrow="false"
    :allow-clear="true"
    :filter-option="false"
    :disabled="disabled"
    :show-search="true"
    :placeholder="placeholder"
    :not-found-content="fetching ? undefined : null"
    @search="searchEvent"
    @change="handleChange"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
    <a-select-option v-for="item in optionList" :key="item.key" :title="item.label">
      {{ item.label }}
    </a-select-option>
  </a-select>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
export default {
  title: '用户选择',
  name: 'UserSelect',
  enumerated: true,
  props: {
    value: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    mode: {
      type: String,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    dataParams: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    this.searchEvent = utils.debounce(this.searchEvent, 150)
    this.handleChange = utils.debounce(this.handleChange, 150)
    return {
      valueList: utils.clone(this.value || []),
      fetching: false,
      optionList: []
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    value: function (val) {
      if (val) {
        this.clearData()
        this.valueList = utils.clone(val)
      }
    }
  },
  methods: {
    clearData () {
      this.optionList.length = 0
    },
    async searchEvent (value) {
      this.optionList = []
      const res = await this.fetcher(value)
      if (res.code === 200 && res.data) {
        this.optionList = this.createOptionList(res.data)
      }
    },
    async fetcher (value) {
      this.fetching = true
      const res = await api.getuserpool({
        name: value,
        ...this.$props.dataParams
      })
      this.fetching = false
      return Promise.resolve(res)
    },
    createOptionList (data) {
      const list = data.list ? data.list : data
      return list.map(item => {
        const name = item.name || item.displayName || 'N/A'
        const account = item.workAccount || item.userName || 'N/A'
        const workDeptName = item.workDeptName || 'N/A'
        return {
          label: `${account} ${name}（${workDeptName}）`,
          key: JSON.stringify({ key: account, label: name })
        }
      })
    },
    handleChange (value) {
      this.clearData()
      let valueList = []
      if (value instanceof Array) {
        valueList = [...value]
      } else if (!value) {
        valueList = []
      } else {
        valueList = [value]
      }
      this.fetching = false
      this.$emit('change', valueList)
    }
  }
}
</script>
