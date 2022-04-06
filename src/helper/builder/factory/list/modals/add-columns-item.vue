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
                                { required: true, message: '请确认key' },
                                { pattern: /^[a-zA-Z]([a-zA-Z0-9]*)$/g, message: '只支持大小写英文字母、数字'}
                              ]
                            }]"
            />
          </a-form-item>
        </a-col>
        <a-col v-if="!form.getFieldValue('slotsRender')" :span="24">
          <a-form-item label="label" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['title', {rules: [{ required: true, message: '请确认title' }]}]" />
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
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
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
import { jsx2vue, string2func } from '@builder/utils'
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
          anchor: false,
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

      // 添加锚点的专属逻辑
      if (params.anchor === '1') {
        model.scopedSlots = {
          customRender: model.dataIndex
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

      // 配置了 scopedSlotsRender，则给
      if (params.scopedSlotsRender) {
        model.anchorTransfer = false
        model.scopedSlots = model.props.scopedSlots = { customRender: params.dataIndex }
        console.log('model.scopedSlots:', model.scopedSlots)
        // 这里复制必须是 function，如果是 () => {} 可能导致内部的this丢失
        model.scopedSlotsRender = string2func(jsx2vue(`function (h, record, vm) {
          ${params.scopedSlotsRender}
        }`))
        console.log('model.scopedSlotsRender:', model.scopedSlotsRender)
        model.props.scopedSlotsRender = params.scopedSlotsRender
      }
      return model
    }
  }
}

</script>
