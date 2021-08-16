<template>
  <div class="moveBox">
    <OmsTabsPlus :ref="'OmsTabsRef'" :tab-proxy="tabProxy" />
    <div v-show="tabProxy.showList">
      <ProjectList
        :ref="'ProjectListRef'"
        :transfer-searchor="transferSearchor"
        :list-config="activeListConfig"
        :stable-row-key="stableRowKey"
        :apply-anchor-text="applyAnchorText"
        :apimap="activeApimap"
        :before-render="beforeRender"
        :before-submit="beforeSubmit"
        @addDetailTab="addDetailTab"
      />
    </div>
    <div v-show="tabProxy.showApply">
      <template v-for="c in applyComponents">
        <ProjectApply
          v-show="c.tabId === tabProxy.activeId"
          :key="c.tabId"
          :apply-config="c.applyConfig"
          :before-render="beforeRender"
          :before-submit="beforeSubmit"
          :tab-proxy="tabProxy"
          :apimap="activeApimap"
          @close="removePane()"
        />
      </template>
    </div>
    <div v-show="tabProxy.showDetail">
      <template v-for="c in approvalComponents">
        <ProjectApproval
          v-show="c.tabId === tabProxy.activeId"
          :key="c.tabId"
          :approval-config="c.approvalConfig"
          :before-render="beforeRender"
          :before-submit="beforeSubmit"
          :tab-proxy="tabProxy"
          :apimap="activeApimap"
          @close="removePane()"
        />
      </template>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import OmsTabsPlus from '@/components/OmsTabsPlus'
import baseMixins from '@/mixins/baseMixins'
import todoMixins from '@/mixins/todoMixins'
import ProjectList from './list'
import ProjectApply from './apply'
import ProjectApproval from './approval'
export default {
  name: 'SApprovallor',
  components: {
    OmsTabsPlus,
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
      default: 'flowInstanceId'
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
    panes: {
      type: Array,
      default: () => ([])
    },
    beforeRender: {
      type: Function,
      default: p => p
    },
    beforeSubmit: {
      type: Function,
      default: p => p
    }
  },
  data () {
    return {
      tabProxy: {
        panes: utils.clone(this.panes),
        showList: true,
        showApply: false,
        showDetail: false,
        activeId: '0',
        lastListId: '0'
      }
    }
  },
  computed: {
    applyComponents () {
      const panes = this.tabProxy.panes.filter((pane) => {
        pane.applyConfig = utils.clone(this.activeApplyModulesMap)
        return /\d_1_.+/.test(pane.tabId)
      })
      return panes
    },
    approvalComponents () {
      const panes = this.tabProxy.panes.filter((pane) => {
        pane.approvalConfig = utils.clone(this.activeApprovalModulesMap)
        return /\d_2_.+/.test(pane.tabId)
      })
      return panes
    },
    activeApplyModulesMap () {
      return this.applyConfig[this.tabProxy.lastListId]
    },
    activeApprovalModulesMap () {
      return this.approvalConfig[this.tabProxy.lastListId]
    },
    activeApimap () {
      return this.apimap[this.tabProxy.lastListId]
    },
    activeListConfig () {
      return this.listConfig[this.tabProxy.lastListId]
    }
  },
  methods: {
    async addDetailTab (typeId, recordData) {
      await this.$refs.OmsTabsRef
      this.$refs.OmsTabsRef.addDetailTab(typeId, recordData)
    },
    async removePane () {
      await this.$refs.OmsTabsRef
      this.$refs.OmsTabsRef.removePane(this.tabProxy.activeId)
      this.reload()
    },
    async reload () {
      await this.$refs.ProjectListRef
      this.$refs.ProjectListRef.reload()
    }
  }
}
</script>
