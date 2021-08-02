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
        case 'key_events_flow': // 关键事件
          this._saveTodoParams(1, item)
          this.$router.push({ path: '/key-events' })
          break
      }
    },
    // 根据每个具体审批模块的【基础信息】接口来获取id号
    // ID号主要用来查询操作日志
    _loadIdByBaseInfo (item) {
      const businessApiMap = {}
      businessApiMap['work_rule_flow'] = api.getworkRuleFlowdetail
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
