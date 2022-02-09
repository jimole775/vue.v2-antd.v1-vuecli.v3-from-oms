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
            <a-input v-decorator="['value', {rules: [{ required: true, message: '请确认选项值' }]}]" />
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
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import utils from '@/utils'
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
          this.$nextTick(() => {
            if (data) this.form.setFieldsValue(data)
          })
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
