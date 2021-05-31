<script>
import utils from '@/utils'
export default {
  name: 'FormItemRender',
  props: {
    dataSource: {
      type: Object,
      default: () => ({})
    },
    activeFormItems: {
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
      form: this.$form.createForm(this)
    }
  },
  watch: {
    activeFormItems: {
      handler (items) {
        if (items) {
          const dataSource = this.dataSource || {}
          // 全局统一的默认值
          this.bindDefaultValue(dataSource, items)
          // 为特殊组件赋值
          utils.bindDefaultValueForComponent(dataSource, items)

          this.$nextTick(() => {
            this.$props.beforeRender(dataSource, items, utils.bindVMScopeParent(this))
          })

          // this.triggeringChangeCallback(dataSource, items)
        }
      },
      immediate: true
    }
  },
  computed: {
    user () {
      return this.$store.state.global.user
    },
    edit () {
      return this.mode === 'edit'
    },
    readonly () {
      return this.mode === 'readonly'
    }
  },
  methods: {
    labelRender (h, formItem) {
      let labelC = null
      if (formItem.label) {
        labelC = h('span', { slot: 'label' }, formItem.label)
      }
      if (formItem.labelCustomRender) {
        labelC = formItem.labelCustomRender(h, formItem, utils.bindVMScopeParent(this))
      }
      return labelC
    },
    wrapperRender (h, formItem) {
      if (formItem.wrapperCustomRender) {
        return formItem.wrapperCustomRender(this.$createElement, formItem, utils.bindVMScopeParent(this))
      } else {
        return (<formItem.component
          props={formItem.props}
          attrs={formItem.attrs}
          domProps={formItem.domProps}
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
      }
    },
    bindDefaultValue (dataSource, items) {
      items.forEach((item) => {
        item.value = utils.isValuable(dataSource[item.key]) ? dataSource[item.key] : item.value
      })
    },
    componentChangeEvent (val, item) {
      item.change && item.change(val, item, utils.bindVMScopeParent(this))
      this.$emit('change', val, item, utils.bindVMScopeParent(this))
    },
    triggeringChangeCallback (dataSource, items) {
      items.forEach((item) => {
        item.change && item.change(item.value, item, utils.bindVMScopeParent(this))
      })
    },
    getFieldsValue () {
      return new Promise((resolve) => {
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
                ...utils.formatFormValues(values, this.activeFormItems)
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
            this.activeFormItems && this.activeFormItems.map((formItem) => {
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
            })
          }
        </a-row>
      </a-form>
    )
  }
}
</script>
