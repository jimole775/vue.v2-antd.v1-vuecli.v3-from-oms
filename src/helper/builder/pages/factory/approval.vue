<template>
  <div>
    <ApprovalStepBar :id="recordData.projectFlowInstanceId" :node="recordData.projectFlowNode" @update="updateCurrentNode" />
    <a-collapse
      :bordered="false"
      :active-key="['1','2','3','4','5', '6', '7', '8', '9']"
      @change="changePanelKey"
    >
      <a-collapse-panel
        header="基本信息"
        key="1"
        class="m-block"
      >
        <BaseInfo ref="BaseInfoRef" :data-source="basicData" :columns="isFp ? fpBaseinfoColumns : tmpBaseinfoColumns" />
      </a-collapse-panel>
      <!-- 采购经理在立项审批页面，始终不可见：FP预算评估 -->
      <a-collapse-panel
        v-if="!isPurchaseManager && isFp"
        header="FP预算评估"
        key="2"
        class="m-block"
      >
        <!-- <Assess ref="AssessRef" :data-source="basicData" :mode="'readonly'" /> -->
      </a-collapse-panel>
      <a-collapse-panel
        v-if="!isPurchaseManager && isTmp"
        header="TM预算评估"
        key="3"
        class="m-block"
      >
        <!-- <TMAssess ref="TMAssessRef" :data-source="basicData" :mode="'readonly'" /> -->
      </a-collapse-panel>
      <a-collapse-panel
        v-if="isFp"
        header="FP项目阶段&主要交付内容"
        key="4"
        class="m-block"
      >
        <!-- <Deliveries ref="DeliveriesRef" :data-source="basicData" :mode="'readonly'" /> -->
      </a-collapse-panel>
      <a-collapse-panel
        header="技术标评分标准"
        key="5"
        class="m-block"
        :id="'PPTechStandard'"
      >
        <!-- <PPTechStandard
          ref="PPTechStandardRef"
          :data-source="basicData"
          :mode="'readonly'"
          :env-type="'apply'"
        /> -->
      </a-collapse-panel>
      <a-collapse-panel
        v-if="isFp"
        header="FP项目验收评分标准"
        key="6"
        class="m-block"
      >
        <!-- <Standard ref="StandardRef" :data-source="basicData" :mode="'readonly'" /> -->
      </a-collapse-panel>
      <a-collapse-panel
        header="项目相关附件上传"
        key="7"
        class="m-block"
      >
        <!-- <Attachment ref="AttachmentRef" :data-source="basicData" :mode="'readonly'" /> -->
      </a-collapse-panel>
      <a-collapse-panel
        v-if="isCanApproval"
        header="审批操作"
        key="8"
        class="m-block"
      >
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
            <a-col :span="24" v-if="isInherit && approvalResult === '1' && currentNode.nodeCode === 'purchase_manager_approval'">
              <a-form-item :label="'采购类型'" :label-col="{span: 2}" :wrapper-col="{span: 16}">
                <a-radio-group name="radioGroup1" v-decorator="['purchaseType', {initialValue: basicData.createdType, rules: [{ required: true, message: '请选择' }]}]">
                  <a-radio value="0">竞标</a-radio>
                  <a-radio value="1">继承</a-radio>
                  <span>（选择继承，则发标至继承供应商）</span>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="24" v-if="approvalResult === '8'">
              <a-form-item :label="'转审处理人'" :label-col="{span: 2}" :wrapper-col="{span: 16}">
                <UserSelect
                  v-decorator="['transfer',{rules: [{ required: true, message: '请确认转审人' }]}]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24" v-if="approvalResult !== '8'">
              <a-form-item :label="'审批意见'" :label-col="{span: 2}" :wrapper-col="{span: 16}">
                <a-textarea :rows="4" v-decorator="['approvalContent', {rules: [{ required: true, message: '请填写审批意见' }]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="' '" :label-col="{span: 4}" :wrapper-col="{span: 18}">
                <div>
                  <a-button type="primary" style="margin-right:10px" @click="submitBtn">提交</a-button>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-collapse-panel>
      <a-collapse-panel
        header="审批日志"
        key="9"
        class="m-block"
      >
        <PPApproveLog :business-id="recordData.id" :business-type="'project_apply'" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
