<template>
  <a-modal
    title="搜索项配置"
    v-model="modal.show"
    width="60%"
    @ok="confirm"
  >
    <a-form :form="form">
      <a-row>
        <a-col :span="24">
          <a-form-item label="字段名" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['key', {rules: [{ required: true, message: '请确认关键字' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="字段标签" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['title', {rules: [{ required: true, message: '请确认字段标签' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="宽度调整" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <div class="width-adjust" style="display: flex;">
              <span class="width-adjust-label">span: </span>
              <a-input-number v-decorator="['span', { rules: [{ required: false }]}]" />
              <span class="width-adjust-label">label: </span>
              <a-input-number v-decorator="['label', { rules: [{ required: false }]}]" />
              <span class="width-adjust-label">wrapper: </span>
              <a-input-number v-decorator="['wrapper', { rules: [{ required: false }]}]" />
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <span slot="label">
              提交字段调整
              <a-tooltip title="当一个组件需要提交至少两个字段时，可以使用。">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <code v-if="showParamTransfer">
              <span>paramTransfer (params, vm) {</span>
              <a-textarea v-decorator="['paramTransfer', {rules: [{ required: false }]}]" />
              <span>}</span>
            </code>
            <a v-else @click="showParamTransfer = true"><a-icon type="plus-circle" /></a>
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
        <a-col :span="24">
          <a-form-item label="配置类型" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-radio-group v-model="configType">
              <a-radio value="selection">
                配选
              </a-radio>
              <a-radio value="function">
                手写
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <div v-if="configType === 'selection'">
        <ComponentConfig :key="modal.show" :data-source="componentInfo" @update="componentUpdate" />
      </div>
      <a-row>
        <div v-if="configType === 'function'">
          <a-col :span="24">
            <a-form-item label="自定义组件" :label-col="{span: 6}" :wrapper-col="{span: 16}">
              <code>
                <span>wrapperCustomRender (h, formItem, vm) {</span>
                <a-textarea v-decorator="['wrapperCustomRender', {rules: [{ required: true, message: '请输入函数实体' }]}]" />
                <span>}</span>
              </code>
            </a-form-item>
          </a-col>
        </div>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
import ComponentConfig from './component-config'
export default {
  components: {
    ComponentConfig
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
      componentInfo: {},
      configType: 'selection',
      showParamTransfer: false
    }
  },
  computed: {
    ...mapGetters(['getStepNodes', 'getTabType'])
  },
  watch: {
    modal: {
      handler ({ data, show }) {
        if (show) {
          if (data) {
            this.initialize(data)
          } else {
            this.$nextTick(() => {
              this.form.setFieldsValue({
                span: 6,
                label: 6,
                wrapper: 16,
                stepNodes: this.getStepNodes
              })
            })
          }
        } else {
          this.reset()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    initialize (data) {
      const itemInfo = {
        key: data.key,
        title: data.title,
        stepNodes: data.stepNodes || this.getStepNodes,
        span: data.layout ? data.layout.span : 6,
        label: data.layout ? data.layout.label : 6,
        wrapper: data.layout ? data.layout.wrapper : 16
      }
      if (data.wrapperCustomRender) {
        this.configType = 'function'
        itemInfo.wrapperCustomRender = data.wrapperCustomRender
      } else {
        this.configType = 'selection'
        this.componentInfo.props = data.props
        this.componentInfo.component = data.component
        this.componentInfo.originProps = data.originProps
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(itemInfo)
      })
    },
    reset () {
      this.form.resetFields()
      this.showParamTransfer = false
      this.configType = 'selection'
      this.componentInfo = {}
    },
    confirm () {
      this.form.validateFields((err, values) => {
        if (err) {
          return false
        }
        this.modal.show = false
        const model = {
          key: values.key,
          title: values.title,
          stepNodes: values.stepNodes,
          configType: this.configType,
          layout: {
            span: values.span,
            label: values.label,
            wrapper: values.wrapper
          }
        }

        if (this.configType === 'selection') {
          model.component = this.componentInfo.component
          model.originProps = this.componentInfo.originProps
          model.props = this.componentInfo.props
        } else {
          model.wrapperCustomRender = values.wrapperCustomRender
        }
        this.$emit('update', utils.clone(model))
      })
    },
    componentUpdate (data) {
      this.componentInfo = data
    }
  }
}
</script>
<style lang="less" scoped>
.width-adjust {
  display: flex;
  span.width-adjust-label {
    padding: 0 1rem;
  }
  /deep/.ant-input-number {
    top: 4px;
  }
}
.object-ctrl {
  display: flex;
  padding: 4px;
  button {
    margin-left: 4px;
  }
}
.reference-object {
   display: flex;
   > span {
     padding: 0 0.3rem;
     border: 1px solid rgb(217 217 217);
   }
   > span:first-child {
     border-right: 0;
     border-radius: 0;
     border-radius: 3px 0 0 3px;
   }
   > span:last-child {
     border-left: 0;
     border-radius: 0 3px 3px 0;
   }
   > textarea {
     margin-bottom: 0;
     border-radius: 0;
   }
}
</style>
