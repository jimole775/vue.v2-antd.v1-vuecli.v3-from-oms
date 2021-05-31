<template>
  <a-select
    label-in-value
    :value="valueList"
    :show-search="true"
    style="width: 100%"
    placeholder="请输入姓名"
    :allow-clear="true"
    @search="fetchUser"
    @change="handleChange"
    :filter-option="false"
    :default-value="initialValue"
    :disabled="disabled"
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
  name: 'UserSelect',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    initialValue: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    indexUser: {
      type: Number,
      default: null
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
      obj.name = value
      let res = await api.queryAllEpibolyAccountByName(value)
      if (res.code === 200) {
        if (fetchId !== this.lastFetchId) {
          return
        }
        this.optionList = []
        res.data.forEach(item => {
          let length = item.certificateNo.length
          let idc = item.certificateNo.substr(0, 4) + '*********' + item.certificateNo.substr(length - 4, length - 1)
          this.optionList.push({
            label: `${item.workAccount || idc} ${item.name}`,
            key: JSON.stringify({ key: item.workAccount, label: item.name, certificateNo: item.certificateNo, id: item.id })
          })
        })
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
      this.$emit('change', valueList, this.indexUser)
    }
  }
}
</script>
