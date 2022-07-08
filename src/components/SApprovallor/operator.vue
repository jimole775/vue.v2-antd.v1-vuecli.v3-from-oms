<script>
import utils from '@/utils'
import { mapState } from 'vuex'
export default {
  title: '审批模块',
  name: 'Operator',
  props: {
    dataSource: {
      type: Object,
      default: () => ({})
    },
    option: {
      type: Object,
      default: () => ({})
    },
    bridge: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      scope: this,
      approvalResult: '1',
      liveInputs: [],
      liveRadios: [],
      form: this.$form.createForm(this)
    }
  },
  computed: {
    ...mapState({
      user: state => state.global.user,
      roleType: state => state.global.userRole.type
    }),
    isOutsideStuff () {
      return this.roleType === 'SUPPLIER' || this.roleType === 'OUT'
    },
    currentNode () {
      const listApiMap = this.bridge.apimap.list || {}
      const flowField = listApiMap.recordStatusField || 'flowNode'
      return this.dataSource[flowField]
    }
  },
  watch: {
    approvalResult: {
      handler (value) {
        this.$emit('updateRadio', value)
      },
      immediate: true
    },
    option: {
      handler (option) {
        this.clearForm()
        this.liveInputs = (option.inputs || []).filter(i => i.show)
        this.liveRadios = (option.radios || []).filter(i => i.show)
        this.bindFirstRadioValue()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    bindFirstRadioValue () {
      const liveRadios = this.liveRadios || []
      const values = liveRadios.map(i => i.value)
      // 如果当前的radios没有被选中的，那么就默认选中第一个
      if (!values.includes(this.approvalResult)) {
        const firstRadio = liveRadios[0] || {}
        this.approvalResult = firstRadio.value || '1'
      }
    },
    clearForm () {
      this.form.resetFields()
      this.form = this.$form.createForm(this)
    },
    isShowByEnv (item) {
      return !!(item.showOnEnv && item.showOnEnv.includes('handler'))
    },
    isShowByRoles (item) {
      const roleType = this.isOutsideStuff ? 1 : 0
      return !!(item.showOnRoles && item.showOnRoles.includes(roleType))
    },
    isInEditNode (item) {
      return !!(item.editOnNodes && item.editOnNodes.includes(this.currentNode))
    },
    isShowByRadio (item) {
      return !!(item.showOnRadios && item.showOnRadios.includes(this.approvalResult))
    },
    isShowByNode (item) {
      return !!(item.showOnNodes && item.showOnNodes.includes(this.currentNode))
    },
    changeEventForRadios ({ target: { value } }) {
      this.liveRadios && this.liveRadios.forEach((radioItem) => {
        if (Number.parseInt(value) === Number.parseInt(radioItem.value)) {
          if (utils.isFunction(radioItem.onChange)) {
            // 第二个参数主要是为了保持change类回调的参数统一
            radioItem.onChange(value, null, radioItem, this.scope)
          }
        }
      })
    },
    changeEventForInput (val, option, inputItem) {
      let pureval = ''
      if (val.target) {
        pureval = val.target.value
      } else {
        pureval = val
      }
      if (utils.isFunction(inputItem.onChange)) {
        inputItem.onChange(pureval, option, inputItem, this.scope)
      }
    },
    async emitSubmit () {
      const res = await this.getFieldsValue()
      if (res.type === 'failure') {
        this.$modal.warning({
          title: '提示',
          content: res.message
        })
      } else {
        this.$emit('submit', res.data)
      }
    },
    formatParams (values) {
      // 只处理 inputs 的参数，不处理 radios 的
      const inputs = this.liveInputs || []
      let params = utils.clone(values)
      inputs.forEach((item) => {
        if (item.paramTransfer && utils.isFunction(item.paramTransfer)) {
          params = item.paramTransfer(params, item, this.scope)
        }
      })
      return params
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
                approvalResult: this.approvalResult,
                ...this.formatParams(values)
              },
              message: ''
            })
          }
        })
      })
    }
  },
  render (h) {
    const radionodes = buildRadios.call(this, h)
    const inputnodes = buildInputs.call(this, h)
    const footernodes = buildFooter.call(this, h)
    return (
      <div>
        <a-form form={this.form}>
          <a-row>
            <a-col span={24}>
              {
                radionodes
              }
            </a-col>
            {
              inputnodes
            }
            <a-col span={24}>
              {
                footernodes
              }
            </a-col>
          </a-row>
        </a-form>
      </div>
    )
  }
}

