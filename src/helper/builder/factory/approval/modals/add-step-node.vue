<template>
  <a-modal
    title="新增节点"
    v-model="modal.show"
    width="60%"
    @ok="confirm"
  >
    <a-form :form="form">
      <a-row>
        <a-col :span="24">
          <a-form-item label="节点名" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['value', {rules: [{ required: true, message: '请确认节点名' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="节点标签" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['label', {rules: [{ required: false }]}]" />
          </a-form-item>
        </a-col>
        <!-- <a-col :span="24">
          <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <template slot="label">
              <span>
                节点模块关系
                <a-tooltip>
                  <template slot="title">
                    <p>引用：所有节点共用一份数据，每一个节点的改动，都会触发其他节点的变更</p>
                    <p>克隆：每个节点都有一份独立的数据</p>
                    <p>【小技巧】先用“引用”，把所有数据都同步完，然后再改成“克隆”，逐一进行调整。</p>
                  </template>
                  <a-icon type="question-circle" />
                </a-tooltip>
              </span>
            </template>
            <a-radio-group v-decorator="['nodeRelation', {rules: [{ required: false }]}]">
              <a-radio value="reference">
                引用
              </a-radio>
              <a-radio value="clone">
                克隆
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col> -->
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
