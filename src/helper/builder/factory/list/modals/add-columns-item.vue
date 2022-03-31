<template>
  <a-modal
    title="表单配置"
    v-model="modal.show"
    width="60%"
    @ok="confirm"
  >
    <a-form :form="form">
      <a-row>
        <a-col :span="24">
          <a-form-item label="key" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input
              v-decorator="['dataIndex',
                            {
                              rules: [
                                { required: true, message: '请确认字段名' },
                                { pattern: /^[a-zA-Z]([a-zA-Z0-9]*)$/g, message: '只支持大小写英文字母、数字'}
                              ]
                            }]"
            />
          </a-form-item>
        </a-col>
        <a-col v-if="!form.getFieldValue('slotsRender')" :span="24">
          <a-form-item label="title" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['title', {rules: [{ required: true, message: '请确认字段标签' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="宽度" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input-number v-decorator="['width', {rules: [{ required: false }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="人员查看权限" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-radio-group v-decorator="['permission', {rules: [{ required: false }]}]">
              <a-radio value="2">全部</a-radio>
              <a-radio value="0">内部</a-radio>
              <a-radio value="1">外部</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col v-if="!form.getFieldValue('scopedSlotsRender')" :span="24">
          <a-form-item label="详情锚点" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-radio-group v-decorator="['anchor', {rules: [{ required: false }]}]">
              <a-radio value="1">是</a-radio>
              <a-radio value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col v-if="!form.getFieldValue('slotsRender')" :span="24">
          <a-form-item label="表头提示文本" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['titleTips', {rules: [{ required: false }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <template slot="label">
              <a-tooltip title="【表头渲染】会直接覆盖【表头】和【表头提示文本】">
                表头渲染
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </template>
            <span>(h, vm) => {</span>
            <a-textarea v-decorator="['slotsRender', {rules: [{ required: false }]}]" />
            <span>}</span>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <template slot="label">
              <a-tooltip title="【数据渲染】会直接覆盖【详情锚点】">
                数据渲染
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </template>
            <span>(h, record, vm) => {</span>
            <a-textarea v-decorator="['scopedSlotsRender', {rules: [{ required: false }]}]" />
            <span>}</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
export default {
  props: {
    modal: {
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
    modal: {
      handler ({ data, show }) {
        if (show) {
          this.defaultProps()
          data && this.deployParams(data)
        } else {
          this.form.resetFields()
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    title () {
      return this.modal.data ? this.modal.data.title : ''
    }
  },
  methods: {
    projectApproval (record) {
      this.$emit('projectApproval', record)
    },
    defaultProps () {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          width: 100,
          anchor: '0',
          permission: '0'
        })
      })
    },
    deployParams (data) {
      this.$nextTick(() => {
        this.form.setFieldsValue(data.props)
      })
    },
    confirm () {
      this.form.validateFields((err, values) => {
        if (err) {
          return false
        }
        this.modal.show = false
        this.$emit('update', this.packageParams(values))
      })
    },
    packageParams (params) {
      const model = {
        title: params.title,
        width: params.width,
        anchor: params.anchor,
        originTitle: params.title,
        dataIndex: params.dataIndex,
        titleTips: params.titleTips,
        permission: params.permission,
        props: { // 用于提交和回显
          title: params.title,
          width: params.width,
          anchor: params.anchor,
          originTitle: params.title,
          dataIndex: params.dataIndex,
          titleTips: params.titleTips,
          permission: params.permission
        }
      }
      // 添加锚点
      if (params.anchor === '1') {
        if (!params.scopedSlotsRender) {
          model.anchorTransfer = true // 标记 scopedSlotsRender 是被【详情锚点】改造而来的
          model.scopedSlots = model.props.scopedSlots = { customRender: params.dataIndex }
          model.scopedSlotsRender = (h, record, vm) => {
            return (
              <a onClick={() => this.projectApproval(record)}>
                { record[params.dataIndex] }
              </a>
            )
          }
          model.props.scopedSlotsRender = `return (
            <a onClick={() => vm.bridge.projectApproval(record)}>
              { record['${params.dataIndex}'] }
            </a>
          )`
        }
      } else {
        if (model.anchorTransfer) {
          model.anchorTransfer = false
          model.scopedSlotsRender = model.scopedSlots = model.props.scopedSlots = undefined
        }
      }
      // 添加表头提示
      if (params.titleTips) {
        if (!params.slotsRender) {
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
            <a-tooltip title={${params.titleTips}}>
              { ${model.originTitle} }
              <a-icon type="question-circle-o" />
            </a-tooltip>
          )`
        }
      }
      if (params.slotsRender) {
        delete model.title
        delete model.props.title
        model.slots = model.props.slots = { title: params.dataIndex + 'Title' }
        model.slotsRender = (h, vm) => {
          return new Function(params.slotsRender)(h, vm)
        }
        model.props.slotsRender = params.slotsRender
      }

      if (params.scopedSlotsRender) {
        model.anchorTransfer = false
        model.scopedSlots = model.props.scopedSlots = { customRender: params.dataIndex }
        model.scopedSlotsRender = (h, record, vm) => {
          return new Function(params.scopedSlotsRender)(h, record, vm)
        }
        model.props.scopedSlotsRender = params.scopedSlotsRender
      }
      return model
    }
  }
}

</script>
