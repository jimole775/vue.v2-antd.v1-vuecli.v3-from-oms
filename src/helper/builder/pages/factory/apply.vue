<template>
  <div>
    <ApprovalNodesMap :api-name="'postpoprojectfindFlowNode'" :params="{ organizationCode: formData.organizationCode }" />
    <a-collapse
      :bordered="false"
      :active-key="['1','2','3','4','5', '6', '7']"
    >
      <a-collapse-panel
        header="基本信息"
        key="1"
        class="m-block"
        :id="'BaseInfoEdit'"
      >
        <!-- <BaseInfoEdit ref="BaseInfoEditRef" :data-source="basicData" @change="baseInfoEditChange" /> -->
      </a-collapse-panel>
      <a-collapse-panel
        v-if="formData.projectType === 'fp'"
        header="FP预算评估"
        key="2"
        class="m-block"
        :id="'PPAssessEdit'"
      >
        <!-- <PPAssessEdit
          ref="PPAssessEditRef"
          :mode="'edit'"
          :formData="formData"
          :data-source="basicData"
        /> -->
      </a-collapse-panel>
      <a-collapse-panel
        v-if="formData.projectType === 'tmp'"
        header="TM预算评估"
        key="3"
        class="m-block"
        :id="'TMAssessEdit'"
      >
        <!-- <TMAssessEdit
          ref="TMAssessEditRef"
          :mode="'edit'"
          :formData="formData"
          :data-source="basicData"
        /> -->
      </a-collapse-panel>
      <a-collapse-panel
        v-if="formData.projectType === 'fp'"
        header="FP项目阶段&主要交付内容"
        key="4"
        class="m-block"
        :id="'PPDeliveriesEdit'"
      >
        <!-- <PPDeliveriesEdit ref="PPDeliveriesEditRef" :data-source="basicData" :mode="basicData.prNo ? 'reapply' : 'edit'" /> -->
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
          :mode="basicData.prNo ? 'reapply' : 'edit'"
          :env-type="'apply'"
        /> -->
      </a-collapse-panel>
      <a-collapse-panel
        v-if="formData.projectType === 'fp'"
        header="FP项目验收评分标准"
        key="6"
        class="m-block"
        :id="'PPStandardEdit'"
      >
        <!-- <PPStandardEdit ref="PPStandardEditRef" :data-source="basicData" :mode="basicData.prNo ? 'reapply' : 'edit'" /> -->
      </a-collapse-panel>
      <a-collapse-panel
        header="项目相关附件上传"
        key="7"
        class="m-block"
        :id="'PPAttachmentEdit'"
      >
        <!-- <PPAttachmentEdit ref="PPAttachmentEditRef" :data-source="basicData" :mode="'edit'" /> -->
      </a-collapse-panel>
    </a-collapse>
    <div class="ppproject-footer">
      <a-button
        v-if="basicData.id && !basicData.projectFlowNode"
        ghost
        class="slave"
        type="primary"
        @click="dropStage"
      >
        作废
      </a-button>
      <a-button
        v-if="!basicData.projectFlowNode"
        ghost
        class="slave"
        type="primary"
        @click="saveStage"
      >
        保存草稿
      </a-button>
      <a-button type="primary" @click="emitApply">发起申请</a-button>
    </div>
  </div>
