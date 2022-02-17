<template>
  <div class="moveBox">
    <STabs :ref="'STabsRef'" :tab-proxy="tabProxy" />
    <div v-show="tabProxy.showList">
      <template v-for="c in listComponents">
        <ProjectList
          v-show="c.tabId === tabProxy.activeId"
          :key="c.tabId"
          :apimap="c.apimap"
          :list-config="c.listConfig"
          :ref="'ProjectList' + c.tabId"
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
      <template v-for="c in applyComponents">
        <ProjectApply
          v-show="c.tabId === tabProxy.activeId"
          :key="c.tabId"
          :apimap="c.apimap"
          :apply-config="c.applyConfig"
          :ref="'ProjectApply' + c.tabId"
          :bridge="bridge"
          :tab-proxy="tabProxy"
          :before-render="beforeRender"
          :before-submit="beforeSubmit"
          @close="removePane()"
        />
      </template>
    </div>
    <div v-show="tabProxy.showDetail">
      <template v-for="c in approvalComponents">
        <ProjectApproval
          v-show="c.tabId === tabProxy.activeId"
          :key="c.tabId"
          :apimap="c.apimap"
          :approval-config="c.approvalConfig"
          :ref="'ProjectApproval' + c.tabId"
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
import baseMixins from '@/mixins/baseMixins'
import todoMixins from '@/mixins/todoMixins'
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
  mixins: [baseMixins, todoMixins],
  props: {
    applyAnchorText: {
      type: String,
      default: '创建'
    },
    stableRowKey: {
      type: String,
      default: 'id'
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
      listComponents: []
    }
  },
  computed: {
    applyComponents () {
      return this.tabProxy.tabs.filter((tab) => {
        const live = /\d_1_.+/.test(tab.tabId)
        if (live) {
          tab.apimap = utils.clone(this.activeApimap)
          tab.applyConfig = utils.clone(this.activeApplyConfig)
        }
        return live
      })
    },
    approvalComponents () {
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
    // this.listComponents 不能用 computed 构造
    // 否则在切换tab的时候，会有性能问题
    // 原因是 STable 比较臃肿，不便于频繁刷新
    this.listComponents = this.tabProxy.tabs.filter((tab) => {
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
