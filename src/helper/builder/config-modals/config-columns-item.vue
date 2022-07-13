<template>
  <a-modal
    title="字段配置"
    v-model="modal.show"
    width="60%"
    @ok="confirm"
  >
    <a-form :form="form">
      <a-row>
        <a-col v-show="!getFunctionExpression('slotsFunction')" :span="24">
          <a-form-item label="表头" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input
              v-decorator="['title', {
                initialValue: defaultProps.title,
                rules: [{ required: !getFunctionExpression('slotsFunction'), message: '请确认title' }]
              }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="关键字" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input
              v-decorator="['dataIndex', {
                initialValue: defaultProps.dataIndex,
                rules: [
                  { required: true, message: '请确认dataIndex' },
                  { pattern: /^[a-zA-Z]([a-zA-Z0-9]*)$/g, message: '只支持大小写英文字母、数字'}
                ]
              }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="宽度" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input-number
              v-decorator="['width', {
                initialValue: defaultProps.width,
                rules: [{ required: false }]
              }]"
            />
          </a-form-item>
        </a-col>
        <a-col v-show="!getFunctionExpression('slotsFunction')" :span="24">
          <a-form-item label="表头提示文本" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input
              v-decorator="['titleTips', {
                initialValue: defaultProps.titleTips,
                rules: [{ required: false }]
              }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <span slot="label">
              可显示用户
              <a-tooltip title="当前用户可分为“内部”和“外部”两种用户类型">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-checkbox-group
              v-decorator="['permission', {
                initialValue: defaultProps.permission,
                rules: [{ required: false }]
              }]"
            >
              <a-checkbox :value="0">内部</a-checkbox>
              <a-checkbox :value="1">外部</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="数据类型" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-radio-group
              v-decorator="['cellContentType', {
                initialValue: defaultProps.cellContentType,
                rules: [{ required: false, message: '请确认数据类型' }]
              }]"
            >
              <a-radio value="text">文本</a-radio>
              <a-radio value="multipleText">多行文本</a-radio>
              <a-radio value="attachment">附件</a-radio>
              <a-radio value="nameAndAccount">姓名/账号</a-radio>
              <a-radio value="anchor">详情锚点</a-radio>
              <a-radio value="money">金额</a-radio>
              <a-radio value="date">日期</a-radio>
              <a-radio value="time">时间</a-radio>
              <a-radio value="custom">自定义</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <template slot="label">
              <a-tooltip title="【表头渲染】会直接覆盖【表头】和【表头提示文本】">
                表头渲染函数
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </template>
            <FunctionBuilder
              v-decorator="['slotsFunction', {
                initialValue: defaultProps.slotsFunction,
                rules: [{ required: false }]
              }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="数据渲染函数" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <FunctionBuilder
              v-decorator="['scopedSlotsFunction', {
                initialValue: defaultProps.scopedSlotsFunction,
                rules: [{ required: false }]
              }]"
              @change="scopedSlotsFunctionChange"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import { jsx2vue, string2func } from '@builder/utils'
