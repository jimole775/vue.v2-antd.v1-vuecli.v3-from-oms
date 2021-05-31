<template>
  <a-select
    :mode="simpleSelect?'default':'multiple'"
    label-in-value
    :value="valueList"
    :show-search="simpleSelect"
    style="width: 100%"
    :placeholder="placeholder"
    :allow-clear="true"
    :dept-code="deptCode"
    :disabled="disabled"
    @search="fetchUser"
    @change="handleChange"
    :filter-option="false"
    :default-value="initialValue"
    :not-found-content="fetching ? undefined : null"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
    <a-select-option v-for="item in optionList" :key="item.key">{{ item.label }}</a-select-option>
  </a-select>
</template>
<script>
import api from '@/api'
import { debounce } from 'lodash'
export default {
  name: 'UserDeptSelect',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    simpleSelect: {
      type: Boolean,
      default: false
    },
    deptCode: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },

    initialValue: {
      type: Array,
      default: () => []
    }
  },
  data () {
    this.fetchUser = debounce(this.fetchUser, 150)
    this.handleChange = debounce(this.handleChange, 150)
    return {
      valueList: JSON.parse(JSON.stringify(this.value)),
      fetching: false,
      lastFetchId: 0,
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
        this.valueList = JSON.parse(JSON.stringify(val))
      }
    }
  },
  methods: {
    clearData () {
      this.optionList.length = 0
    },
    async fetchUser (value) {
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.optionList = []
      this.fetching = true
      // 调用接口api
      let obj = {}
      obj.deptCode = this.deptCode
      obj.name = value
      let res = await api.getDeptUsers(obj)
      if (res.code === 200) {
        if (fetchId !== this.lastFetchId) { // for fetch callback order
          return
        }
        const data = res.data.list.map(item => ({
          label: `${item.userName} ${item.displayName}`,
          key: JSON.stringify({ key: item.userName, label: item.displayName })
        }))
        this.optionList = data
        this.fetching = false
      }
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
