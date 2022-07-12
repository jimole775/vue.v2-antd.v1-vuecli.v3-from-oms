<template>
  <div class="moveBox">
    <STabs :ref="'STabsRef'" :tab-proxy="tabProxy" />
    <div v-show="tabProxy.showList">
      <template v-for="tab in listTabs">
        <ProjectList
          v-show="tab.tabId === tabProxy.activeId"
          :key="tab.tabId"
          :list="tab.list"
          :apimap="tab.apimap"
          :ref="'ProjectList' + tab.tabId"
          :transfer-searchor="transferSearchor"
          :bridge="bridge"
          :tab-proxy="tabProxy"
          :before-render="beforeRender"
          :before-submit="beforeSubmit"
          @addDetailTab="addDetailTab"
        />
      </template>
    </div>
    <div v-show="tabProxy.showApply">
      <template v-for="tab in applyTabs">
        <ProjectApply
          v-show="tab.tabId === tabProxy.activeId"
          :key="tab.tabId"
          :apply="tab.apply"
          :apimap="tab.apimap"
          :ref="'ProjectApply' + tab.tabId"
          :bridge="bridge"
          :tab-proxy="tabProxy"
          :before-render="beforeRender"
          :before-submit="beforeSubmit"
          @close="removeTab()"
        />
      </template>
    </div>
    <div v-show="tabProxy.showDetail">
      <template v-for="tab in approvalTabs">
        <ProjectApproval
          v-show="tab.tabId === tabProxy.activeId"
          :key="tab.tabId"
          :apimap="tab.apimap"
          :approval="tab.approval"
          :ref="'ProjectApproval' + tab.tabId"
          :bridge="bridge"
          :tab-proxy="tabProxy"
          :before-render="beforeRender"
          :before-submit="beforeSubmit"
          @close="removeTab()"
        />
      </template>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import baseMixins from '@/mixins/baseMixins'
import todoMixins from '@/mixins/todoMixins'
import ProjectList from './list'
import ProjectApply from './apply'
import ProjectApproval from './approval'
import STabs from '@/components/STabs'
const applyNode = 'apply'
export default {
  name: 'SApprovallor',
  components: {
    STabs,
    ProjectList,
    ProjectApply,
    ProjectApproval
  },
  mixins: [baseMixins, todoMixins],
  props: {
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
      listTabs: []
    }
  },
  computed: {
    applyTabs () {
      return this.tabProxy.tabs.filter((tab) => {
        const live = /\d_1_.+/.test(tab.tabId)
        if (live) {
          tab.apimap = utils.clone(this.activeApimap)
          tab.apply = utils.clone(this.activeApply)
        }
        return live
      })
    },
    approvalTabs () {
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
      const activeApproval = this.approval[this.tabProxy.lastListId]
      const panels = activeApproval.panels || []
      const res = panels.filter(panel => {
        return this.isInEditNode(panel) || this.isShowByNode(panel)
      })
      return { panels: res }
    },
    activeApproval () {
      return this.approval[this.tabProxy.lastListId]
    },
    activeApimap () {
      return this.apimap[this.tabProxy.lastListId]
    }
  },
  mounted () {
    // this.listTabs 不能用 computed 构造
    // 否则在切换tab的时候，会有性能问题
    // 原因是 STable 比较臃肿，不便于频繁刷新
    this.listTabs = this.tabProxy.tabs.filter((tab) => {
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
    isInEditNode (item) {
      return !!(item.editOnNodes && item.editOnNodes.includes(applyNode))
    },
    isShowByNode (item) {
      return !!(item.showOnNodes && item.showOnNodes.includes(applyNode))
    },
    async addDetailTab (typeId, recordData) {
      await this.$refs.STabsRef
      this.$refs.STabsRef.addDetailTab(typeId, recordData)
    },
    async removeTab () {
      await this.$refs.STabsRef
      this.$refs.STabsRef.removeTab(this.tabProxy.activeId)
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
