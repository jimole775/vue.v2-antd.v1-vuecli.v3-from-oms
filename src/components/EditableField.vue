<script>
import api from '@/api'
import utils from '@/utils'
import baseMixins from '@/mixins/baseMixins.js'
import ModificationLog from '@/components/ModificationLog.vue'
let cache = ''
export default {
  mixins: [baseMixins],
  props: {
    // 编辑字段
    editField: {
      type: String | Object,
      required: true
    },
    // 编辑组件
    editComponent: {
      type: String | Object,
      required: true
    },
    // 提交接口
    handupApi: {
      type: String | Function,
      required: true
    },
    // 接口提交时的额外字段
    handupFields: {
      type: Array
    },
    // 如果是 复合类型的数据，只支持 { key: '', label: '' } 这种数据结构
    value: {
      type: Array | Object | String | Number
    },
    // 是否有编辑权限
    editable: {
      type: Boolean | Function | String
    },
    // 编辑组件的参数
    editComponentExtendProps: {
      type: Object
    },
    mode: {
      type: String,
      default: 'default'
    },
    dataSource: {
      type: Object,
      default: () => ({})
    },
    // 是否展示 变更记录
    // 参数可查看公共组件：ModificationLog
    modifyLog: {
      type: Object
    }
  },
  data () {
    return {
      text: '',
      scope: this,
      vmData: null,
      editState: false
    }
  },
  computed: {
    isCanEdit () {
      if (utils.isBoolean(this.editable)) {
        return this.editable
      } else if (utils.isString(this.editable)) {
        return this.hasCatalogButton(this.editable)
      } else if (utils.isFunction(this.editable)) {
        return this.editable(this.scope)
      } else {
        return true
      }
    }
  },
  watch: {
    value: {
      handler (val) {
        if (utils.isNone(val)) return false
        if (utils.isObject(val) && !val.key) return false
        if (utils.isArray(val) && !val.length) return false
        this.vmData = val
        if (utils.isArray(val)) {
          this.text = val.map(i => utils.trim(i.label || i.title).join(','))
        } else if (utils.isObject(val)) {
          this.text = utils.trim(val.label || val.title)
        } else {
          this.text = utils.trim(val)
        }
      },
      immediate: true
    },
    editState: {
      handler () {
        // 切换编辑状态时，缓存当前的数据
        // 用于判断数据是否变更
        cache = this.text
      },
      immediate: true
    }
  },
  methods: {
    change (e) {
      this.vmData = e && e.currentTarget ? e.currentTarget.value : e
      this.$emit('change', this.vmData)
    },
    diggerPureData (data = '') {
      if (!data) return ''
      if (utils.isString(data) || utils.isNumber(data)) return data
      if (utils.isObject(data)) {
        data = [data]
      }
      // 一般的数据类型： {key: '', label: ''}
      // 这里需要对数据进行清晰
      const keys = []
      const labels = []
      data.forEach(item => {
        const key = utils.trim(item.key)
        const label = utils.trim(item.label)
        if (utils.isJSONString(key)) {
          const obj = JSON.parse(key)
          keys.push(utils.trim(obj.key))
          labels.push(utils.trim(obj.label))
        } else {
          keys.push(key)
          labels.push(label)
        }
      })
      return {
        key: keys.join(','),
        label: labels.join(',')
      }
    },
    bindDefaultParams (params) {
      if (this.handupFields && this.handupFields.length) {
        this.handupFields.forEach(field => {
          params[field] = this.dataSource[field]
        })
      } else {
        params = { ...this.dataSource }
      }
      return params
    },
    confirm () {
      const params = this.bindDefaultParams({})
      if (utils.isNone(this.vmData) || utils.isEmpty(this.vmData)) {
        return this.$message.warning('请提交有效数据！')
      }
      const pureData = this.diggerPureData(this.vmData)
      if (utils.isString(pureData) || utils.isNumber(pureData)) {
        params[this.editField] = this.text = pureData
      } else {
        if (utils.isString(this.editField)) {
          params[this.editField] = pureData.key
          params[this.editField + 'Name'] = this.text = pureData.label
        } else {
          params[this.editField.key] = pureData.key
          params[this.editField.label] = this.text = pureData.label
        }
      }
      if (cache === this.text) {
        this.editState = false
      } else {
        const vapi = this.handupApi || function () {}
        const fn = utils.isFunction(vapi) ? vapi : api[vapi]
        fn({ ...params }).then(res => {
          if (res.code === 200) {
            this.editState = false
            this.$message.success('操作成功')
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    }
  },
  render (h) {
    const icon = () => {
      if (this.isCanEdit) {
        return <span class="edit-icon">
          <a-icon type="edit" onClick={()=> (this.editState = !this.editState)} />
        </span>
      }
    }

    const editBar = () => {
      const editComponent = this.editComponent
      const extendProps = this.editComponentExtendProps || {}
      const editProps = {
        props: {
          mode: this.mode,
          multiple: this.mode === 'multiple',
          'simple-select': this.mode !== 'multiple',
          value: this.vmData,
          ...extendProps
        },
        on: {
          change: this.change
        }
      }
      if (this.editState) {
        return <div class="edit-bar">
          {
            typeof editComponent === 'string'
              ? h(editComponent, { ...editProps })
              : <editComponent {...editProps} />
          }
          <a-button class="confirm-button" onClick={this.confirm}>确定</a-button>
        </div>
      } else {
        return <span key={this.text}>{this.text}</span>
      }
    }

    const modify = () => {
      const modifyProps = {
        props: this.modifyLog
      }
      if (this.modifyLog && !this.editState) {
        return <div class="edit-modify"><ModificationLog { ...modifyProps } /></div>
      }
    }

    return <div class="edit-wrapper">
      { icon() }
      { editBar() }
      { modify() }
    </div>
  }
}

</script>
<style lang="less" scoped>
.edit-wrapper {
  display: flex;
  width: 100%;
  align-items: center;
  .edit-icon {
    color: #2DC84D;
    width: 22px;
  }
  .edit-bar {
    display: flex;
    width: calc(100% - 22px);
    align-items: center;
    > * {
      min-width: 8rem;
    }
    .confirm-button {
      margin-left: 4px;
      min-width: 4rem;
    }
  }
  .edit-modify {
    margin-left: 0.5rem;
  }
}
</style>