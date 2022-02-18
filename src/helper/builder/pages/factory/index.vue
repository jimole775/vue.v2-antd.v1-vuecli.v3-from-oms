<template>
  <div class="moveBox">
    <a-tabs
      hide-add
      v-model="active"
      type="editable-card"
    >
      <a-tab-pane
        v-for="(tab, index) in tabs"
        :key="tab.tabId"
        :closable="false"
      >
        <template slot="tab">
          <div>
            <span class="tab-title">{{ tab.title + '_' + (tab.rank + 1) }}</span>
            <a v-if="tab.rank !== 0" class="tab-item warn" @click.stop="() => reducePane(index)"><a-icon type="minus-circle" /></a>
            <a v-if="tab.rank === 0" class="tab-item" @click.stop="() => addPane(tab)"><a-icon type="plus-circle" /></a>
          </div>
        </template>
        <div>
          <component :is="tab.component" :rank="tab.rank" @switchTab="switchTab" />
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
import { mapActions } from 'vuex'
export default {
  components: {
    ProjectList,
    ProjectApply,
    ProjectApproval
  },
  mixins: [baseMixins, todoMixins],
  data () {
    return {
      active: '0_0',
      tabs: [
        { title: '列表', tabId: '0_0', rank: 0, type: '0', component: ProjectList },
        { title: '申请', tabId: '0_1', rank: 0, type: '1', component: ProjectApply },
        { title: '审批', tabId: '0_2', rank: 0, type: '2', component: ProjectApproval }
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
    }
  },
  methods: {
    ...mapActions(['setTabType']),
    rerankPane () {
      this.tabs.sort((a, b) => {
        return a.type - b.type
      })
    },
    upgradePane (tab) {
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
      tab.tabId = tab.rank + '_' + tab.type
      return tab
    },
    reducePane (index) {
      this.tabs.splice(index, 1)
    },
    addPane (tab) {
      const nPane = this.upgradePane(utils.clone(tab))
      this.tabs.push(nPane)
      this.rerankPane()
    },
    switchTab (type) {
      const tab = utils.clone(this.getCurrentPane())
      this.active = tab.rank + '_' + type
    },
    getCurrentPane () {
      let id = this.active
      return this.tabs.find(i => i.tabId === id)
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