function buildRadios (h) {
  if (this.liveRadios && this.liveRadios.length) {
    return (
      <a-form-item
        label={'审批'}
        label-col={{ span: 2 }}
        wrapper-col={{ span: 18 }}
      >
        <a-radio-group name="radioGroup" v-model={this.approvalResult} onChange={this.changeEventForRadios}>
          {
            this.liveRadios.map((radioItem) => {
              return (
                <a-radio value={radioItem.value}>
                  <span>{ radioItem.label }</span>
                  {
                    (radioItem.title || radioItem.tips) &&
                    <a-tooltip title={radioItem.title || radioItem.tips}>
                      <a-icon type="question-circle-o" />
                    </a-tooltip>
                  }
                </a-radio>
              )
            })
          }
        </a-radio-group>
      </a-form-item>
    )
  } else {
    return ''
  }
}

function buildInputs (h) {
  if (this.liveInputs && this.liveInputs.length) {
    return this.liveInputs.map((inputItem, index) => {
      return (
        <a-col span={inputItem.layout ? inputItem.layout.span : 8}>
          <a-form-item
            label-col={{ span: inputItem.layout ? inputItem.layout.label : 6 }}
            wrapper-col={{ span: inputItem.layout ? inputItem.layout.wrapper : 16 }}
          >
            {[
              labelRender.apply(this, [h, inputItem, index]),
              wrapperRender.apply(this, [h, inputItem, index])
            ]}
          </a-form-item>
        </a-col>
      )
    })
  } else {
    return ''
  }
}

function labelRender (h, inputItem, index) {
  let labelC = null
  if (inputItem.label) {
    labelC = h('span', { slot: 'label' }, inputItem.label)
  }
  if (inputItem.labelCustomRender) {
    labelC = inputItem.labelCustomRender(h, inputItem, this.scope)
  }
  return labelC
}

function wrapperRender (h, inputItem, index) {
  if (inputItem.wrapperCustomRender) {
    return inputItem.wrapperCustomRender(this.$createElement, inputItem, this.scope)
  } else {
    const defaultVal = utils.isFunction(inputItem.default) ? inputItem.default(inputItem, this.scope) : inputItem.default
    const decoratorInfo = { initialValue: defaultVal, rules: [{ required: inputItem.required, message: `请确认${inputItem.label}` }] }
    return (
      <inputItem.component
        key={`${inputItem.key}_${index}`}
        ref={`${inputItem.key}_${index}`}
        props={inputItem.props}
        attrs={inputItem.attrs}
        domProps={inputItem.domProps}
        vDecorator={[inputItem.key, decoratorInfo]}
        onChange={(val, option) => this.changeEventForInput(val, option, inputItem)}
      />
    )
  }
}

function buildFooter (h) {
  if (this.option.submitCustomRender) {
    return this.option.submitCustomRender(h, this.option, this.scope)
  } else {
    return (
      <a-form-item
        label={' '}
        label-col={{ span: 2 }}
        wrapper-col={{ span: 18 }}
      >
        <a-button type="primary" onClick={this.emitSubmit}>提交</a-button>
      </a-form-item>
    )
  }
}

</script>
<style lang="less" scoped>
.footer {
  text-align: center;
  margin: 2rem 0;
  button {
    width: 16rem;height:2.6rem;
  }
}
/deep/.ant-row {
  line-height: 2.5;
}
</style>
