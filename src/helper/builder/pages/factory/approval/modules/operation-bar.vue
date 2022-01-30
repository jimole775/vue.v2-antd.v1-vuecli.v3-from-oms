<template>
  <div>
    <a-form :form="form">
      <a-row>
        <a-col :span="24">
          <a-form-item :label="'审批'" :label-col="{span: 2}" :wrapper-col="{span: 16}">
            <a-radio-group name="radioGroup" v-model="approvalResult">
              <a-radio value="1">通过</a-radio>
              <!-- 第一个节点没有 驳回 操作 -->
              <a-radio v-if="currentNode.nodeCode !== 'start'" value="2">
                <span>驳回</span>&nbsp;
                <a-tooltip>
                  <template slot="title">
                    <div>驳回至流程发起节点，申请人可编辑后重新提交，或关闭流程</div>
                  </template>
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </a-radio>
              <a-radio v-if="currentNode.nodeCode !== 'start' && currentNode.nodeCode !== 'business_approval' && currentNode.nodeCode !== 'finance_manage_bp_approval'" value="3">
                <template>
                  <span>不通过</span>&nbsp;
                  <a-tooltip>
                    <template slot="title">
                      <div>不通过并结束流程</div>
                    </template>
                    <a-icon type="question-circle-o" />
                  </a-tooltip>
                </template>
              </a-radio>
              <a-radio v-if="currentNode.nodeCode === 'start'" value="3">
                <span>关闭</span>
              </a-radio>
              <a-radio v-if="currentNode.nodeCode === 'business_approval' || currentNode.nodeCode === 'purchase_manager_approval' || currentNode.nodeCode === 'finance_manage_bp_approval'" value="8">
                <span>转审</span>
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="24" v-if="approvalResult === '8'">
          <a-form-item :label="'转审处理人'" :label-col="{span: 2}" :wrapper-col="{span: 16}">
            <!-- <UserSelect
              v-decorator="['transfer',{rules: [{ required: true, message: '请确认转审人' }]}]"
            /> -->
          </a-form-item>
        </a-col>
        <a-col :span="24" v-if="approvalResult !== '8'">
          <a-form-item :label="'审批意见'" :label-col="{span: 2}" :wrapper-col="{span: 16}">
            <a-textarea :rows="4" v-decorator="['approvalContent', {rules: [{ required: true, message: '请填写审批意见' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="' '" :label-col="{span: 4}" :wrapper-col="{span: 18}">
            <ConfigButton />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import ConfigButton from '@/helper/builder/pages/factory/common/config-button'
export default {
  components: {
    ConfigButton
  },
  props: {
  },
  data () {
    return {
      currentNode: {},
      approvalResult: '1',
      form: this.$form.createForm(this)
    }
  },
  methods: {
    changePanelKey () {

    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-row {
  line-height: 2.5;
}
</style>
