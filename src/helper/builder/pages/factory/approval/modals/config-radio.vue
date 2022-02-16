<template>
  <a-modal
    title="配置"
    v-model="modal.show"
    width="60%"
    @ok="confirm"
  >
    <a-form :form="form">
      <a-row>
        <a-col :span="24">
          <a-form-item label="选项值" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['checked', {rules: [{ required: true, message: '请确认选项值' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="选项标签" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['label', {rules: [{ required: true, message: '请确认选项标签' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="提示文本" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['tips', {rules: [{ required: false }]}]" />
          </a-form-item>
        </a-col>
        <a-col v-if="getTabType === '2'" :span="24">
          <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <span slot="label">
              控制节点
              <a-tooltip title="勾选即显示">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-checkbox-group
              v-decorator="['stepNodes', {rules: [{ required: false }]}]"
              :options="stepNodesOptions"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
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
  computed: {
    ...mapGetters(['getStepNodes', 'getTabType']),
    stepNodesOptions () {
      const res = []
      this.getStepNodes.forEach((node) => {
        if (node.value !== 'end') {
          res.push(node)
        }
      })
      return res
    }
  },
  watch: {
    modal: {
      handler ({ data, show }) {
        if (show) {
          if (data) {
            this.$nextTick(() => {
              if (data.stepNodes === undefined) {
                data.stepNodes = this.stepNodesOptions.map(i => i.value)
              }
              this.form.setFieldsValue(data)
            })
          }
        } else {
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
        this.$emit(
          'update',
          utils.clone({
            ...this.modal.data,
            ...values
          }),
          this.modal.index
        )
      })
    }
  }
}

</script>
<style lang="less" scoped>
.object-ctrl {
  display: flex;
  padding: 4px;
  button {
    margin-left: 4px;
  }
}
</style>
