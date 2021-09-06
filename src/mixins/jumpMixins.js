/**
 * 主要处理主页到某个业务模块的跳转逻辑
 * 包括其他系统跳到某个业务模块的需求
 */
import api from '@/api'
import router from '@/router'
import { mapActions } from 'vuex'
export default {
  data () {
    const allRoutes = router.matcher.getRoutes()
    const directRoutes = allRoutes.filter((r) => r.meta && r.meta.directConnection)
    const directRouteMap = routes2map(directRoutes)
    return {
      directRouteMap
    }
  },
  computed: {
    user () {
      return this.$store.state.global.user
    },
    userRole () {
      return this.$store.state.global.userRole
    }
  },
  methods: {
    ...mapActions(['loadTodoParams']),
    /**
   * 通用跳转方法
   * @param {Object} item
   * @template mixin_jumping({
   *  【必填】__key__: 'RECRUITION', # 业务类型
   *  【可选】__id__: 1004, # 流程id 注意区分【流程实例id】
   *  【可选】__tabType__: 'list'|'detail', # 对应《STabs.vue》的tab类型
   *  【可选】__tabIndex__: '0', # 对应《STabs.vue》的tab下标
   *  【可选】__todoType__: 'apply'|'approval', # 对应《主页待办》的 “我的申请” 或 “我的审批”
   *  【可选】__params__: {}
   * })
   */
    async mixin_jumping (item) {
      item = this._depolyCommonProperty(item)

      // 转成小写，方便阅读
      const category = (item.__key__ || '').trim().toLocaleLowerCase()

      // 【流程实例id】，主要用来查询审批日志的
      if (!item.id) {
        const apiName = this.directRouteMap[category].idFrom
        item.id = await this._loadIdByApi(item, apiName)
      }

      this._dispatchTodoParams(category, item)
      this._matchRouterPath(category, item)
    },
    // 配置公共属性
    _depolyCommonProperty (item) {
      // taskType:是待办列表的一个属性值，用作跳到列表页的判断
      // businessCategory:是当条待办的一个属性值，用作跳到详情页的判断
      item.__key__ = item.__key__ || item.taskType || item.businessCategory

      // tab类型 => "list": 列表页，"detail": 详情页
      // 默认为 详情页，当前mo跳转过来的，都是 detail 类型
      item.__tabType__ = item.__tabType__ || 'detail'

      // 待办类型 => "apply": 我的申请，"approve": 我的审批，主要是为了区分查询字段的默认赋值“申请人”，“当前处理人”
      item.__todoType__ = item.__todoType__ || 'approve'

      // 默认拼装登陆人
      item.handler = spillUserSelectValue(this.user)

      // 默认参数
      item.prNo = item.prNo || item.title
      item.flowNo = item.flowNo || item.title
      item.flowNode = item.flowNode || item.statusCode
      item.instanceId = item.instanceId || item.businessId || item.__id__
      item.flowInstanceId = item.flowInstanceId || item.businessId || item.__id__
      item.projectFlowInstanceId = item.projectFlowInstanceId || item.businessId || item.__id__
      item.purchaseFlowInstanceId = item.purchaseFlowInstanceId || item.businessId || item.__id__
      return item
    },
    // 匹配路由，并进行跳转
    _matchRouterPath (category, item) {
    const params = this.directRouteMap[category]
    this.$router.push({
      path: params.path,
      query: {
        ...params,
        path: undefined // 清掉path字段，避免转译问题
      }
    })
    },
    // 保存跳转参数到全局
    // businessType：0：保存到 localStorage
    // businessType：1：保存到 Vuex
    _dispatchTodoParams (category, item) {
      const params = this.directRouteMap[category]
      const businessType = params.businessType
      // 旧业务类型
      if (businessType === 0) {
        if (item.__tabType__ === 'list') {
          localStorage.setItem('fromHomeTodoCount', JSON.stringify({ ...params, ...item }))
        }
        if (item.__tabType__ === 'detail') {
          localStorage.setItem('fromHomeTodoDetail', JSON.stringify({ ...params, ...item }))
        }
      }
      // 新业务类型
      if (businessType === 1) {
        this.loadTodoParams({ ...params, ...item })
      }
    },
    // 根据每个具体审批模块的【基础信息】接口来获取id号
    // ID号主要用来查询操作日志
    _loadIdByApi (item, apiName) {
      return new Promise(async (resolve) => {
        if (apiName) {
          const res = await api[apiName](item)
          if (res.code === 200 && res.data) {
            resolve(res.data.id)
          } else {
            resolve('')
            throw new Error('操作日志获取流程id失败！')
          }
        } else {
          resolve('')
          if (item.__todoType__ === 'detail') {
            throw new Error('操作日志丢失流程id查询接口，请完善businessApiMap！')
          }
        }
      })
    }
  }
}

/**
 * 把 routes 数组转成 map, 方面调用
 * @param {Array} routes
 * @returns {Object}
 */
function routes2map (routes) {
  const map = Object.create(null)
  routes.forEach(r => {
    const path = r.path
    const tagsMap = r.meta.directConnection
    Object.keys(tagsMap).forEach(tag => {
      map[tag] = {
        path,
        ...tagsMap[tag]
      }
    })
  })
  return map
}


// 主要用于给搜索栏【申请人】【当前处理人】赋默认值
function spillUserSelectValue (user) {
  const res = {}
  res.key = JSON.stringify({ key: user && user.employeeNumber, label: user && user.name })
  res.label = user && user.name
  return [res]
}
