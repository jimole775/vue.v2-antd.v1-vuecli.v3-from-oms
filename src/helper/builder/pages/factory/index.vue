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
            <span class="tab-title">{{ tab.tabName }}</span>
            <a class="tab-item tab-edit" @click.stop="() => editTab(tab)"><a-icon type="edit" /></a>
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
              <a-input v-decorator="['tabName', {rules: [{ required: true, message: '请确认页签名' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="角色查看权限" :label-col="{span: 6}" :wrapper-col="{span: 16}">
              <a-radio-group v-decorator="['roles', {rules: [{ required: false }]}]">
                <a-radio value="0">全部</a-radio>
                <a-radio value="1">内部</a-radio>
                <a-radio value="2">外部</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="后台配置权限" :label-col="{span: 6}" :wrapper-col="{span: 16}">
              <a-input placeholder="$services.com.xxx.xxx" v-decorator="['config', {rules: [{ required: false }]}]" />
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
        { tabName: '列表', tabId: '0_0', rank: 0, type: '0', component: ProjectList, permission: { roles: [], config: '' } },
        { tabName: '申请', tabId: '0_1', rank: 0, type: '1', component: ProjectApply, permission: { roles: [], config: '' } },
        { tabName: '审批', tabId: '0_2', rank: 0, type: '2', component: ProjectApproval, permission: { roles: [], config: '' } }
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
      this.form.validateFields((err, values) => {
        if (err) return false
        this.editModal.data.tabName = values.tabName
        if (!this.editModal.data.permission) {
          this.editModal.data.permission = {}
        }
        this.editModal.data.permission.roles = values.roles
        this.editModal.data.permission.config = values.config
        this.editModal.show = false
      })
    },
    editTab (tab) {
      const { roles, config } = tab.permission || {}
      this.editModal.data = tab
      this.editModal.show = true
      setTimeout(() => {
        this.form.setFieldsValue({
          tabName: tab.tabName,
          roles: roles,
          config: config
        })
      })
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
    getTabsData () {
      const lists = []
      const applies = []
      const approvals = []
      this.tabs.forEach((tab) => {
        const cTab = utils.clone(tab)
        const disabledFields = ['component']
        disabledFields.forEach((key) => {
          delete cTab[key] // 删掉 component
        })
        cTab.type = { 0: 'list', 1: 'apply', 2: 'detail' }[cTab.type]
        if (cTab.type === 'list') {
          lists.push(cTab)
        }
        if (cTab.type === 'apply') {
          applies.push(cTab)
        }
        if (cTab.type === 'detail') {
          approvals.push(cTab)
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
    handup (data) {
      Vue.bus.$emit('__tabs__', data)
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
