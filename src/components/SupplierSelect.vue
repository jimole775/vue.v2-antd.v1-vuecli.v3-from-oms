<template>
  <a-select
    show-search
    option-filter-prop="children"
    :allow-clear="true"
    :placeholder="placeholder"
    :mode="mode"
    :disabled="disabled"
    :value="value"
    :filter-option="filterOption"
    :default-value="initialValue"
    @change="handleChange"
  >
    <a-select-option key="" v-if="showAll">全部</a-select-option>
    <a-select-option v-for="item in dictList" :key="item.supplierCode">{{ item.abbreviation }}</a-select-option>
  </a-select>
</template>

<script>
import utils from '@/utils'
import { mapActions } from 'vuex'

export default {
  name: 'SupplierSelect',
  props: {
    placeholder: {
      type: String,
      default: '请选择'
    },
    initialValue: {
      type: String | Array,
      default: null
    },
    mode: {
      type: String,
      default: 'default'
    },
    showAll: {
      type: Boolean,
      default: false
    },
    value: {
      type: String | Array,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  mounted () {
    if (utils.isNone(this.dictList)) {
      this.loadSuppliers()
    }
  },
  computed: {
    dictList () {
      return this.$store.state.global.supplierList
    }
  },
  methods: {
    ...mapActions(['loadSuppliers']),
    handleChange (value) {
      let arr = this.dictList.filter(item => item.supplierCode === value)
      this.$emit('change', value, arr.length > 0 ? arr[0] : {})
      // this.$emit('changeitem', arr.length > 0 ? arr[0] : {})
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>
