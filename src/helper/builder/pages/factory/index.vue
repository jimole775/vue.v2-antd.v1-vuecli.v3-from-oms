<template>
  <div class="moveBox">
    <a-tabs
      hide-add
      v-model="active"
      type="editable-card"
    >
      <a-tab-pane
        v-for="(pane, index) in panes"
        :key="pane.tabId"
        :closable="false"
      >
        <template slot="tab">
          <div>
            <span class="tab-title">{{ pane.title + '_' + pane.rank }}</span>
            <a v-if="pane.rank !== 1" class="tab-item warn" @click.stop="() => reducePane(index)"><a-icon type="minus-circle" /></a>
            <a v-if="pane.rank === 1" class="tab-item" @click.stop="() => addPane(pane)"><a-icon type="plus-circle" /></a>
          </div>
        </template>
        <div>
          <component :is="pane.component" :rank="pane.rank" @switchTab="switchTab" />
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
// import { mapState } from 'vuex'
export default {
  components: {
    ProjectList,
    ProjectApply,
    ProjectApproval
  },
  mixins: [baseMixins, todoMixins],
  data () {
    return {
      active: '1_0',
      panes: [
        { title: '列表', tabId: '1_0', rank: 1, type: '0', component: ProjectList },
        { title: '申请', tabId: '1_1', rank: 1, type: '1', component: ProjectApply },
        { title: '审批', tabId: '1_2', rank: 1, type: '2', component: ProjectApproval }
      ]
    }
  },
  methods: {
    rerankPane () {
      this.panes.sort((a, b) => {
        return a.type - b.type
      })
    },
    upgradePane (pane) {
      let maxRank = pane.rank
      let type = pane.type
      this.panes.forEach((p) => {
        if (p.type === type) {
          if (maxRank < p.rank) {
            maxRank = p.rank
          }
        }
      })
      pane.rank = maxRank + 1
      pane.tabId = pane.rank + '_' + pane.type
      return pane
    },
    reducePane (index) {
      this.panes.splice(index, 1)
    },
    addPane (pane) {
      const nPane = this.upgradePane(utils.clone(pane))
      this.panes.push(nPane)
      this.rerankPane()
    },
    switchTab (type) {
      const pane = utils.clone(this.getCurrentPane())
      this.active = pane.rank + '_' + type
    },
    getCurrentPane () {
      let id = this.active
      return this.panes.find(i => i.tabId === id)
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
.tab-title {
  padding: 0 0.3rem 0 0;
}
.warn {
  color: red;
}
</style>
