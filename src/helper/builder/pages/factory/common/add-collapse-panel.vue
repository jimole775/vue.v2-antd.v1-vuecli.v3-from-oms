<template>
  <a-modal
    title="新增板块"
    v-model="modal.show"
    width="60%"
    @ok="confirm"
  >
    <a-form :form="form">
      <a-row>
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
          <a-form-item label="默认展开" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-radio-group v-decorator="['extend', {rules: [{ required: false }]}]">
              <a-radio :value="true">
                是
              </a-radio>
              <a-radio :value="false">
                否
              </a-radio>
            </a-radio-group>
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
              :options="getStepNodes"
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
    ...mapGetters(['getStepNodes', 'getTabType'])
  },
  watch: {
    modal: {
      handler ({ data, show }) {
        if (show) {
          this.$nextTick(() => {
            if (data) {
              if (data.stepNodes === undefined) {
                data.stepNodes = this.getStepNodes.map(i => i.value)
              }
              this.form.setFieldsValue(data)
            } else {
              this.form.setFieldsValue({
                extend: true,
                stepNodes: this.getStepNodes.map(i => i.value)
              })
            }
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
<style lang="less" scoped>
.object-ctrl {
  display: flex;
  padding: 4px;
  button {
    margin-left: 4px;
  }
}
</style>
