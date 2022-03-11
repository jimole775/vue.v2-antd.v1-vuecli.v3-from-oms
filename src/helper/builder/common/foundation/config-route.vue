<template>
  <a-modal
    :title="'路由配置'"
    v-model="modal.show"
    width="60%"
    @ok="confirm"
  >
    <a-form :form="form">
      <a-row>
        <a-col :span="24">
          <a-form-item label="父级目录" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input :disabled="true" v-decorator="['parent']" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="目录名" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input
              v-decorator="['name', {
                rules: [
                  { required: true, message: '请确认目录名' },
                  { pattern: /^[a-z]([a-z-]*)$/g, message: '只支持小写字母、-'}
                ]
              }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="路由地址" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input placeholder="/xxx/xxx/xxx" v-decorator="['path', {rules: [{ required: true, message: '请确认路由地址' }]}]" />
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
          setTimeout(() => {
            this.form.setFieldsValue(data)
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
        this.$emit('update', utils.clone(values))
      })
    }
  }
}

</script>
