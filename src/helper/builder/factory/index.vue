<template>
  <div class="moveBox">
    <a-tabs
      hide-add
      v-model="active"
      type="editable-card"
    >
      <a-tab-pane
        v-for="(tab, index) in tabs"
        :key="tab.key"
        :closable="false"
      >
        <template slot="tab">
          <div>
            <span class="tab-title">{{ tab.tabName }}</span>
            <a class="tab-item tab-edit" @click.stop="() => editTab(tab)"><a-icon type="edit" /></a>
            <a v-if="tab.rank !== 0" class="tab-item warn" @click.stop="() => reduceTab(index)"><a-icon type="minus-circle" /></a>
            <a v-if="tab.rank === 0" class="tab-item" @click.stop="() => addTab(tab)"><a-icon type="plus-circle" /></a>
          </div>
        </template>
        <div>
          <component
            :tab="tab"
            :rank="tab.rank"
            :is="tab.component"
            @switchTab="switchTab"
          />
        </div>
      </a-tab-pane>
    </a-tabs>
    <ConfigTab :modal="editModal" @update="updateTab" />
  </div>
</template>
<script>
import utils from '@/utils'
import mixins from '@builder/mixins'
import baseMixins from '@/mixins/baseMixins'
import todoMixins from '@/mixins/todoMixins'
import ProjectList from './list'
import ProjectApply from './apply'
import ProjectApproval from './approval'
import { mapActions } from 'vuex'
import ApiButton from '@builder/config-modules/api-button'
import CustomParams from '@builder/config-modules/custom-params'
import ConfigTab from '@builder/config-modals/config-tab'
export default {
  components: {
    ApiButton,
    ConfigTab,
    CustomParams,
    ProjectList,
    ProjectApply,
    ProjectApproval
  },
  mixins: [baseMixins, mixins, todoMixins],
  data () {
    return {
      editModal: {
        show: false,
        data: {}
      },
      active: '0_0',
      curEditType: '0',
      tabs: [
        // key: 用来切换tab
        // tabId: 输出给SApproval组件
        // rank: 用来标记是第几套审批流程，一套审批流程有['列表', '申请', '审批']三个tab
        // type: 用来标记 list, apply, approval
        { tabName: '列表', key: '0_0', tabId: '0', rank: 0, type: '0', component: ProjectList, api: {}, permission: { roles: [], config: '' } },
        { tabName: '申请', key: '0_1', tabId: '0_1', rank: 0, type: '1', component: ProjectApply, api: {} },
        { tabName: '审批', key: '0_2', tabId: '0_2', rank: 0, type: '2', component: ProjectApproval, api: {} }
      ]
    }
  },
  watch: {
    active: {
      handler (val) {
        if (val) {
          const type = val.split('_').pop()
          this.setTabType(type)
        }
      },
      immediate: true
    },
    tabs: {
      handler (data) {
        if (data && data.length) {
          this.handupViewData(data)
          this.handupBuildData(data)
        }
      },
      deep: true
    },
    viewData: {
      handler (data) {
        const tabs = []
        data.tabs.forEach((tab) => {
          if (tab.type === '0') {
            tab.component = utils.clone(ProjectList)
          }
          if (tab.type === '1') {
            tab.component = utils.clone(ProjectApply)
          }
          if (tab.type === '2') {
            tab.component = utils.clone(ProjectApproval)
          }
          tabs.push(utils.clone(tab))
        })
        if (tabs.length) {
          this.tabs = tabs
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['setTabType']),
    rerankTab () {
      this.tabs.sort((a, b) => {
        return a.type - b.type
      })
    },
    upgradeTab (tab) {
      let maxRank = tab.rank
      let type = tab.type
      this.tabs.forEach((p) => {
        if (p.type === type) {
          if (maxRank < p.rank) {
            maxRank = p.rank
          }
        }
      })
      tab.rank = maxRank + 1
      if (tab.type === '0') {
        tab.key = tab.tabId = tab.rank + ''
      } else {
        tab.key = tab.tabId = tab.rank + '_' + tab.type
      }
      return tab
    },
    reduceTab (index) {
      this.tabs.splice(index, 1)
    },
    editTab (tab) {
      this.editModal.data = utils.clone(tab)
      this.editModal.show = true
    },
    addTab (tab) {
      const nPane = this.upgradeTab(utils.clone(tab))
      this.tabs.push(nPane)
      this.rerankTab()
    },
    switchTab (type) {
      const tab = utils.clone(this.getCurrentTab())
      this.active = tab.rank + '_' + type
    },
    updateTab (tab) {
      this.tabs.forEach((tabItem, index) => {
        if (tab.key === tabItem.key) {
          this.$set(this.tabs, index, tab)
        }
      })
    },
    getCurrentTab () {
      let id = this.active
      return this.tabs.find(i => i.key === id)
    },
    getBuildTabs () {
      const lists = []
      const applies = []
      const approvals = []
      this.tabs.forEach((tab) => {
        const copyTab = utils.clone(tab)
        const disabledFields = ['component', 'api']
        disabledFields.forEach((key) => {
          delete copyTab[key] // 删掉 component
        })
        copyTab.type = { 0: 'list', 1: 'apply', 2: 'detail' }[copyTab.type]
        if (copyTab.type === 'list') {
          lists.push(copyTab)
        }
        if (copyTab.type === 'apply') {
          applies.push(copyTab)
        }
        if (copyTab.type === 'detail') {
          approvals.push(copyTab)
        }
      })

      // 把"申请"和"审批"的标签名绑到 list.proxyName
      lists.forEach((list) => {
        applies.forEach((apply) => {
          if (list.rank === apply.rank) {
            if (!list.proxyName) list.proxyName = { apply: '', detail: '' }
            list.proxyName.apply = apply.tabName
          }
        })
        approvals.forEach((approval) => {
          if (list.rank === approval.rank) {
            if (!list.proxyName) list.proxyName = { apply: '', detail: '' }
            list.proxyName.detail = approval.tabName
          }
        })
      })

      // 只返回 list 类型
      return lists
    },
    handupViewData (tabs) {
      const copyData = utils.clone(tabs)
      // component 不能转json，删掉
      copyData.forEach((item) => {
        delete item.component
      })
      this.setViewData({ key: 'tabs', value: copyData })
    },
    handupBuildData (tabs) {
      const copyData = utils.clone(this.getBuildTabs(tabs))
      this.setBuildData({ key: 'tabsConfig', value: copyData })
    }
  }
}
</script>
<style lang="less" scoped>
.tab-item {
  position: absolute;
  top: -0.5rem;
  height: 1rem;
}
.tab-edit {
  top: 0.5rem;
}
.tab-title {
  padding: 0 0.8rem 0 0;
}
.warn {
  color: red;
}
</style>
