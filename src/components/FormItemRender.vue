<script>
import utils from '@/utils'
import { mapState } from 'vuex'
export default {
  title: '栅格表单',
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
    afterRender: {
      type: Function,
      default: p => p
    },
    bridge: {
      type: Object,
      default: () => ({})
    },
    onlyAvailFields: { // 只显示有效字段
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scope: this,
      scopeFormItems: [],
      form: this.$form.createForm(this)
    }
  },
  watch: {
    formItems: {
      handler (formItems) {
        if (formItems && formItems.length) {
          this.initialize()
        }
      },
      immediate: true
    },
    dataSource: {
      handler (data) {
        if (data && Object.keys(data).length) {
          this.initialize()
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      user: state => state.global.user,
      roleType: state => state.global.userRole.type
    }),
    isOutsideStuff () {
      return this.roleType === 'SUPPLIER' || this.roleType === 'OUT'
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    clearForm () {
      this.form.resetFields()
      this.form = this.$form.createForm(this)
    },
    initialize () {
      const formItems = this.$props.formItems || []
      const dataSource = utils.clone(this.$props.dataSource || {})

      this.clearForm()
      this.formatFormItems(formItems)

      // 全局统一的默认值
      utils.bindDefaultValueForComponent(dataSource, formItems)

      // 获取自定义的默认值 item.default
      this.bindDefaultValue(dataSource, formItems)

      this.$props.beforeRender(dataSource, formItems, this.scope)

      this.scopeFormItems = this.tryCutFields(dataSource, formItems)
      // this.triggeringChangeCallback(dataSource, formItems)
    },
    tryCutFields (dataSource, formItems) {
      // 判断是否只显示有效字段
      if (this.onlyAvailFields) {
        return formItems.filter((item) => {
          const key = item.key || item.dataIndex
          return utils.isValuable(dataSource[key])
        })
      } else {
        return formItems
      }
    },
    labelRender (h, formItem) {
      let labelC = null
      if (formItem.label) {
        labelC = h('span', { slot: 'label' }, formItem.label)
      }
      if (formItem.labelCustomRender) {
        labelC = formItem.labelCustomRender(h, formItem, this.scope)
      }
      return labelC
    },
    wrapperRender (h, formItem) {
      if (formItem.wrapperCustomRender) {
        if (utils.isFunction(formItem.wrapperCustomRender)) {
          return formItem.wrapperCustomRender(this.$createElement, formItem, this.scope)
        } else if (utils.isObject(formItem.wrapperCustomRender)) {
          const { handler, viewer } = formItem.wrapperCustomRender
          if (viewer && formItem.mode === 'readonly') {
            return viewer(this.$createElement, formItem, this.scope)
          }
          if (handler && formItem.mode === 'edit') {
            return handler(this.$createElement, formItem, this.scope)
          }
        } else {
          return new Error('不支持的 wrapperCustomRender 类型！')
        }
      } else if (formItem.component) {
        return (<formItem.component
          props={formItem.props}
          attrs={formItem.attrs}
          domProps={formItem.domProps}
          initialValue={formItem.default}
          defaultValue={formItem.default/** Uploader的属性 */}
          defaultFiles={formItem.default/** UploaderMultiple的属性 */}
          vDecorator={[formItem.key, { initialValue: formItem.default, rules: [{ required: formItem.required, message: `请确认必填项` }] }]}
          onChange={(val, option) => this.componentChangeEvent(val, option, formItem)}
        >
          {
            // formItem.customRender && formItem.customRender(this.$createElement)
          }
        </formItem.component>)
      } else {
        const data = this.$props.dataSource || {}
        const dv = data[formItem.vkey || formItem.key]
        return (<span
          props={formItem.props}
          attrs={formItem.attrs}
          domProps={formItem.domProps}
        > { dv || formItem.value } </span>)
      }
    },
    bindDefaultValue (dataSource, items) {
      items.forEach((item) => {
        if (utils.isValuable(item.default)) {
          if (utils.isFunction(item.default)) {
            item.default = item.default(item, this.scope)
          }
        }
        if (utils.isValuable(dataSource[item.key]) && utils.isNone(item.default)) {
          item.default = dataSource[item.key]
        }
      })
    },
    componentChangeEvent (val, option, item) {
      item.value = val // 保持 this.formItems 的 value 们的更新
      item.change && item.change(val, option, item, this.scope)
      item.onChange && item.onChange(val, option, item, this.scope)
      // 触发 FormItemRender 的更新事件
      // 并且保持 this.form 的 字段值 的更新
      this.$emit('change', val, option, item, this.scope)
    },
    validateRequiredField () {
      const tips = []
      // 操作模块的必填字段验证
      const fieldsValue = this.form.getFieldsValue()
      for (let i = 0; i < this.scopeFormItems.length; i++) {
        const formItem = this.scopeFormItems[i]
        // 只有在 required 和 show 同时为 true 时，才进行必填校验
        if (formItem.required && formItem.show) {
          if (formItem.keys) {
            if (
              isNoneFromKeys(formItem.keys) &&
              isNoneFromValue(formItem.value) &&
              isNoneFromParams(formItem.params)
            ) {
              tips.push(`请确认"${formItem.label}"！`)
              break
            }
          } else {
            if (
              isNoneForKey(formItem.key) &&
              isNoneFromValue(formItem.value) &&
              isNoneFromParams(formItem.params)
            ) {
              tips.push(`请确认"${formItem.label}"！`)
              break
            }
          }
        }
      }

      return tips

      function isNoneFromValue (value) {
        return utils.isNone(value)
      }

      function isNoneForKey (key) {
        return utils.isNone(fieldsValue[key])
      }

      function isNoneFromKeys (keys) {
        let res = false
        keys.forEach((key) => {
          if (utils.isNone(fieldsValue[key])) {
            res = true
          }
        })
        return res
      }

      function isNoneFromParams (params) {
        return utils.isEmpty(params)
      }
    },
    // 填充每个formItem的默认字段
    formatFormItems (formItems) {
      const layout8 = {
        span: 8,
        label: 9,
        wrapper: 12
      }
      formItems.forEach((item) => {
        if (item.show === undefined) this.$set(item, 'show', true)
        if (item.required === undefined) this.$set(item, 'required', false)
        if (item.layout === undefined) this.$set(item, 'layout', layout8)
        if (item.mode === undefined) this.$set(item, 'mode', 'edit')
        if (item.value === undefined) this.$set(item, 'value', null)
        if (item.params === undefined) this.$set(item, 'params', {})
        if (item.userPermissions === undefined) this.$set(item, 'userPermissions', [1, 2]) // 1是内部员工，2是外部员工
        if (item.radioPermissions === undefined) this.$set(item, 'radioPermissions', [1]) // 1通过
        if (item.$decorator === undefined) {
          // 提供一个默认的 form 绑定规则
          // 不能使用 $set 进行响应式改造
          item['$decorator'] = function (otherRules = {}) {
            return [
              item.key,
              {
                ...otherRules,
                rules: [{
                  required: item.required,
                  message: `请确认${item.label}`
                }]
              }
            ]
          }
        }
      })
    },
    isCanShow (formItem) {
      let res = true
      if (formItem.show === false) {
        res = false
      }
      if (this.isOutsideStuff && !(formItem.userPermissions.includes(2))) {
        res = false
      }
      return res
    },
    getFormItemsValue (values, formItems) {
      let res = { ...values }
      formItems.forEach((item) => {
        if (item.keys) {
          item.keys.forEach((key) => {
            (utils.isValuable(item.value) && utils.isNone(res[key])) && (res[key] = item.value)
          })
        } else {
          (utils.isValuable(item.value) && utils.isNone(res[item.key])) && (res[item.key] = item.value)
        }
        if (item.params) {
          res = utils.merge(res, item.params)
        }
        if (item.paramTransfer) {
          item.paramTransfer(res, item, this.scope)
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
            const params = {
              ...values,
              // ...utils.formatFormValues(values, this.formItems),
              ...this.getFormItemsValue(values, this.scopeFormItems)
            }
            resolve({
              type: 'success',
              data: params,
              message: ''
            })
          }
        })
      })
    }
  },
  beforeDestroy () {
    this.clearForm()
  },
  render (h) {
    return (
      <a-form form={this.form}>
        <a-row>
          {
            this.scopeFormItems && this.scopeFormItems.map((formItem) => {
              if (this.isCanShow(formItem)) {
                return (
                  <a-col span={formItem.layout ? formItem.layout.span : 8}>
                    <a-form-item
                      label-col={{ span: formItem.layout ? formItem.layout.label : 6 }}
                      wrapper-col={{ span: formItem.layout ? formItem.layout.wrapper : 16 }}
                    >
                      {[
                        this.labelRender(h, utils.clone(formItem)),
                        this.wrapperRender(h, utils.clone(formItem))
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
