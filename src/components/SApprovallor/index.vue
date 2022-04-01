<template>
  <div class="moveBox">
    <STabs :ref="'STabsRef'" :tab-proxy="tabProxy" />
    <div v-show="tabProxy.showList">
      <template v-for="listPane in listPanes">
        <ProjectList
          v-show="listPane.tabId === tabProxy.activeId"
          :key="listPane.tabId"
          :apimap="listPane.apimap"
          :list-data-dir="listPane.apimap.listDataDir || listDataDir"
          :list-config="listPane.listConfig"
          :ref="'ProjectList' + listPane.tabId"
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
      <template v-for="applyPane in applyPanes">
        <ProjectApply
          v-show="applyPane.tabId === tabProxy.activeId"
          :key="applyPane.tabId"
          :apimap="applyPane.apimap"
          :apply-config="applyPane.applyConfig"
          :ref="'ProjectApply' + applyPane.tabId"
          :bridge="bridge"
          :tab-proxy="tabProxy"
          :before-render="beforeRender"
          :before-submit="beforeSubmit"
          @close="removePane()"
        />
      </template>
    </div>
    <div v-show="tabProxy.showDetail">
      <template v-for="approvalPane in approvalPanes">
        <ProjectApproval
          v-show="approvalPane.tabId === tabProxy.activeId"
          :key="approvalPane.tabId"
          :apimap="approvalPane.apimap"
          :approval-config="approvalPane.approvalConfig"
          :ref="'ProjectApproval' + approvalPane.tabId"
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
    listDataDir: {
      type: String,
      default: null
    },
    listConfig: {
      type: Object,
      default: () => ({})
    },
    apimap: {
      type: Object,
      default: () => ({})
    },
    applyConfig: {
      type: Object,
      default: () => ({})
    },
    approvalConfig: {
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
      listPanes: []
    }
  },
  computed: {
    applyPanes () {
      return this.tabProxy.tabs.filter((tab) => {
        const live = /\d_1_.+/.test(tab.tabId)
        if (live) {
          tab.apimap = utils.clone(this.activeApimap)
          tab.applyConfig = utils.clone(this.activeApplyConfig)
        }
        return live
      })
    },
    approvalPanes () {
      return this.tabProxy.tabs.filter((tab) => {
        const live = /\d_2_.+/.test(tab.tabId)
        if (live) {
          tab.apimap = utils.clone(this.activeApimap)
          tab.approvalConfig = utils.clone(this.activeApprovalConfig)
        }
        return live
      })
    },
    activeApplyConfig () {
      return this.applyConfig[this.tabProxy.lastListId]
    },
    activeApprovalConfig () {
      return this.approvalConfig[this.tabProxy.lastListId]
    },
    activeApimap () {
      return this.apimap[this.tabProxy.lastListId]
    }
  },
  mounted () {
    // this.listPanes 不能用 computed 构造
    // 否则在切换tab的时候，会有性能问题
    // 原因是 STable 比较臃肿，不便于频繁刷新
    this.listPanes = this.tabProxy.tabs.filter((tab) => {
      const live = tab.type === 'list'
      const config = this.listConfig[tab.tabId] || {}
      const apimap = this.apimap[tab.tabId] || {}
      if (live && config) {
        tab.listConfig = utils.clone(config)
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
      await this.$refs.ProjectListRef
      this.$refs.ProjectListRef.reload()
    }
  }
}
</script>
