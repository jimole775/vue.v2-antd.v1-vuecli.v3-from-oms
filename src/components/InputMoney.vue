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
    },
    restrict: {
      type: String/** negative | positive */,
      default: null
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
        // 根据value的值，刷新默认视图
        if (utils.isValuable(val)) {
          const purval = isOnlySign(val) ? 0 : utils.parseMoney(val)
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
      let result = utils.isNone(e.target.value) ? '' : e.target.value
      result = this.querySpecialValue(result) // 过滤 '0-' 这个特殊字符
      result = this.computeInputValue(result) // 获取自然数
      result = this.restrictInPositiveOrNegative(result) // 限定正负结果
      result = this.adjustLimit(result) // 修正预期阈值
      this.updateView(result)
      this.updateValue(result)
    },
    // 限定“正”或“负”结果
    restrictInPositiveOrNegative (val) {
      if (/^[ |0]$/.test(val)) return val // 防止出现 -1 * 0 = -0
      let result = val
      // 只返回正数
      if (this.restrict === 'positive') {
        if (isOnlySign(val)) {
          result = ''
        } else {
          result = Math.abs(val)
        }
      }
      // 只返回负数
      if (this.restrict === 'negative') {
        if (isOnlySign(val)) {
          result = '-'
        } else {
          result = -1 * Math.abs(val)
        }
      }
      return result // 返回字符串
    },
    computeInputValue (val) {
      if (isOnlySign(val)) return val
      let purval = utils.parseMoney(val)
      let result = ''
      // 处理数型数据
      if (isNum(purval)) {
        result = Number.parseFloat(purval)
      }
      return result
    },
    updateView (val) {
      if (this.$refs.moneyinput) {
        this.$refs.moneyinput.value = this.queryMoneyView(val)
      }
    },
    updateValue (val) {
      let result = null
      if (isNum(val)) {
        result = Number.parseFloat(val)
      }
      this.$emit('change', result) // 更新v-model
    },
    queryMoneyView (val) {
      if (isOnlySign(val)) return val
      if (isNum(val)) {
        return utils.formatMoney(val)
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
    },
    // 如果在前面有数字，并且这个数字是0的情况下，需要清除前面的0
    querySpecialValue (val) {
      if (/0-/.test(val)) {
        return '-'
      } else {
        return val
      }
    }
  }
}

function isNum (val) {
  return /^([\+\-]?(\d*\.?\d+|\d+\.?\d*))$/.test(val)
}

function isOnlySign (val) {
  return /^([\+\-])$/.test(val)
}

</script>
