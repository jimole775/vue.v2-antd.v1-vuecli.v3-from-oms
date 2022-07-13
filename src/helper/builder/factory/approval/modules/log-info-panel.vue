<template>
  <a-collapse
    :bordered="false"
    :active-key="['101']"
  >
    <a-collapse-panel
      header="审批信息"
      key="101"
      class="m-block"
    >
      <a-form :form="form">
        <a-row>
          <!-- <a-col :span="24">
            <a-form-item label="业务ID" :label-col="{span: 6}" :wrapper-col="{span: 16}">
              <a-input v-decorator="['businessId', {rules: [{ required: true, message: '请确认业务ID' }]}]" />
            </a-form-item>
          </a-col> -->
          <!-- logType: 'key_events_flow' // 日志的type -->
          <a-col :span="12">
            <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
              <template slot="label">
                <span>
                  业务类型
                  <a-tooltip title="可参考字典项：'业务类型（待办表）'">
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </span>
              </template>
              <a-input v-decorator="['businessType', {rules: [{ required: true, message: '请确认业务类型' }]}]" @blur="confirm" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-collapse-panel>
  </a-collapse>
</template>
<script>
import utils from '@/utils'
export default {
  name: 'LogBar',
  props: {
    value: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  watch: {
    value: {
      handler (data) {
        setTimeout(() => {
          this.form.setFieldsValue(data)
        })
      },
      immediate: true
    }
  },
  methods: {
    confirm () {
      this.form.validateFields((err, values) => {
        if (err) {
          return false
        }
        this.$emit('update', utils.clone(values))
      })
    }
  }
}
</script>
