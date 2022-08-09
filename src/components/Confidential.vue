<script>
import api from '@/api'
import utils from '@/utils'
import eyeOpenIcon from '@/assets/eye-open.svg'
import eyeCloseIcon from '@/assets/eye-close.svg'
export default {
  name: 'Confidential',
  props: {
    params: {
      type: Object,
      default: () => ({})
    },
    dataDir: {
      type: String,
      default: 'data'
    },
    value: {
      type: String,
      default: ''
    },
    editable: { // 是否可编辑
      type: Boolean,
      default: false
    },
    state: {
      type: Object,
      default: () => ({
        isEditing: false, // 是否在编辑状态
        isViewing: false // 是否在查看状态
      })
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      trulyValue: '', // 真实数据
      coverValue: '', // 带星号的数据
      viewValue: '', // 视图
      isViewing: false,
      isEditing: false,
      dataCache: null
    }
  },
  watch: {
    isViewing: {
      async handler (isViewing) {
        if (isViewing && !this.trulyValue) {
          const res = await api.getsensitivitydatalogget(this.params)
          if (res.code === 200) {
            this.dataCache = res.data
            const value = eval(`res.${this.dataDir}`)
            if (utils.isString(value) || utils.isNumber(value)) {
              this.trulyValue = value
            } else {
              this.trulyValue = ''
            }
          }
        }
        this.$emit('change', this.trulyValue, this.dataCache, this)
        this.viewValue = (isViewing ? this.trulyValue : this.coverValue) || this.value
      },
      immediate: true
    },
    state: {
      handler (state) {
        if (state.isViewing) {
          this.trulyValue = this.value
        } else {
          this.coverValue = this.value
        }
        this.isEditing = state.isEditing
        this.isViewing = state.isViewing
        this.viewValue = this.value
      },
      immediate: true
    },
    trulyValue: {
      handler (val) {
        if (val) {
          this.$emit('change', val, this.dataCache, this)
        }
      },
      immediate: true
    }
  },
  methods: {
    exchengeViewState () {
      this.isViewing = !this.isViewing
    },
    exchengeEditState () {
      this.isEditing = !this.isEditing
      this.isViewing = true
    }
  },
  render (h) {
    return <span>
      {
        this.isEditing && buildEditNode.call(this, h)
      }
      {
        !this.isEditing && buildViewNode.call(this, h)
      }
    </span>
  }
}

function buildEditNode (h) {
  return <a-input v-model={this.trulyValue} />
}

function buildViewNode (h) {
  return <span>
    { this.viewValue }
    &nbsp;
    {
      this.editable &&
      <a onClick={this.exchengeEditState}>
        <a-icon type="form" />
      </a>
    }
    &nbsp;
    {
      <a onClick={this.exchengeViewState}>
        <img width="20px" src={this.isViewing ? eyeOpenIcon : eyeCloseIcon } />
      </a>
    }
  </span>
}
</script>
