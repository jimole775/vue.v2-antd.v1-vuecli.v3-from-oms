<template>
  <a-collapse-panel>
    <template slot="header">
      <div>
        <span>审批日志</span>&nbsp;
        <a @click="show"><a-icon type="edit" /></a>
        <a-modal
          title="配置"
          width="60%"
          v-model="modal.show"
          @ok="confirm"
        >
          <a-form :form="form">
            <a-row>
              <a-col :span="24">
                <a-form-item label="主要参数(LogType)" :label-col="{span: 6}" :wrapper-col="{span: 16}">
                  <a-input v-decorator="['logType', {rules: [{ required: true, message: '请确认LogType' }]}]" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-modal>
      </div>
    </template>
  </a-collapse-panel>
</template>
<script>
import utils from '@/utils'
export default {
  name: 'LogBar',
  props: {
    dataSource: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      modal: {
        show: false
      },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    show () {
      this.modal.show = true
    },
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
<style lang="less" scoped>
// /deep/.ant-steps-item-title::after {
//   height: 0 !important;
// }
</style>
