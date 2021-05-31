<template>
  <a-input
    ref="moneyinput"
    v-model="view"
    :disabled="disabled"
    :suffix="suffix"
    @input="(e) => inputting(e)"
  />
</template>

<script>
import utils from '@/utils'
export default {
  name: 'InputMoney',
  props: {
    value: {
      type: Number
    },
    min: {
      type: Number,
      default: -Infinity
    },
    max: {
      type: Number,
      default: Infinity
    },
    suffix: {
      type: String,
      default: '元'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入金额'
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
    }
  },
  watch: {
    value: {
      handler (val) {
        if (utils.isValuable(val)) {
          const purval = /^([\+\-])$/.test(val) ? 0 : utils.parseMoney(val)
          this.updateView(purval)
        }
      },
      immediate: true
    }
  },
  computed: {
    view: {
      set (val) {
        this.updateValue(val)
      },
      get () {
        return this.queryMoneyView(this.value)
      }
    }
  },
  methods: {
    inputting (e) {
      let val = utils.isNone(e.target.value) ? '' : e.target.value
      let purval = /^([\+\-])$/.test(val) ? val : utils.parseMoney(val)
      let result = ''
      if (/^([\+\-]?(\d*\.?\d+|\d+\.?\d*))$/.test(purval)) {
        // 处理数型数据
        result = this.adjustLimit(Number.parseFloat(purval))
      } else {
        // 支持正负号
        if (/^([\+\-])$/.test(purval)) {
          result = purval
        } else {
          result = ''
        }
      }
      this.updateView(result)
      this.updateValue(result)
    },
    updateView (val) {
      if (this.$refs.moneyinput) {
        this.$refs.moneyinput.value = this.queryMoneyView(val)
      }
    },
    updateValue (val) {
      this.$emit('change', val) // 更新v-model
    },
    queryMoneyView (val) {
      if (utils.isValuable(val)) {
        return /^([\+\-])$/.test(val) ? val : utils.formatMoney(val)
      } else {
        return ''
      }
    },
    adjustLimit (val) {
      if (val < this.min) {
        return this.min
      }
      if (val > this.max) {
        return this.max
      }
      return val
    }
  }
}
</script>
