<template>
  <a-date-picker
    v-model="year"
    mode="year"
    format="YYYY"
    :allow-clear="allowClear"
    :open="yearPickShow"
    @panelChange="panelChange"
    @openChange="openChange"
  />
</template>
<script>
export default {
  title: '年选择',
  name: 'YearPicker',
  enumerated: true,
  props: {
    value: {
      type: String,
      default: null
    },
    allowClear: {
      type: Boolean,
      default: true
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      year: null,
      yearPickShow: false
    }
  },
  watch: {
    value: {
      handler (val) {
        const date = new Date()
        let year = val || date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        if (val && /-/.test(val)) {
          year = val.split('-')[0]
        }
        if (val && /\//.test(val)) {
          year = val.split('/')[0]
        }
        this.year = this.$utils.moment(`${year}-${month}-${day}`)
      },
      immediate: true
    }
  },
  methods: {
    panelChange (val) {
      this.year = this.$utils.moment(val)
      this.yearPickShow = false
      this.$emit('input', val ? val.format('YYYY') : '') // 输出结果给this.value
      this.$emit('change', val ? val.format('YYYY') : '') // 输出结果给this.value
    },
    openChange (val) {
      this.yearPickShow = val
    }
  }
}
</script>
