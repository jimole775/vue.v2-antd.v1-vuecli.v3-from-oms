<template>
  <div>
    <a-select
      show-search
      :value="NewValue"
      :allow-clear="true"
      :show-arrow="false"
      :filter-option="false"
      :default-value="initialValue"
      :default-active-first-option="false"
      @search="handleSearch"
      @change="changEvent"
    >
      <a-select-option v-for="item in deptDataOptions" :key="item.departmentNumber">
        <a-tooltip :title="item.fullname">{{ item.fullname }}</a-tooltip>
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
import { debounce } from 'lodash'
export default {
  name: 'DepatmentSelect',
  props: {
    value: {
      type: String,
      default: ''
    },
    initialValue: {
      type: String,
      default: ''
    },
    status: {
      type: String || Number,
      default: '1'
    },
    omsLevel: {
      type: String,
      default: undefined
    }
  },
  computed: {
    NewValue: {
      get: function () {
        return this.value
      }
    }
  },
  watch: {
    initialValue: {
      handler (val) {
        if (val) {
          this.handleSearch(val)
        }
      },
      immediate: true
    }
  },
  data () {
    this.handleSearch = debounce(this.handleSearch, 150)
    this.changEvent = debounce(this.changEvent, 150)
    return {
      deptDataOptions: []
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {
    // 搜索联想部门
    handleSearch (keyword) {
      if (utils.isString(keyword) && keyword.trim()) {
        api.queryDepartments({
          fullname: keyword.trim(),
          parentDepartmentNumber: this.parentDepartmentNumber,
          status: this.status,
          omsLevel: this.omsLevel
        }).then(res => {
          if (res.code === 200) {
            this.deptDataOptions = res.data.list
          }
        })
      }
    },
    selectChange (val) {
      let msg = ''
      if (val) {
        msg = val
      }
      this.$emit('change', msg)
    },
    changEvent (val) {
      let msg = ''
      if (val) {
        msg = val
      }
      let selectItem = {}
      for (let index = 0; index < this.deptDataOptions.length; index++) {
        const option = this.deptDataOptions[index]
        if (option.departmentNumber === msg) {
          selectItem = option
          break
        }
      }
      this.$emit('change', msg, selectItem)
    }
  }
}
</script>
