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
            <a class="tab-title" @dblclick="() => editTab(tab)">{{ tab.tabName + '_' + (tab.rank + 1) }}</a>
            <a v-if="tab.rank !== 0" class="tab-item warn" @click.stop="() => reduceTab(index)"><a-icon type="minus-circle" /></a>
            <a v-if="tab.rank === 0" class="tab-item" @click.stop="() => addTab(tab)"><a-icon type="plus-circle" /></a>
          </div>
        </template>
        <div>
          <component :is="tab.component" :rank="tab.rank" @switchTab="switchTab" />
        </div>
      </a-tab-pane>
    </a-tabs>
    <a-modal
      v-model="editModal.show"
      title="编辑"
      @ok="editConfirm"
    >
      <a-form :form="form">
        <a-row>
          <a-col :span="24">
            <a-form-item label="页签名" :label-col="{span: 6}" :wrapper-col="{span: 16}">
              <a-input v-decorator="['tabName', {rules: [{ required: true, message: '请确认字段标签' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="角色控制" :label-col="{span: 6}" :wrapper-col="{span: 16}">
              <a-input v-decorator="['roles', {rules: [{ required: false }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="权限控制" :label-col="{span: 6}" :wrapper-col="{span: 16}">
              <a-input v-decorator="['config', {rules: [{ required: false }]}]" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
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
      form: this.$form.createForm(this),
      editModal: {
        show: false,
        data: {}
      },
      active: '0_0',
      tabs: [
        { tabName: '列表', tabId: '0_0', rank: 0, type: '0', component: ProjectList },
        { tabName: '申请', tabId: '0_1', rank: 0, type: '1', component: ProjectApply },
        { tabName: '审批', tabId: '0_2', rank: 0, type: '2', component: ProjectApproval }
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
          this.handup(this.getTabsData(data))
        }
      },
      deep: true,
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
      tab.tabId = tab.rank + '_' + tab.type
      return tab
    },
    reduceTab (index) {
      this.tabs.splice(index, 1)
    },
    editConfirm () {
    },
    editTab (tab) {
      this.editModal.data = tab
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
    getCurrentTab () {
      let id = this.active
      return this.tabs.find(i => i.tabId === id)
    },
    handup (data) {
      Vue.bus.$emit('_tabs_', data)
    },
    getTabsData () {
      // {
      //   tabName: '关键事件',
      //   type: 'list',
      //   tabId: '0',
      //   permission: {
      //     roles: [],
      //     config: null
      //   }
      // }
      const res = []
      this.tabs.forEach((tab) => {
        const disabledFields = ['rank', 'component']
        const typemap = {
          0: 'list',
          1: 'apply',
          2: 'approval'
        }
        const cTab = utils.clone(tab)
        disabledFields.forEach((key) => {
          delete cTab[key]
        })
        cTab.type = typemap[cTab.type]
        // 只存 list 类型
        if (cTab.type === 'list') {
          res.push(cTab)
        }
      })
      return res
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