// import Assess from '../project-purchase/edit-modules/PPAssess'
// import TMAssess from '../project-purchase/edit-modules/TMAssess'
// import Deliveries from '../project-purchase/edit-modules/PPDeliveries'
// import Standard from '../project-purchase/edit-modules/PPStandard'
// import PPTechStandard from '../project-purchase/edit-modules/PPTechStandard'
// import Attachment from '../project-purchase/edit-modules/PPAttachment'
import BaseInfo from '@/components/PPBaseInfo'
import PPApproveLog from '@/components/PPApproveLog'
import ApprovalStepBar from '@/components/ApprovalStepBar'
const fpBaseinfoColumns = [
  { key: 'prNo', label: '项目PR', labelCol: '', wrapperCol: '' },
  { key: 'applyName', label: '申请人', labelCol: '', wrapperCol: '' },
  { key: 'organizationName', label: '项目所属组织', labelCol: '', wrapperCol: '' },
  { key: 'projectManagerName', label: '项目经理', labelCol: '', wrapperCol: '' },
  { key: 'projectName', label: '项目名称', labelCol: '', wrapperCol: '' },
  { key: 'projectTypeName', label: '项目类型', labelCol: '', wrapperCol: '' },
  { key: 'projectAttributeName', label: '项目属性', labelCol: '', wrapperCol: '' },
  { key: 'supplierGroupName', label: '二级分类', labelCol: '', wrapperCol: '' },
  { key: 'createdTypeName', label: '是否新项目', labelCol: '', wrapperCol: '' },
  { key: 'preStartDate', label: '预计开始时间', labelCol: '', wrapperCol: '' },
  { key: 'preEndDate', label: '预计结束时间', labelCol: '', wrapperCol: '' }
]
const tmpBaseinfoColumns = [
  { key: 'prNo', label: '项目PR', labelCol: '', wrapperCol: '' },
  { key: 'applyName', label: '申请人', labelCol: '', wrapperCol: '' },
  { key: 'organizationName', label: '项目所属组织', labelCol: '', wrapperCol: '' },
  { key: 'projectManagerName', label: '项目经理', labelCol: '', wrapperCol: '' },
  { key: 'projectName', label: '项目名称', labelCol: '', wrapperCol: '' },
  { key: 'projectTypeName', label: '项目类型', labelCol: '', wrapperCol: '' },
  { key: 'projectAttributeName', label: '项目属性', labelCol: '', wrapperCol: '' },
  { key: 'createdTypeName', label: '是否新项目', labelCol: '', wrapperCol: '' },
  { key: 'preStartDate', label: '预计开始时间', labelCol: '', wrapperCol: '' },
  { key: 'preEndDate', label: '预计结束时间', labelCol: '', wrapperCol: '' }
]
export default {
  components: {
    // Assess,
    // TMAssess,
    BaseInfo,
    // Standard,
    // Deliveries,
    // Attachment,
    PPApproveLog,
    // PPTechStandard,
    ApprovalStepBar
  },
  props: {
    recordData: {
      type: Object,
      default: () => ({})
    },
    employeeNumber: {
      type: [String, Number],
      default: null
    }
  },
  data () {
    return {
      fpBaseinfoColumns,
      tmpBaseinfoColumns,
      basicData: {},
      currentNode: {},
      approvalResult: '1',
      form: this.$form.createForm(this)
    }
  },
  watch: {
    recordData: {
      async handler (val) {
        if (!val) return false
        const res = await api.getpoprojectbaseinfoforapply(val)
        if (res.code === 200) {
          this.basicData = { ...val, ...res.data }
          // 立项申请 始终对 采购经理 隐藏【立项申请书】，【立项申请评审纪要】
          // 因为公共组件Attachment，要根据confirmBidStartFlag，technicalScoreStartFlag的值判断是否隐藏
          // 所以这里将这两个值置为0
          this.basicData.confirmBidStartFlag = 0
          this.basicData.technicalScoreStartFlag = 0
        } else {
          this.$message.warning(res.message)
        }
      },
      immediate: true
    }
  },
  computed: {
    isFp () {
      return this.basicData.projectType === 'fp'
    },
    isTmp () {
      return this.basicData.projectType === 'tmp'
    },
    isInherit () {
      return this.basicData.createdType === '1'
    },
    isCanApproval () {
      return this.currentNode &&
        this.currentNode.approvalAccountList &&
          this.currentNode.approvalAccountList.includes(this.employeeNumber)
    },
    isPurchaseManager () {
      return this.$store.state.global.userRole.type === 'PURCHASEMANAGE' ||
        this.$store.state.global.userRole.type === 'CEGHEADER'
    }
  },
  methods: {
    changePanelKey () {

    },
    submitBtn () {
      this.form.validateFields(async (err, values) => {
        if (err) {
          return
        }
        if (values.transfer) {
          values.transferAccount = utils.splitUser(values.transfer)[0]
          values.transferName = utils.splitUser(values.transfer)[1]
        }
        this.startApprove({
          ...this.basicData,
          ...values,
          instanceId: this.basicData.projectFlowInstanceId,
          approvalResult: this.approvalResult
        })
      })
    },
    // 发起审批
    async startApprove (obj) {
      let res = await api.ppprojectapproval(obj)
      if (res.code === 200) {
        this.$message.success('操作成功')
        this.$emit('close')
      } else {
        this.$modal.warning({
          title: '提示',
          content: res.message
        })
      }
    },
    updateCurrentNode (node) {
      this.currentNode = node
    }
  }
}
</script>
<style lang="less" scoped>
.ppproject-footer {
  text-align: center;
  margin: 2rem 0;
  button {
    width: 16rem;height:2.6rem;
  }
}
/deep/.ant-row {
  line-height: 2.5;
}
</style>
