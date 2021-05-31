/**
 * 主要处理主页到某个业务模块的跳转逻辑
 * 包括其他系统跳到某个业务模块的需求
 */
import api from '@/api'
import { mapActions } from 'vuex'

export default {
  data () {
    return {}
  },
  computed: {
    user () {
      return this.$store.state.global.user
    },
    userRole () {
      return this.$store.state.global.userRole
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions(['loadTodoParams']),
    async mixin_jumping (item, page, type) {
      item = this._depolyCommonProperty(item)
      item.__page__ = page
      item.__type__ = type
      item.handler = this._spillUserSelectValue()
      // 如果没有id项，就通过每个模块的详情接口去获取
      if (!item.id) {
        item.id = await this._loadIdByBaseInfo(item)
      }
      // taskType:是待办列表的一个属性值，用作跳到列表页的判断
      // businessCategory:是当条待办的一个属性值，用作跳到详情页的判断
      this._matchRouterPath(item.taskType ? item.taskType : item.businessCategory, item)
    },
    _depolyCommonProperty (item) {
      item.prNo = item.title
      item.flowNo = item.title
      item.flowNode = item.statusCode
      item.instanceId = item.businessId
      item.flowInstanceId = item.businessId
      item.projectFlowInstanceId = item.businessId
      item.purchaseFlowInstanceId = item.businessId
      return item
    },
    _saveTodoParams (mode, item) {
      if (mode === 0) {
        if (item.__page__ === 'list') {
          localStorage.setItem('fromHomeTodoCount', JSON.stringify(item))
        }
        if (item.__page__ === 'detail') {
          localStorage.setItem('fromHomeTodoDetail', JSON.stringify(item))
        }
      }
      if (mode === 1) {
        this.loadTodoParams(item)
      }
    },
    _matchRouterPath (routerCategory, item) {
      const pureRouterCategory = routerCategory || ''
      switch (pureRouterCategory.trim().toLocaleLowerCase()) {
        case 'recruition':
          this._saveTodoParams(0, item)
          this.$router.push({ path: '/demands_and_interviews/interviews' })
          break
        case 'postapplyprocess':
        case 'requirement_restart_flow':
          this._saveTodoParams(0, item)
          this.$router.push({ path: '/demands_and_interviews/demands' })
          break
        case 'leave_flow': // 跳转离场管理审批
          this._saveTodoParams(0, item)
          this.$router.push({ path: '/resource-pool/exit-manager' })
          break
        case 'adjust_organization': // 跳转组织调动审批
          this._saveTodoParams(0, item)
          this.$router.push({
            path: '/resource-pool/move-organization',
            query: {
              __tab__: 'ADJUST_ORGANIZATION'
            }
          })
          break
        case 'info_change': // 跳人员信息管理
          this._saveTodoParams(0, item)
          this.$router.push({
            path: '/resource-pool/move-organization',
            query: {
              __tab__: 'INFO_CHANGE'
            }
          })
          break
        case 'man_hour_renewal': // 跳转工时补签列表页
          this._saveTodoParams(0, item)
          this.$router.push({ path: '/work_schedule/sign' })
          break
        case 'vacation_flow':
          this._saveTodoParams(0, item)
          this.$router.push({ path: '/work_schedule/leave' })
          break
        case 'overtime_flow':
          this._saveTodoParams(0, item)
          this.$router.push({ path: '/overtime' })
          break
        case 'sign_flow':
          this._saveTodoParams(0, item)
          this.$router.push({ path: '/work_schedule/sign' })
          break
        case 'data_modification':
          this._saveTodoParams(0, item)
          this.$router.push({ path: '/data_modification' })
          break
        case 'awf_business_travel': // 跳转出差流程
          this._saveTodoParams(0, item)
          this.$router.push({ path: '/businessTravel' })
          break
        case 'reimbursement': // 跳转报销流程
          this._saveTodoParams(0, item)
          this.$router.push({ path: '/claim' })
          break
        case 'settlement': // 跳费用结算
          this._saveTodoParams(0, item)
          this.$router.push({ path: '/settlement/payment' })
          break
        case 'schedule_rule_flow': // 跳转排班管理
          this._saveTodoParams(0, item)
          this.$router.push({ path: '/scheduleRule' })
          break
        case 'create_project_flow': // 立项流程
        case 'tm_create_project_flow': // 立项流程
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/pp-project/apply' })
          break
        case 'project_purchase_flow': // 项目采购-fp
        case 'tm_project_purchase_flow': // 项目采购-tmp
        case 'inherit_project_purchase_flow': // 项目采购-继承
        case 'inherit_tm_project_purchase_flow': // 项目采购-继承-tmp
          this._saveTodoParams(1, item)
          // 需要判断是供应商还是CEG
          if (this.userRole.type === 'SUPPLIER') {
            this.$router.push({ path: '/pp-project/purchase-supplier' })
          } else {
            this.$router.push({ path: '/pp-project/purchase' })
          }
          break
        case 'fp_admission_flow': // FP入场流程
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/recruit_enter/enter' })
          break
        case 'project_transfer': // 项目调动
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/member/transfer' })
          break
        case 'project_requirement_modify_flow': // 项目需求变更流程
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/project/requirement-modify' })
          break
        case 'project_advance_end_flow': // 项目提前终止流程
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/project/abort' })
          break
        case 'po_leave_flow': // 离场流程
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/member/departure' })
          break
        case 'odc_requirement_apply_flow': // odc需求申请
        case 'odc_change_apply_flow': // odc变更申请
          const tabMap = {
            odc_requirement_apply_flow: '0',
            odc_change_apply_flow: '3'
          }
          item.__tab__ = tabMap[routerCategory]
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/data_odc_manage' })
          break
        case 'work_rule_flow': // 工时规则
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/worke_rule_flow' })
          break
        case 'exception_res_level_adjust': // 例外调级申请
        case 'routine_res_level_adjust': // 例行调级申请
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/resource-pool/level-adjust' })
          break
        case 'project_acceptance_flow': // 项目验收流程
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/project/stage-acceptance' })
          break
        case 'outer_change_inner': // 转内流程
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/resource-pool/inner-recruit' })
          break
        case 'data_modify_interview_post_level': // 数据变更（新）-定级变更
        case 'data_modify_attendance_exception': // 数据变更（新）-异常考勤
        case 'data_modify_requirement_info': // 数据变更（新）-需求内容修改
        case 'data_modify_other_info': // 数据变更（新）-其他内容修改
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/new_data_modification' })
          break
        case 'key_events_flow': // 关键事件（新）
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/key-events' })
          break
        case 'adviser_entry_flow': // 顾问流程 详情
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/adviser-manage/entry' })
          break
        case 'adviser_leave_flow': // 顾问离场 详情
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/adviser-manage/leave' })
          break
      }
    },
    // 根据每个具体审批模块的【基础信息】接口来获取id号
    // ID号主要用来查询操作日志
    _loadIdByBaseInfo (item) {
      const businessApiMap = {}
      businessApiMap['work_rule_flow'] = api.getworkRuleFlowdetail // 工时规则
      businessApiMap['create_project_flow'] = api.getPPProjectBaseinfo // 立项流程-fp
      businessApiMap['tm_create_project_flow'] = api.getPPProjectBaseinfo // 立项流程-tmp
      businessApiMap['inherit_project_purchase_flow'] = api.getPPProjectBaseinfo // 项目采购-继承-fp
      businessApiMap['inherit_tm_project_purchase_flow'] = api.getPPProjectBaseinfo // 项目采购-继承-tmp
      businessApiMap['project_purchase_flow'] = api.getPPProjectBaseinfo // 项目采购-fp
      businessApiMap['tm_project_purchase_flow'] = api.getPPProjectBaseinfo // 项目采购-tmp
      businessApiMap['project_requirement_modify_flow'] = api.postpoprojectrequirementmodifydetail // 项目需求变更流程
      businessApiMap['project_advance_end_flow'] = api.getpoprojectabortdetail // 项目提前终止流程
      businessApiMap['exception_res_level_adjust'] = api.getresleveladjustflowNo // 例外调级申请
      businessApiMap['routine_res_level_adjust'] = api.getresleveladjustflowNo // 例行调级申请
      businessApiMap['fp_admission_flow'] = api.getpoenterdetail // FP入场流程
      businessApiMap['project_transfer'] = api.getppprojecttransferdetail // 项目调动
      businessApiMap['odc_requirement_apply_flow'] = api.getodcrequirementdetail // odc需求申请
      businessApiMap['odc_change_apply_flow'] = api.getodcchangeapplydetail // odc变更申请
      businessApiMap['po_leave_flow'] = api.getpoleaveflowquerybyid // 离场流程
      businessApiMap['project_acceptance_flow'] = api.getposettlementstagedetail // 验收流程
      businessApiMap['outer_change_inner'] = api.getturninsideflow // 转内流程
      businessApiMap['data_modify_interview_post_level'] = api.getdatamodifydetail // 数据变更（新）-定级变更
      businessApiMap['data_modify_attendance_exception'] = api.getdatamodifydetail // 数据变更（新）-异常考勤
      businessApiMap['data_modify_requirement_info'] = api.getdatamodifydetail // 数据变更（新）-需求内容修改
      businessApiMap['data_modify_other_info'] = api.getdatamodifydetail // 数据变更（新）-其他内容修改
      businessApiMap['key_events_flow'] = api.getkeyeventsdetail // 关键事件（新）
      businessApiMap['adviser_entry_flow'] = api.queryEntryDetail // 入场流程详情
      businessApiMap['adviser_leave_flow'] = api.adviserLeaveDetail // 离场流程详情
      return new Promise(async (resolve) => {
        if (businessApiMap[item.businessCategory]) {
          const res = await businessApiMap[item.businessCategory](item)
          if (res.code === 200 && res.data) {
            resolve(res.data.id)
          } else {
            resolve('')
            throw new Error('操作日志获取流程id失败！')
          }
        } else {
          resolve('')
          if (item.__type__ === 'detail') {
            throw new Error('操作日志丢失流程id查询接口，请完善businessApiMap！')
          }
        }
      })
    },
    // 主要用于给搜索栏【申请人】【当前处理人】赋默认值
    _spillUserSelectValue () {
      const res = {}
      res.key = JSON.stringify({ key: this.user && this.user.employeeNumber, label: this.user && this.user.name })
      res.label = this.user && this.user.name
      return [res]
    }
  }
}
