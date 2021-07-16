<script>
import utils from '@/utils'
import { mapState } from 'vuex'
export default {
  name: 'FormItemRender',
  props: {
    dataSource: {
      type: Object,
      default: () => ({})
    },
    formItems: {
      type: Array,
      default: () => ([])
    },
    beforeRender: {
      type: Function,
      default: p => p
    },
    vmprops: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      vmcope: {
        $$target: {}
      },
      form: this.$form.createForm(this)
    }
  },
  watch: {
    formItems: {
      handler (formItems) {
        if (formItems && formItems.length) {
          this.initialize(this.dataSource, formItems)
        }
      },
      immediate: true
    },
    dataSource: {
      handler (data) {
        if (data && Object.keys(data).length) {
          this.initialize(data, this.formItems)
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      user: state => state.global.user
    }),
    edit () {
      return this.mode === 'edit'
    },
    readonly () {
      return this.mode === 'readonly'
    }
  },
  methods: {
    initialize (dataSource, formItems) {
      this.formatFormItems(formItems)

      // 全局统一的默认值
      this.bindDefaultValue(dataSource, formItems)

      // 为特殊组件赋值
      utils.bindDefaultValueForComponent(dataSource, formItems)

      this.vmcope = utils.bindVMScopeParent(this)

      this.$nextTick(() => {
        this.$props.beforeRender(dataSource, formItems, this.vmcope)
      })

      // this.triggeringChangeCallback(dataSource, formItems)
    },
    labelRender (h, formItem) {
      let labelC = null
      if (formItem.label) {
        labelC = h('span', { slot: 'label' }, formItem.label)
      }
      if (formItem.labelCustomRender) {
        labelC = formItem.labelCustomRender(h, formItem, this.vmcope)
      }
      return labelC
    },
    wrapperRender (h, formItem) {
      if (formItem.wrapperCustomRender) {
        return formItem.wrapperCustomRender(this.$createElement, formItem, this.vmcope)
      } else if (formItem.component) {
        return (<formItem.component
          props={formItem.props}
          attrs={formItem.attrs}
          domProps={formItem.domProps}
          disabled={formItem.mode === 'readonly'}
          initialValue={formItem.value}
          defaultValue={formItem.value/** Uploader的属性 */}
          defaultFiles={formItem.value/** UploaderMultiple的属性 */}
          vDecorator={[formItem.key, { initialValue: formItem.value, rules: [{ required: formItem.required, message: `请确认必填项` }] }]}
          onChange={(val) => this.componentChangeEvent(val, formItem)}
        >
          {
            // formItem.customRender && formItem.customRender(this.$createElement)
          }
        </formItem.component>)
      } else {
        return (<span
          props={formItem.props}
          attrs={formItem.attrs}
          domProps={formItem.domProps}
        > { formItem.value } </span>)
      }
    },
    bindDefaultValue (dataSource, items) {
      items.forEach((item) => {
        item.value = utils.isValuable(dataSource[item.key]) ? dataSource[item.key] : item.value
      })
    },
    componentChangeEvent (val, item) {
      item.change && item.change(val, item, this.vmcope)
      this.$emit('change', val, item, this.vmcope)
    },
    triggeringChangeCallback (dataSource, items) {
      items.forEach((item) => {
        item.change && item.change(item.value, item, this.vmcope)
      })
    },
    validateRequiredField () {
      const tips = []
      // 操作模块的必填字段验证
      const params = this.form.getFieldsValue() || {}
      for (let i = 0; i < this.formItems.length; i++) {
        const formItem = this.formItems[i]
        if (formItem.keys) {
          if (isNoneForKeys(formItem.keys) && utils.isNone(formItem.value) && formItem.required) {
            tips.push(`请确认"${formItem.label}"！`)
            break
          }
        } else {
          if (utils.isNone(params[formItem.key]) && utils.isNone(formItem.value) && formItem.required) {
            tips.push(`请确认"${formItem.label}"！`)
            break
          }
        }
      }
      function isNoneForKeys (keys) {
        let res = false
        keys.forEach((key) => {
          if (utils.isNone(params[key])) {
            res = true
          }
        })
        return res
      }
      return tips
    },
    // 填充每个formItem的默认字段
    formatFormItems (formItems) {
      const layout8 = {
        span: 8,
        label: 9,
        wrapper: 12
      }
      return formItems.map((item) => {
        if (item.show === undefined) item.show = true
        if (item.required === undefined) item.required = false
        if (item.layout === undefined) item.layout = layout8
        if (item.mode === undefined) item.mode = 'edit'
        if (item.value === undefined) item.value = null
        if (item.userPermissions === undefined) item.userPermissions = [1, 2] // 1是内，2是外
        if (item.radioPermissions === undefined) item.radioPermissions = [1] // 1通过
        return item
      })
    },
    isCanShow (formItem) {
      let res = true
      if (formItem.show === false) {
        res = false
      }
      if (!(formItem.userPermissions.includes(2))) {
        res = false
      }
      return res
    },
    getFormItemsValue (formItems) {
      const res = {}
      formItems.forEach((item) => {
        if (item.keys) {
          item.keys.forEach((key) => {
            res[key] = item.value
          })
        } else {
          res[item.key] = item.value
        }
      })
      return res
    },
    getFieldsValue () {
      return new Promise((resolve) => {
        const tips = this.validateRequiredField()
        if (tips && tips.length) {
          return resolve({
            type: 'failure',
            data: null,
            message: tips[0]
          })
        }
        this.form.validateFields((err, values) => {
          if (err) {
            resolve({
              type: 'failure',
              data: null,
              message: utils.getFormErrorMessage(err)
            })
          } else {
            resolve({
              type: 'success',
              data: {
                ...this.getFormItemsValue(this.formItems),
                ...utils.formatFormValues(values, this.formItems)
              },
              message: ''
            })
          }
        })
      })
    }
  },
  render (h) {
    return (
      <a-form form={this.form}>
        <a-row>
          {
            this.formItems && this.formItems.map((formItem) => {
              if (this.isCanShow(formItem)) {
                return (
                  <a-col span={formItem.layout ? formItem.layout.span : 8}>
                    <a-form-item
                      label-col={{ span: formItem.layout ? formItem.layout.label : 6 }}
                      wrapper-col={{ span: formItem.layout ? formItem.layout.wrapper : 16 }}
                    >
                      {[
                        this.labelRender(h, formItem),
                        this.wrapperRender(h, formItem)
                      ]}
                    </a-form-item>
                  </a-col>
                )
              } else {
                return ''
              }
            })
          }
        </a-row>
      </a-form>
    )
  }
}
</script>
