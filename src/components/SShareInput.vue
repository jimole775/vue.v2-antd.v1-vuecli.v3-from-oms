<script>
export default {
  name: 'SShareInput',
  enumerated: true,
  props: {
    value: {
      type: String,
      default: '' // 50:50
    },
    max: {
      type: Number,
      default: 100
    },
    min: {
      type: Number,
      default: 0
    },
    precision: {
      type: Number
    },
    amount: { // 总数
      type: Number,
      default: 100
    },
    copies: {
      type: Number,
      default: 1
    },
    limitCopies: {
      type: Number,
      default: 50
    },
    splitSign: {
      type: String,
      default: ':'
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      optionList: [],
      fetching: false
    }
  },
  watch: {
    value: {
      handler (value) {
        if (value) {
          this.wrappers = Array(this.evalCopies()).fill('')
          const alreadies = value.split(this.splitSign)
          alreadies.forEach((i, ii) => (this.wrappers[ii] = i))
        }
      },
      immediate: true
    },
    copies: {
      handler (copies) {
        this.wrappers = Array(this.evalCopies()).fill('')
        const defaultValue = this.value || ''
        const alreadies = defaultValue.split(this.splitSign)
        if (alreadies.length > this.wrappers.length) {
          this.wrappers.forEach((i, ii) => (this.wrappers[ii] = alreadies[i]))
          this.$emit('change', this.wrappers.join(this.splitSign))
        } else {
          alreadies.forEach((i, ii) => (this.wrappers[ii] = i))
        }
      },
      immediate: true
    }
  },
  methods: {
    perChanged (val, i) {
      this.wrappers[i] = val
      this.$emit('change', this.wrappers.join(this.splitSign))
    },
    evalCopies () {
      return this.copies > this.limitCopies ? this.limitCopies : this.copies
    }
  },
  render (h) {
    const style = {
      maxWidth: (100 / (this.wrappers.length || 1)) + '%'
    }
    return <div class="s-share-input">
      {
        this.wrappers.map((p, i) => {
          return <a-input-number
            style={style}
            value={p}
            key={i}
            onChange={(val) => this.perChanged(val, i)}
            min={this.min}
            max={this.max}
            precision={this.precision}
          />
        })
      }
    </div>
  }
}
</script>
<style lang="less" scoped>
.s-share-input {
    .ant-input-number {
        border-right: 0;
        border-radius: 0;
        &:first-child {
            border-radius: 3px 0 0 3px;
        }
        &:last-child {
            border-right: 1px solid #d9d9d9;
            border-radius: 0 3px 3px 0;
        }
    }
}
</style>
