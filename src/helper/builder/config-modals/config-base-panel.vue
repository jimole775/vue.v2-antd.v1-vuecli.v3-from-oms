<template>
  <a-modal
    title="配置板块"
    v-model="modal.show"
    width="60%"
    @ok="confirm"
  >
    <a-form :form="form">
      <a-row>
        <a-col class="sub-title">
          板块信息：
        </a-col>
        <a-col :span="24">
          <a-form-item label="表头" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['title', {rules: [{ required: true, message: '请确认表头' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="提示文本" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['tips', {rules: [{ required: false }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="板块组件" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input
              disabled
              v-decorator="['component', { initialValue: 'FormItemRender', rules: [{ required: true }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="默认展开" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-radio-group disabled v-decorator="['extend', { initialValue: true, rules: [{ required: false }] }]">
              <a-radio :value="true">
                是
              </a-radio>
              <a-radio :value="false">
                否
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col v-if="nodes && nodes.length" :span="24">
          <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <span slot="label">
              可显示节点
              <a-tooltip title="勾选即显示">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-checkbox-group
              v-decorator="['showOnNodes']"
              disabled
            >
              <a-checkbox
                v-for="node in nodes"
                :key="node.value"
                :value="node.value"
                :disabled="node.disabled"
              >
                {{ node.label }}
              </a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
        <a-col v-if="nodes && nodes.length" :span="24">
          <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <span slot="label">
              可编辑节点
              <a-tooltip title="当板块处在编辑节点，提交时，将会自动提取和校验必填数据！">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-checkbox-group
              v-decorator="['editOnNodes', {rules: [{ required: false }]}]"
            >
              <a-checkbox
                v-for="node in nodes"
                :key="node.value"
                :value="node.value"
                :disabled="node.disabled"
              >
                {{ node.label }}
              </a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
        <a-col class="sub-title">
          详情接口：
        </a-col>
        <ApiDeclaration v-model="apiConfig" />
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import utils from '@/utils'
import ApiDeclaration from '@/components/ApiDeclaration'
export default {
  components: {
    ApiDeclaration
  },
  props: {
    modal: { type: Object, default: () => ({}) },
    nodes: { type: Array, default: () => [] }
  },
  data () {
    return {
      apiConfig: {},
      form: this.$form.createForm(this)
    }
  },
  watch: {
    modal: {
      handler ({ data: { panel, detail }, show }) {
        if (show) {
          this.$nextTick(() => {
            if (panel) {
              if (panel.showOnNodes === undefined) {
                panel.showOnNodes = this.nodes.map(i => i.value)
                panel.showOnRadios = []
                panel.editOnNodes = []
              }
              this.form.setFieldsValue(panel)
            } else {
              this.form.setFieldsValue({
                extend: true,
                showOnNodes: this.nodes.map(i => i.value),
                editOnNodes: [],
                showOnRadios: []
              })
            }
          })
          if (detail) {
            this.apiConfig = utils.clone(detail)
          }
        } else {
          this.apiConfig = {}
          this.form.resetFields()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    confirm () {
      this.form.validateFields((err, values) => {
        if (err) {
          return false
        }
        this.modal.show = false
        this.$emit('update', {
          panel: utils.clone(values),
          detail: utils.clone(this.apiConfig)
        })
      })
    }
  }
}

</script>
<style lang="less" scoped>
.sub-title {
  border-bottom: 1px solid #cfcfcf;
  padding: 0.2rem 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
