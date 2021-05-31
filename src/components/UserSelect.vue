<template>
  <a-select
    label-in-value
    style="width: 100%"
    :value="valueList"
    :show-arrow="false"
    :allow-clear="true"
    :filter-option="false"
    :disabled="disabled"
    :show-search="simpleSelect"
    :placeholder="placeholder"
    :default-value="initialValue"
    :mode="simpleSelect ? 'default' : 'multiple'"
    :not-found-content="fetching ? undefined : null"
    @search="fetchUser"
    @change="handleChange"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
    <a-select-option v-for="item in optionList" :key="item.key">
      {{ item.label }}
    </a-select-option>
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
      default: '请输入'
    },
    simpleSelect: {
      type: Boolean,
      default: false
    },
    initialValue: {
      type: Array,
      default: () => []
    },
    isTm: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    supplierCode: {
      type: String,
      default: ''
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
  mounted () {
    // this.value = []
    // console.log(this.$props.simpleSelect, this.value)
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    // valueList: function (val) {
    //   this.$emit('change', this.valueList)
    // },
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
      if (this.$props.isTm) {
        if (this.$props.supplierCode) {
          obj.supplierCode = this.supplierCode
        }
        let res = await api.getTmBankByName(obj)
        if (res.code === 200) {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return
          }
          const data = res.data.map(item => ({
            label:
              this.indexUser === null
                ? `${item.workAccount} ${item.name}（${item.workDeptName}）`
                : `${item.workAccount}`,
            key: JSON.stringify({ key: item.workAccount, label: item.name })
          }))
          this.optionList = data
          this.fetching = false
        }
      } else {
        let res = await api.getUserList(obj)
        if (res.code === 200) {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return
          }
          const list = res.data ? res.data.list : []
          const data = list.map(item => ({
            label: `${item.userName} ${item.displayName}（${item.workDeptName}）`,
            key: JSON.stringify({ key: item.userName, label: item.displayName })
          }))
          this.optionList = data
          this.fetching = false
        }
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
