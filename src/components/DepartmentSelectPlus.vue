<template>
  <a-select
    label-in-value
    style="width: 100%"
    :value="value"
    :allow-clear="true"
    :filter-option="false"
    :disabled="disabled"
    :show-search="simpleSelect"
    :placeholder="placeholder"
    :default-value="initialValue"
    :mode="simpleSelect ? 'default' : 'multiple'"
    @search="handleSearch"
    @change="handleChange"
  >
    <a-select-option v-for="item in optionList" :key="item.key" :title="item.label">
      {{ item.label }}
    </a-select-option>
  </a-select>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
import { debounce } from 'lodash'
export default {
  name: 'DepartmentSelectPlus',
  props: {
    value: {
      type: Array,
      default: null
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    simpleSelect: {
      type: Boolean,
      default: true
    },
    initialValue: {
      type: Array,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    supplierCode: {
      type: String,
      default: ''
    }
  },
  data () {
    this.handleSearch = debounce(this.handleSearch, 150)
    this.handleChange = debounce(this.handleChange, 150)
    return {
      optionList: []
    }
  },
  watch: {
    initialValue: {
      handler (val) {
        if (val) {
          const [keys, names] = utils.splitOptionItems(val)
          if (keys && names) {
            this.handleSearch(names)
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    // 搜索联想部门
    handleSearch (keyword) {
      if (keyword.trim()) {
        api.queryDepartments({
          fullname: keyword.trim(),
          parentDepartmentNumber: this.parentDepartmentNumber,
          status: '1'
        }).then(res => {
          if (res.code === 200) {
            this.optionList = res.data.list.map(item => ({
              label: item.fullname,
              key: JSON.stringify({ key: item.departmentNumber, label: item.fullname })
            }))
          }
        })
      }
    },
    handleChange (value) {
      let valueList = []
      if (value instanceof Array) {
        valueList = [...value]
      } else if (!value) {
        valueList = []
      } else {
        valueList = [value]
      }
      this.$emit('change', valueList)
    }
  }
}
</script>