</template>
<script>
import api from '@/api'
// import BaseInfoEdit from './BaseInfoEdit'
// import PPAssessEdit from '../project-purchase/edit-modules/PPAssess'
// import TMAssessEdit from '../project-purchase/edit-modules/TMAssess'
// import PPDeliveriesEdit from '../project-purchase/edit-modules/PPDeliveries'
// import PPStandardEdit from '../project-purchase/edit-modules/PPStandard'
// import PPAttachmentEdit from '../project-purchase/edit-modules/PPAttachment'
// import PPTechStandard from '../project-purchase/edit-modules/PPTechStandard'
import ApprovalNodesMap from '@/components/ApprovalNodesMap'
export default {
  components: {
    // BaseInfoEdit,
    // PPStandardEdit,
    // PPDeliveriesEdit,
    // PPAttachmentEdit,
    // PPTechStandard,
    ApprovalNodesMap
    // PPAssessEdit,
    // TMAssessEdit
  },
  props: {
    recordData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      basicData: {},
      formData: {}
    }
  },
  computed: {
    user () {
      return this.$store.state.global.user
    },
    organizationCode () {
      return this.formData.organizationCode ? this.formData.organizationCode : this.user.apartmentCode
    }
  },
  watch: {
    recordData: {
      async handler (data) {
        if (!data.prNo) return false
        const res = await api.getpoprojectbaseinfoforapply(data)
        if (res.code === 200) {
          this.basicData = { ...data, ...res.data }
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
  methods: {
    baseInfoEditChange (formData) {
      // if (formData.currentCorporationCode) {
      //   this.currentCorporationCode = formData.currentCorporationCode
      // }
      this.formData = formData
    },
    // 获取完整数据
    async getParams () {
      const BaseInfoEditRef = await this.$refs.BaseInfoEditRef
      const PPAssessEditRef = await this.$refs.PPAssessEditRef
      const TMAssessEditRef = await this.$refs.TMAssessEditRef
      const PPTechStandardRef = await this.$refs.PPTechStandardRef
      const PPStandardEditRef = await this.$refs.PPStandardEditRef
      const PPDeliveriesEditRef = await this.$refs.PPDeliveriesEditRef
      const PPAttachmentEditRef = await this.$refs.PPAttachmentEditRef
      const BaseInfoData = BaseInfoEditRef ? await BaseInfoEditRef.getFieldsValue() : {}
      const FPAssessData = PPAssessEditRef ? await PPAssessEditRef.getFieldsValue() : {}
      const TMAssessData = TMAssessEditRef ? await TMAssessEditRef.getFieldsValue() : {}
      const StandardData = PPStandardEditRef ? await PPStandardEditRef.getFieldsValue() : {}
      const TechStandardData = PPTechStandardRef ? await PPTechStandardRef.getFieldsValue() : {}
      const AttachmentData = PPAttachmentEditRef ? await PPAttachmentEditRef.getFieldsValue() : {}
      const DeliveriesData = PPDeliveriesEditRef ? await PPDeliveriesEditRef.getFieldsValue() : {}
      // 需要倒着合并
      return Promise.resolve({ ...AttachmentData, ...StandardData, ...DeliveriesData, ...FPAssessData, ...TMAssessData, ...BaseInfoData, ...TechStandardData })
    },
    // 获取暂存数据
    async getStageParams () {
      const BaseInfoEditRef = await this.$refs.BaseInfoEditRef
      const PPAssessEditRef = await this.$refs.PPAssessEditRef
      const TMAssessEditRef = await this.$refs.TMAssessEditRef
      const PPTechStandardRef = await this.$refs.PPTechStandardRef
      const PPStandardEditRef = await this.$refs.PPStandardEditRef
      const PPDeliveriesEditRef = await this.$refs.PPDeliveriesEditRef
      const PPAttachmentEditRef = await this.$refs.PPAttachmentEditRef
      const BaseInfoData = BaseInfoEditRef ? await BaseInfoEditRef.getStageValue() : {}
      const FPAssessData = PPAssessEditRef ? await PPAssessEditRef.getStageValue() : {}
      const TMAssessData = TMAssessEditRef ? await TMAssessEditRef.getStageValue() : {}
      const StandardData = PPStandardEditRef ? await PPStandardEditRef.getStageValue() : {}
      const TechStandardData = PPTechStandardRef ? await PPTechStandardRef.getStageValue() : {}
      const AttachmentData = PPAttachmentEditRef ? await PPAttachmentEditRef.getStageValue() : {}
      const DeliveriesData = PPDeliveriesEditRef ? await PPDeliveriesEditRef.getStageValue() : {}
      // 需要倒着合并
      return Promise.resolve({ ...AttachmentData, ...StandardData, ...DeliveriesData, ...FPAssessData, ...TMAssessData, ...BaseInfoData, ...TechStandardData })
    },
    dropStage () {
      this.$confirm({
        title: '是否作废？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const res = await api.postpoprojectdeleteProjectInfoDraft([this.basicData.id])
          if (res.code === 200) {
            this.$message.success('操作成功！')
            return this.$emit('close')
          } else {
            return this.$modal.warning({
              title: '提示',
              content: res.message
            })
          }
        }
      })
    },
    async saveStage () {
      const params = await this.getStageParams()
      if (!params.organizationCode) {
        return this.$modal.warning({
          title: '提示',
          content: '请确认“项目所属组织”！'
        })
      }
      const res = await api.postpoprojectsaveProjectInfoDraft({
        ...params,
        id: this.basicData.id
      })
      if (res.code === 200) {
        this.basicData.id = res.data
        this.$message.success('保存成功！')
        return this.$emit('close')
      } else {
        return this.$modal.warning({
          title: '提示',
          content: res.message
        })
      }
    },
    async emitApply () {
      const params = await this.getParams()
      if (params.type === 'error') {
        this.scrollTo(params.id)
        return this.$modal.warning({
          title: '提示',
          content: params.message
        })
      }
      // 立项驳回状态，就发起审批接口，否则，发起申请接口
      if (this.basicData.projectFlowNode === 'start') {
        this.startApprove({
          ...params,
          id: this.basicData.id,
          instanceId: this.basicData.projectFlowInstanceId,
          approvalResult: '1',
          approvalContent: '重新立项'
        })
      } else {
        this.startApply({
          ...params,
          id: this.basicData.id
        })
      }
    },
    // 发起申请
    async startApply (params) {
      const res = await api.savePPProjectApply(params)
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
    // 重新发起审批
    async startApprove (params) {
      let res = await api.ppprojectapproval(params)
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
    scrollTo (id) {
      const targetDom = document.querySelector('#' + id)
      if (!targetDom) return false
      targetDom.style.borderColor = '#ff0000'
      targetDom.style.transition = 'border 3s'
      setTimeout(() => {
        targetDom.style.borderColor = '#d9d9d9'
      }, 3000)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = '#' + id
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>
<style lang="less" scoped>
.ppproject-footer {
  text-align: center;
  margin: 2rem 0;
  button {
    width: 16rem;height:2.6rem;margin: 0 0.3rem;
  }
  .slave {
    width: 6rem;
  }
}
/deep/.ant-row {
  line-height: 2.5;
}
</style>