import FunctionBuilder from '@/components/FunctionBuilder'
export default {
  components: {
    FunctionBuilder
  },
  props: {
    modal: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      defaultProps: {
        width: 100,
        slotsFunction: {
          arguments: ['h', 'vm'],
          expression: ''
        },
        scopedSlotsFunction: {
          arguments: ['h', 'record', 'vm'],
          expression: ''
        }
      }
    }
  },
  watch: {
    modal: {
      handler ({ data, show }) {
        if (show) {
          this.defaultProps.width = data.props.width || 100
          this.defaultProps.cellContentType = data.props.cellContentType || 'text'
          this.defaultProps.permission = data.props.permission
          this.defaultProps.titleTips = data.props.titleTips
          this.defaultProps.title = data.props.title
          this.defaultProps.dataIndex = data.props.dataIndex
          this.defaultProps.slotsFunction.expression = data.props.slotsRender
          this.defaultProps.scopedSlotsFunction.expression = data.props.scopedSlotsRender
          this.$nextTick(() => {
            this.form.setFieldsValue({ ...this.defaultProps })
          })
        } else {
          this.form.resetFields()
          this.form = this.$form.createForm(this)
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    currentId () {
      return this.modal.data ? this.modal.data.id : ''
    },
    isModify () {
      return !!this.currentId
    },
    isNew () {
      return !this.currentId
    }
  },
  methods: {
    scopedSlotsFunctionChange (val) {
      if (val.expression) {
        this.form.setFieldsValue({ cellContentType: 'custom' })
      } else {
        this.form.setFieldsValue({ cellContentType: 'text' })
      }
    },
    getFunctionExpression (key) {
      const funcAst = this.form.getFieldValue(key) || {}
      return funcAst.expression
    },
    // showSlotsRender () {
    //   this.functionModal.key = 'slotsRender'
    //   this.functionModal.head = '(h, vm) => {'
    //   this.functionModal.expression = this.modal.data.props.slotsRender
    //   this.functionModal.tail = '}'
    //   this.functionModal.show = true
    // },
    // showScopedSlotsRender () {
    //   this.functionModal.key = 'scopedSlotsRender'
    //   this.functionModal.head = '(h, record, vm) => {'
    //   this.functionModal.expression = this.modal.data.props.scopedSlotsRender
    //   this.functionModal.tail = '}'
    //   this.functionModal.show = true
    // },
    functionConfirm () {

    },
    projectApproval (record) {
      this.$emit('projectApproval', record)
    },
    validateUniqueField (values) {
      let uniqueField = ''
      this.modal.columns.forEach((col) => {
        if (this.isNew) {
          if (values.dataIndex === col.dataIndex) {
            uniqueField = values.dataIndex
          }
        }
        if (this.isModify) {
          if (this.modal.data.id !== col.id) {
            if (values.dataIndex === col.dataIndex) {
              uniqueField = values.dataIndex
            }
          }
        }
      })
      return uniqueField
    },
    confirm () {
      this.form.validateFields((err, values) => {
        if (err) {
          return false
        }
        const uniqueField = this.validateUniqueField(values)
        if (uniqueField) {
          return this.$message.warning(`字段 "${uniqueField}" 已存在！`)
        }
        this.modal.show = false
        if (this.isNew) {
          values.id = values.dataIndex
        }
        if (this.isModify) {
          values.id = this.currentId
        }
        values = adaptContentType(values)
        values = packageParams(values)
        this.$emit('update', this.$utils.clone(values))
      })
    }
  }
}

function packageParams (params) {
  const model = {
    id: params.id,
    title: params.title,
    width: params.width,
    key: params.dataIndex,
    anchor: params.anchor,
    originTitle: params.title,
    dataIndex: params.dataIndex,
    titleTips: params.titleTips,
    permission: params.permission,
    cellContentType: params.cellContentType,
    props: { // 用于提交和回显
      title: params.title,
      width: params.width,
      anchor: params.anchor,
      key: params.dataIndex,
      originTitle: params.title,
      dataIndex: params.dataIndex,
      titleTips: params.titleTips,
      permission: params.permission,
      cellContentType: params.cellContentType
    }
  }

  // 添加锚点的专属逻辑
  // if (params.anchor === true) {
  //   model.scopedSlots = {
  //     customRender: model.dataIndex
  //   }
  // }
  // 添加表头提示
  if (params.titleTips) {
    if (!params.slotsFunction || !params.slotsFunction.expression) {
      delete model.title
      delete model.props.title
      model.slots = model.props.slots = { title: params.dataIndex + 'Title' }
      model.slotsRender = (h, vm) => {
        return (
          <a-tooltip title={params.titleTips}>
            { model.originTitle }
            <a-icon type="question-circle-o" />
          </a-tooltip>
        )
      }
      model.props.slotsRender = `return (
        <a-tooltip title={'${params.titleTips}'}>
          ${model.originTitle}
          <a-icon type={'question-circle-o'} />
        </a-tooltip>
      )`
    }
  }
  if (params.slotsFunction && params.slotsFunction.expression) {
    delete model.title
    delete model.props.title
    model.slots = model.props.slots = { title: params.dataIndex + 'Title' }
    model.slotsRender = (h, vm) => {
      return new Function(params.slotsFunction.expression)(h, vm)
    }
    model.props.slotsRender = params.slotsFunction.expression
  }

  // 配置了 scopedSlotsRender，则给
  if (params.scopedSlotsFunction && params.scopedSlotsFunction.expression) {
    model.scopedSlots = { customRender: params.dataIndex }
    model.props.scopedSlots = { customRender: params.dataIndex }
    // 这里复制必须是 function，如果是 () => {} 可能导致内部的this丢失
    model.scopedSlotsRender = string2func(jsx2vue(`function (h, record, vm) {
      ${params.scopedSlotsFunction.expression}
    }`))
    model.props.scopedSlotsRender = params.scopedSlotsFunction.expression
  }
  return model
}

function adaptContentType (values) {
  switch (values.cellContentType) {
    case 'multipleText':
      values.scopedSlotsFunction.expression = `return <SLines value={record['${values.dataIndex}']} />`
      break
    case 'anchor':
      values.anchor = true
      break
    case 'attachment':
      values.scopedSlotsFunction.expression = `return <SDownload value={record['${values.dataIndex}']} />`
      break
    case 'nameAndAccount':
      // 通过判断key的Name和Account
      const dataIndex = values.dataIndex || ''
      let nameKey, accountKey, prevLetters, nameSuffixLetters, accountSuffixLetters
      let nameIndex = dataIndex.indexOf('Name')
      let accountIndex = dataIndex.indexOf('Account')
      if (nameIndex > -1) {
        prevLetters = dataIndex.substring(0, nameIndex)
        nameSuffixLetters = dataIndex.substring(nameIndex, dataIndex.length)
        if (/s$/.test(nameSuffixLetters)) {
          accountSuffixLetters = 'Accounts'
        } else {
          accountSuffixLetters = 'Account'
        }
      }
      if (accountIndex > -1) {
        prevLetters = dataIndex.substring(0, accountIndex)
        accountSuffixLetters = dataIndex.substring(accountIndex, dataIndex.length)
        if (/s$/.test(accountSuffixLetters)) {
          nameSuffixLetters = 'Names'
        } else {
          nameSuffixLetters = 'Name'
        }
      }

      nameKey = prevLetters + nameSuffixLetters
      accountKey = prevLetters + accountSuffixLetters
      values.scopedSlotsFunction.expression = `return <HandlerTableCell name={record['${nameKey}']} account={record['${accountKey}']} />`
      break
    case 'money':
      values.scopedSlotsFunction.expression = `return vm.$utils.formatMoney(record['${values.dataIndex}'])`
      break
    case 'date':
      values.scopedSlotsFunction.expression = `return vm.$utils.date2YMD(record['${values.dataIndex}'])`
      break
    case 'time':
      values.scopedSlotsFunction.expression = `return vm.$utils.date2YMDHMS(record['${values.dataIndex}'])`
      break
    case 'text':
      values.scopedSlotsFunction.expression = ''
      break
    case 'custom':
      break
  }
  if (values.scopedSlotsFunction.expression) {
    values.scopedSlots = { customRender: values.dataIndex }
  }
  return values
}

</script>
<style lang="less" scoped>
span.width-adjust-label {
  padding: 0 1rem;
}
</style>
