<script>
import utils from '@/utils'
import baseMixins from '@/mixins/baseMixins'
const panelmodel = {
  tabName: '',
  proxyName: null,
  type: 'apply', // 'list' 'apply' 'detail'
  tabId: '1_1',
  closable: true,
  show: true,
  visible: true,
  lastListId: '',
  routeQuery: {}
}
export default {
  title: '页签',
  name: 'STabs',
  props: {
    value: {
      type: Object,
      default: undefined
    }
  },
  mixins: [baseMixins],
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      tabHandler: {
        tabs: [],
        $showList: false,
        $showApply: false,
        $showDetail: false,
        $activeId: '0',
        $lastListId: '',
        $routeQuery: {},
        $switchTab: () => {},
        $reduceTab: () => {},
        $increaseTab: () => {}
      },
      // 用来存储点击过的【list类型】的tabid
      // 用push的方式来存储，取的时候，永远取最后一个
      // 主要的作用就是在用户关闭可编辑的tab时，可回溯到最后一个被浏览的list
      usedListIds: [],
      cachePanesLen: null
    }
  },
  computed: {
    // 主要渲染对象
    tabsView () {
      return this.tabProxy.tabs.filter(tab => tab.show)
    }
  },
  watch: {
    'value': {
      handler (val) {
        this.tabHandler.tabs = utils.clone(val.tabs || []).map((tab, index) => {
          tab.show = utils.isValuable(tab.show) ? tab.show : tabItemModel.show
          tab.type = utils.isValuable(tab.type) ? tab.type : 'list'
          tab.tabName = utils.isValuable(tab.tabName) ? tab.tabName : tabItemModel.tabName
          tab.proxyName = utils.isValuable(tab.proxyName) ? tab.proxyName : tabItemModel.proxyName
          tab.tabId = utils.isValuable(tab.tabId) ? tab.tabId : index + ''
          tab.closable = utils.isValuable(tab.closable) ? tab.closable : false
          tab.lastListId = utils.isValuable(tab.lastListId) ? tab.lastListId : ''
          tab.routeQuery = utils.isValuable(tab.routeQuery) ? tab.routeQuery : {}
          return tab
        })
        this.tabHandler?.$showList = val.showList || true
        this.tabHandler?.$showApply = val.showApply || false
        this.tabHandler?.$showDetail = val.showDetail || false
        this.tabHandler?.$activeId = val.activeId || '0'
        this.tabHandler?.$lastListId = val.lastListId || ''
        this.tabHandler?.$routeQuery = val.routeQuery || undefined
        this.tabHandler?.$switchTab = this.$switchTab
        this.tabHandler?.$reduceTab = this.$reduceTab
        this.tabHandler?.$increaseTab = this.$increaseTab
      },
      immediate: true
    },
    'tabProxy.activeId': {
      handler (tabId) {
        if (tabId) {
          const curPanel = this.getPanelFromTabId(tabId)
          // 如果目标pane时【detail】类型，就需要关联跳转前的【list】的tabid
          // 主要为了防止detail页内用lastListId查询数据时的报错
          if (curPanel.type === 'apply') {
            curPanel.__apply_listTabId__ = this.tabProxy.lastListId
          }
          if (curPanel.type === 'detail') {
            curPanel.__detail_listTabId__ = this.tabProxy.lastListId
          }
          this.$switchTab(tabId)
          this.showPanel(tabId)
          this.$emit('change', this.tabHandler)
        }
      },
      immediate: true
    },
    'tabProxy.lastListId': {
      handler (tabId) {
        if (tabId) {
          this.setLastListTabId(tabId)
          this.$emit('update', this.tabHandler)
        }
      }
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    async initialize () {
      // 直接show activeId
      // 根据权限列表裁剪有效的panes
      this.queryPermissionTabs()
      return Promise.resolve()
    },
    queryPermissionTabs () {
      const tabs = this.tabProxy.tabs || []
      const menuButtons = this.$store.state.global.menuButtons || []
      this.tabProxy.tabs = tabs.filter(tab => {
        const permission = tab.permission || {}
        // 如果设置了 permission.config，就匹配这个的值
        return permission.config ? menuButtons.includes(permission.config) : [true, undefined].includes(tab.show)
      })

      // 没有权限操作
      if (!this.tabProxy.tabs.length) {
        this.tabProxy.lastListId = this.tabProxy.activeId = null
        return false
      }

      // 把默认的 tab.show 全部设为 true
      this.tabProxy.tabs.forEach(tab => {
        tab.show = true
      })

      // 默认展示第一个 show 为 true 的 tab
      if (this.tabProxy.showList) {
        this.tabProxy.lastListId = this.tabProxy.activeId = this.tabProxy.tabs[0].tabId
      }
    },
    // tab切换事件
    tabChangeEvent (tabId) {
      const curPanel = this.getPanelFromTabId(tabId)
      // curPan.type === undefined 属于向前兼容
      if (curPanel.type === 'list' || curPanel.type === undefined) {
        this.setLastListTabId(tabId)
      }
      // 目标tab如果是detail，
      // 需要保持 lastListId 是 list 类型的 tabId
      // 因为，申请和详情页有时候需要根据 list 的 tabId 去匹配一些数据
      if (curPanel.type === 'apply') {
        this.setLastListTabId(curPanel.__apply_listTabId__)
      }
      if (curPanel.type === 'detail') {
        this.setLastListTabId(curPanel.__detail_listTabId__)
      }
    },
    // 往 this.usedListIds 里塞 tabId
    setLastListTabId (tabId) {
      const curPanel = this.getPanelFromTabId(tabId)
      if (curPanel.type === 'list' || curPanel.type === undefined) {
        this.tabProxy.lastListId = tabId
        if (!this.usedListIds) {
          this.usedListIds = []
        }
        this.usedListIds.push(tabId)
        if (this.usedListIds.length > 99) {
          this.usedListIds.shift()
        }
      }
    },
    // 获取 this.usedListIds 的最后一位
    getLastListTabId () {
      if (!this.usedListIds) {
        this.usedListIds = []
      }
      return this.usedListIds[this.usedListIds.length - 1] || '0'
    },
    // 获取"详情页"，"申请页",这种可点击删除的Panel的id
    getLastEditTabId (listId, panelType) {
      // 如果是第一次新增panel，给与默认tabId
      let res = this.spillTabId(listId, panelType, 0)
      for (let i = this.tabProxy.tabs.length - 1; i > 0; i--) {
        const tab = this.tabProxy.tabs[i]
        if (tab.tabId.length > 1 && this.getpanelTypeFormTabId(tab.tabId) === panelType) {
          res = tab.tabId
          break
        }
      }
      return res
    },
    // tab新增或者删除事件
    tabEditEvent (tabId, action) {
      if (action === 'remove') {
        this.removePane(tabId)
      }
    },
    $switchTab (tabId) {
      // 根据提供的id去获取指定的Panel面板
      const curPanel = this.getPanelFromTabId(tabId)
      // 需要把面板show设置为true
      curPanel.show = true
      this.tabHandler.$routeQuery = curTab.routeQuery
    },
    $increaseTab (panelType, routeQuery) {
      const getTabName = (listPanel) => {
        const defaultsuffix = panelType === 'apply' ? '申请' : '审批'
        const test = {}
        if (listPanel.proxyName) {
          test?.sss = listPanel?.proxyName?.apply
          let applyTabName = listPanel.proxyName.apply
          if (utils.isFunction(applyTabName)) {
            applyTabName = applyTabName(this)
          }
          let detailTabName = listPanel.proxyName.detail
          if (utils.isFunction(detailTabName)) {
            detailTabName = detailTabName(this)
          }
          return panelType === 'apply' ? applyTabName : detailTabName
        } else {
          return listPanel.tabName + defaultsuffix
        }
      }
      const newTab = utils.clone(tabItemModel)
      const listPanel = this.getPanelFromTabId(this.getLastListTabId())
      newTab.type = panelType
      newTab.tabId = this.upRiseTabId(this.getLastEditTabId(listPanel.tabId, panelType))
      newTab.lastListId = listPanel.tabId
      newTab.routeQuery = routeQuery
      this.tabProxy.activeId = newTab.tabId
      this.tabProxy.tabs.push(newTab)
      setTimeout(() => {
        newTab.tabName = getTabName(listPanel)
      })
    },
    $reduceTab (tabId) {
      for (let i = 0; i < this.tabHandler.tabs.length; i++) {
        const tab = this.tabHandler.tabs[i]
        if (tab.tabId === (tabId || this.tabHandler.$activeId)) {
          this.tabHandler.tabs.splice(i, 1)
          break
        }
      }
      this.tabHandler.$activeId = this.getLastEditTabId()
      this.$switchTab(this.tabHandler.$activeId)
    },
    getCurTabFromTabId (tabId) {
      return this.tabProxy.tabs.find(tab => tab.tabId === tabId) || {}
    },
    showPanel (tabId) {
      this.tabHandler.$showList = false
      this.tabHandler.$showApply = false
      this.tabHandler.$showDetail = false
      if (/_/.test(tabId)) {
        if (this.getpanelTypeFormTabId(tabId) === 'apply') {
          this.tabHandler.$showApply = true
        }
        if (this.getpanelTypeFormTabId(tabId) === 'detail') {
          this.tabHandler.$showDetail = true
        }
      } else {
        this.tabHandler.$showList = true
      }
    },
    isUniqueTanpe (routeQuery = {}) {
      let isUnique = true
      for (let index = 0; index < this.tabProxy.tabs.length; index++) {
        const tab = this.tabProxy.tabs[index]
        if (tab.routeQuery && tab.routeQuery.id === routeQuery.id) {
          isUnique = false
          break
        }
      }
      return isUnique
    },
    changeTabByrouteQuery (routeQuery = {}) {
      for (let index = 0; index < this.tabProxy.tabs.length; index++) {
        const tab = this.tabProxy.tabs[index]
        if (tab.routeQuery && tab.routeQuery.id === routeQuery.id) {
          this.tabProxy.activeId = tab.tabId
          break
        }
      }
    },
    // 关闭标签页
    // 两种情景触发当前方法：
    // 1. 当前只有用户点击【x】操作
    // 2. 审批完毕时，this.$emit('removePane')进行调用
    removePane (tabId) {
      for (let i = 0; i < this.tabProxy.tabs.length; i++) {
        const tab = this.tabProxy.tabs[i]
        if (tab.tabId === tabId) {
          this.tabProxy.tabs.splice(i, 1)
          break
        }
      }
      // activeId 切换到最后一个 list
      this.tabProxy.activeId = this.getLastListTabId()
      // 这里手动$switchTab，是为了防止activeId没改变，导致没触发watch方法的情况
      this.$switchTab(this.tabProxy.activeId)
    },
    getPanelFromTabId (tabId) {
      let correctPanel = this.tabProxy.tabs.filter((pan) => pan.tabId === tabId)
      correctPanel = correctPanel && correctPanel.length ? correctPanel[0] : {}
      return correctPanel
    },
    /**
     * 父级html是这样写的:
     * @html # <div v-if="tabProxy.showList">
     * @html #   <List />
     * @html # </div>
     * @html # <div v-if="tabProxy.showApply">
     * @html #   <Apply />
     * @html # </div>
     * @html # <div v-if="tabProxy.showDetail">
     * @html #   <Approval />
     * @html # </div>
     */
    showPanel (tabId) {
      this.tabProxy.showList = false
      this.tabProxy.showApply = false
      this.tabProxy.showDetail = false
      if (/_/.test(tabId)) {
        if (this.getpanelTypeFormTabId(tabId) === '1') {
          this.tabProxy.showApply = true
        }
        if (this.getpanelTypeFormTabId(tabId) === '2') {
          this.tabProxy.showDetail = true
        }
      } else {
        this.tabProxy.showList = true
      }
    },
    // tabid 通过这样的逻辑来创建:
    // 'apply': 0_1_0 [列表下标_类型_自增下标]
    // 'detail': 0_2_0 [列表下标_类型_自增下标]
    upRiseTabId (tabId) {
      const listId = this.getListIdFormTabId(tabId)
      const type = this.getpanelTypeFormTabId(tabId)
      const detailId = this.getDetailIdFormTabId(tabId)
      return this.spillTabId(listId, type, detailId + 1)
    },
    spillTabId (listId = '0', type = '1', detailId = 0) {
      return listId + '_' + type + '_' + detailId
    },
    getListIdFormTabId (tabId) {
      return tabId.split('_')[0]
    },
    getpanelTypeFormTabId (tabId) {
      return tabId.split('_')[1]
    },
    getDetailIdFormTabId (tabId) {
      return Number.parseInt(tabId.split('_')[2])
    }
  },
  render () {
    return (
      <a-tabs
        hide-add
        type="editable-card"
        v-model={ this.tabProxy.activeId }
        onEdit={ this.tabEditEvent }
        onChange={ this.tabChangeEvent }
      >
        {
          this.tabsView && this.tabsView.map((tab) => {
            const nameDom = tab.tabName || tab.customRender && tab.customRender(this.$createElement, tab, this)
            return (
              <a-tab-pane
                key={tab.tabId}
                closable={!!tab.closable}
              >
                <template slot="tab">{ nameDom }</template>
              </a-tab-pane>
            )
          })
        }
      </a-tabs>
    )
  }
}
</script>
