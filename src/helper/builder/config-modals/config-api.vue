<template>
  <a-modal
    :title="title ? `配置【${title}】` : '配置'"
    v-model="modal.show"
    width="60%"
    @ok="confirm"
  >
    <a-form :form="form">
      <a-row>
        <a-col :span="24">
          <a-form-item label="url" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input placeholder="/api/xxx/xxx" v-decorator="['url', {rules: [{ required: true, message: '请确认url' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="method" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-select placeholder="请选择" v-decorator="['method', {rules: [{ required: true, message: '请确认method' }]}]">
              <a-select-option value="GET">GET</a-select-option>
              <a-select-option value="POST">POST</a-select-option>
              <a-select-option value="PUT">PUT</a-select-option>
              <a-select-option value="DELETE">DELETE</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <slot name="custom" />
      </a-row>
      <CustomParams v-model="customParams" />
    </a-form>
  </a-modal>
</template>
<script>
import utils from '@/utils'
import CustomParams from '../config-modules/custom-params.vue'
export default {
  components: {
    CustomParams
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
      customParams: {}
    }
  },
  computed: {
    title () {
      return this.modal.data ? this.modal.data.title : ''
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
        const model = {
          title: this.modal.data.title,
          url: values.url,
          method: values.method,
          permission: values.permission,
          params: this.customParams
        }
        this.$emit('update', utils.clone(model))
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
