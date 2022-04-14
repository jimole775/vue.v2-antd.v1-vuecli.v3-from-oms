<template>
  <div class="moveBox">
    <STabs :ref="'STabsRef'" :tab-proxy="tabProxy" />
    <div v-show="tabProxy.showList">
      <template v-for="panel in listPanels">
        <ProjectList
          v-show="panel.tabId === tabProxy.activeId"
          :key="panel.tabId"
          :apimap="panel.apimap"
          :list="panel.list"
          :ref="'ProjectList' + panel.tabId"
          :transfer-searchor="transferSearchor"
          :stable-row-key="stableRowKey"
          :apply-anchor-text="applyAnchorText"
          :bridge="bridge"
          :tab-proxy="tabProxy"
          :before-render="beforeRender"
          :before-submit="beforeSubmit"
          @addDetailTab="addDetailTab"
        />
      </template>
    </div>
    <div v-show="tabProxy.showApply">
      <template v-for="panel in applyPanels">
        <ProjectApply
          v-show="panel.tabId === tabProxy.activeId"
          :key="panel.tabId"
          :apimap="panel.apimap"
          :apply="panel.apply"
          :ref="'ProjectApply' + panel.tabId"
          :bridge="bridge"
          :tab-proxy="tabProxy"
          :before-render="beforeRender"
          :before-submit="beforeSubmit"
          @close="removePane()"
        />
      </template>
    </div>
    <div v-show="tabProxy.showDetail">
      <template v-for="panel in approvalPanels">
        <ProjectApproval
          v-show="panel.tabId === tabProxy.activeId"
          :key="panel.tabId"
          :apimap="panel.apimap"
          :approval="panel.approval"
          :ref="'ProjectApproval' + panel.tabId"
          :bridge="bridge"
          :tab-proxy="tabProxy"
          :before-render="beforeRender"
          :before-submit="beforeSubmit"
          @close="removePane()"
        />
      </template>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import base from '@/mixins/base'
import todo from '@/mixins/todo'
import ProjectList from './list'
import ProjectApply from './apply'
import ProjectApproval from './approval'
export default {
  name: 'SApprovallor',
  components: {
    ProjectList,
    ProjectApply,
    ProjectApproval
  },
  mixins: [base, todo],
  props: {
    applyAnchorText: {
      type: String,
      default: '创建'
    },
    stableRowKey: {
      type: String,
      default: 'id'
    },
    list: {
      type: Object,
      default: () => ({})
    },
    apimap: {
      type: Object,
      default: () => ({})
    },
    apply: {
      type: Object,
      default: () => ({})
    },
    approval: {
      type: Object,
      default: () => ({})
    },
    tabs: {
      type: Array,
      default: () => ([])
    },
    beforeRender: {
      type: Function,
      default: p => p
    },
    afterRender: {
      type: Function,
      default: p => p
    },
    beforeSubmit: {
      type: Function,
      default: p => p
    },
    afterSubmit: {
      type: Function,
      default: p => p
    },
    bridge: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      tabProxy: {
        tabs: utils.clone(this.tabs),
        showList: true,
        showApply: false,
        showDetail: false,
        activeId: '0',
        lastListId: '0'
      },
      listPanels: []
    }
  },
  computed: {
    applyPanels () {
      return this.tabProxy.tabs.filter((tab) => {
        const live = /\d_1_.+/.test(tab.tabId)
        if (live) {
          tab.apimap = utils.clone(this.activeApimap)
          tab.apply = utils.clone(this.activeApply)
        }
        return live
      })
    },
    approvalPanels () {
      return this.tabProxy.tabs.filter((tab) => {
        const live = /\d_2_.+/.test(tab.tabId)
        if (live) {
          tab.apimap = utils.clone(this.activeApimap)
          tab.approval = utils.clone(this.activeApproval)
        }
        return live
      })
    },
    activeApply () {
      return this.apply[this.tabProxy.lastListId]
    },
    activeApproval () {
      return this.approval[this.tabProxy.lastListId]
    },
    activeApimap () {
      return this.apimap[this.tabProxy.lastListId]
    }
  },
  mounted () {
    // this.listPanels 不能用 computed 构造
    // 否则在切换tab的时候，会有性能问题
    // 原因是 STable 比较臃肿，不便于频繁刷新
    this.listPanels = this.tabProxy.tabs.filter((tab) => {
      const live = tab.type === 'list'
      const list = this.list[tab.tabId] || {}
      const apimap = this.apimap[tab.tabId] || {}
      if (live && list) {
        tab.list = utils.clone(list)
        tab.apimap = utils.clone(apimap)
      }
      return live
    })
  },
  methods: {
    async addDetailTab (typeId, recordData) {
      await this.$refs.STabsRef
      this.$refs.STabsRef.addDetailTab(typeId, recordData)
    },
    async removePane () {
      await this.$refs.STabsRef
      this.$refs.STabsRef.removePane(this.tabProxy.activeId)
      this.reload()
    },
    async reload () {
      const refName = 'ProjectList' + this.tabProxy.activeId
      const refs = this.$refs[refName] ? this.$refs[refName] : []
      const tar = refs[0] ? refs[0] : {}
      tar.reload && tar.reload()
    }
  }
}
</script>
