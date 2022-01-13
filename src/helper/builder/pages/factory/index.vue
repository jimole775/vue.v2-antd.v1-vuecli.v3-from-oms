<template>
  <div class="moveBox">
    <a-tabs
      hide-add
      v-model="active"
      type="editable-card"
    >
      <a-tab-pane
        v-for="pane in panes"
        :key="pane.tabId"
        :closable="!!pane.closable"
      >
        <template slot="tab">
          <div>
            <span>{{ pane.title }}</span>
            <a-button>+</a-button>
          </div>
        </template>
        <div>
          <component :is="pane.component" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
// import api from '@/api'
import utils from '@/utils'
import baseMixins from '@/mixins/baseMixins'
import todoMixins from '@/mixins/todoMixins'
import ProjectList from './list'
import ProjectApply from './apply'
import ProjectApproval from './approval'
import { mapState } from 'vuex'
export default {
  components: {
    ProjectList,
    ProjectApply,
    ProjectApproval
  },
  mixins: [baseMixins, todoMixins],
  data () {
    return {
      active: '0',
      panes: [
        { title: '列表1', tabId: '0', closable: false, component: ProjectList },
        { title: '申请1', tabId: '1', closable: false, component: ProjectApply },
        { title: '审批1', tabId: '2', closable: false, component: ProjectApproval }
      ]
    }
  },
  computed: {
    ...mapState({
      employeeNumber: (state) => state.global.user.employeeNumber
    })
  },
  methods: {
    addDetailTab (id, recordData = {}) {
      this.tabProxy.activeId = id
      // 如果是被驳回到申请节点，
      // 并且当前登陆人是项目的申请人，
      // 就使用【ProjectApply】模块
      if (recordData.__tabType__) {
        // 主页待办跳转
        if (['start', null].includes(recordData.flowNode) && recordData.createdBy === this.employeeNumber) {
          this.tabProxy.activeId = '1'
        }
      } else {
        // 列表页跳转
        if (['start', null].includes(recordData.projectFlowNode) && recordData.applyAccount === this.employeeNumber) {
          this.tabProxy.activeId = '1'
        }
      }
      this.storeRecordData(recordData)
    },
    async removePane (id) {
      await this.$refs.OmsTabsRef
      this.$refs.OmsTabsRef.removePane(id)
      this.reload()
    },
    async reload () {
      await this.$refs.ProjectListRef
      this.$refs.ProjectListRef.reload()
    },
    storeRecordData (recordData) {
      const id = this.tabProxy.activeId || '0'
      const pane = this.tabProxy.panes[id]
      pane.recordData = utils.clone(recordData)
    },
    getCurrentRecordData (id) {
      const pane = this.tabProxy.panes[id]
      return pane.recordData || {}
    }
  }
}
</script>

<style lang="less" scoped>

</style>
