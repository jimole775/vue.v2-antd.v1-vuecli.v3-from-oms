<template>
  <div>
    <a @click="openDemand" style="text-decoration: underline;">{{ demandNo }}</a>
    <a-modal
      v-model="visible"
      v-if="visible"
      :mask-closable="false"
      :title="'需求信息'"
      width="1100px"
    >
      <template slot="footer">
        <a-button
          type="primary"
          @click="handleOk"
        >
          关闭
        </a-button>
      </template>
      <a-form :form="form">
        <a-row>
          <a-col :span="8">
            <a-form-item :label="'需求编号'" :label-col="{span: 9}" :wrapper-col="{span: 15}">
              <p>{{ demandList.no || "" }}</p>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="'需求名称'" :label-col="{span: 9}" :wrapper-col="{span: 15}">
              <p>{{ demandList.name || '' }}</p>
            </a-form-item>
          </a-col>
          <a-col v-if="!isSupplier" :span="8">
            <a-form-item :label="'申请人'" :label-col="{span: 9}" :wrapper-col="{span: 15}">
              <p>{{ demandList.applyPersonAccount }} {{ demandList.applyPersonName }}</p>
            </a-form-item>
          </a-col>
          <a-col v-if="!isSupplier" :span="8">
            <a-form-item :label="'直接上级'" :label-col="{span: 9}" :wrapper-col="{span: 15}">
              <p>{{ demandList.directLeaderAccount }} {{ demandList.directLeaderName }}</p>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="'部门'" :label-col="{span: 9}" :wrapper-col="{span: 15}">
              <p>{{ demandList.applyDeptName }}</p>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <div v-for="(workPlaceItem, index) in demandList.workPlaceList" :key="index">
            <a-col :span="8">
              <a-form-item
                :label="'城市'"
                :label-col="{span: 9}"
                :wrapper-col="{span: 15}"
              >
                <span class="ant-form-text">{{ workPlaceItem.region||'' }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                :label="'工作地点'"
                :label-col="{span: 9}"
                :wrapper-col="{span: 15}"
              >
                <span class="ant-form-text">{{ workPlaceItem.workPlace||'' }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                :label-col="{span: 9}"
                :wrapper-col="{span: 15}"
              >
                <span slot="label">
                  交付形式&nbsp;
                  <a-tooltip>
                    <span slot="title"><span>在岸：与内部人员在我方场地服务</span><br><span>近岸：在我方黄区服务</span><br><span>离岸：在供应商黄区服务</span></span>
                    <a-icon type="question-circle-o" />
                  </a-tooltip>
                </span>
                <span class="ant-form-text">{{ workPlaceItem.deliveryType||'' }}</span>
              </a-form-item>
            </a-col>
          </div>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item :label="'期望到岗日期'" :label-col="{span: 9}" :wrapper-col="{span: 15}">
              <p>{{ formatDate(demandList.reportDate) || '&nbsp;' }}</p>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="'需求数量'" :label-col="{span: 9}" :wrapper-col="{span: 15}">
              <p>{{ demandList.applyCount }}</p>
            </a-form-item>
          </a-col>
          <a-col v-if="!isSupplier" :span="24">
            <a-form-item :label="'申请原因'" :label-col="{span: 3}" :wrapper-col="{span: 21}">
              <p>{{ demandList.applyReason }}</p>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="'岗位类型'" :label-col="{span: 9}" :wrapper-col="{span: 15}">
              <p>{{ demandList.postList && demandList.postList[0]?demandList.postList[0].postCategory:'' }}</p>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="'岗位职务'" :label-col="{span: 9}" :wrapper-col="{span: 15}">
              <p>{{ demandList.postList && demandList.postList[0]?demandList.postList[0].postDuties:'' }}</p>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="'技术领域'" :label-col="{span: 9}" :wrapper-col="{span: 15}">
              <p>{{ demandList.postList && demandList.postList[0]?demandList.postList[0].techDomain:'' }}</p>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="'学历要求'" :label-col="{span: 9}" :wrapper-col="{span: 15}">
              <p>{{ demandList.postList && demandList.postList[0].education }}</p>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label-col="{span: 9}" :wrapper-col="{span: 15}">
              <span slot="label">
                领域经验
                <a-tooltip title="指人员在该领域中的工作经验年限">
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </span>
              <p>{{ demandList.postList && demandList.postList[0] ? demandList.postList[0].workYears :'' }} 年</p>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="'职级分布'" :label-col="{span: 9}" :wrapper-col="{span: 15}">
              <p v-if="demandList.postList&&demandList.postList[0]">
                <span v-for="item in demandList.postList[0].postRankList" :key="item.id"> {{ item.rankName }} {{ item.applyTotal + '人' }}</span>
              </p>
            </a-form-item>
          </a-col>
          <a-col v-if="!isSupplier" :span="24">
            <a-form-item :label="'面试官'" :label-col="{span: 3}" :wrapper-col="{span: 21}">
              <p v-if="demandList.postList&&demandList.postList[0]">
                <span>{{ formatInterviewer(demandList.postList[0].interviewerAccount,demandList.postList[0].interviewerName) }}</span>
              </p>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="'岗位要求'" :label-col="{span: 3}" :wrapper-col="{span: 21}">
              <p>{{ demandList.postList && demandList.postList[0]?demandList.postList[0].postDescription:'' }}</p>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="'岗位职责'" :label-col="{span: 3}" :wrapper-col="{span: 21}">
              <p>{{ demandList.postList && demandList.postList[0]?demandList.postList[0].jobDescription:'' }}</p>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
export default {
  name: 'InterviewsDemand',
  props: {
    demandNo: {
      type: String,
      default: ''
    },
    isSupplier: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false,
      form: this.$form.createForm(this),
      demandList: []
    }
  },
  watch: {
    visible (newVal, oldVal) {
      if (newVal) {
        this.requestData()
      }
    }
  },
  methods: {
    requestData () {
      api.demandDetail(this.demandNo).then(res => {
        if (res.code === 200) {
          this.demandList = res.data
        }
      })
    },
    openDemand () {
      this.visible = true
    },
    formatDate (date) {
      return utils.strToDate(date)
    },

    formatInterviewer (code, name) {
      let showMsg = utils.parseUser(code, name).map(item => {
        return item.label
      }).join(',')
      return showMsg
    },
    handleOk () {
      this.visible = false
    },
    // 获取数据字典项的名称
    formatWorkYears (years) {
      const res = this.$store.getters.getWorkYearsName(years)
      return res[0] ? res[0].itemName : ''
    },
    cancel () {
      this.visible = false
    }
  }
}
</script>
