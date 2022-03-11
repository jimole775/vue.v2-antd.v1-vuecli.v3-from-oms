<template>
  <div>
    <div class="logo-text pd-x" style="max-height:50px;">
      <div class="logo-image">
        <span class="logo-desc">新模块配置</span>
        &nbsp;&nbsp;
        <router-link to="/">
          <a-tooltip title="退回主页">
            <a-icon type="left-circle" />
          </a-tooltip>
        </router-link>
      </div>
    </div>
    <a-menu
      theme="light"
      mode="inline"
      class="menu"
    >
      <a-menu-item>
        <a style="color: #333;" @click="() => showConfigRouteModal('views')">顶层菜单</a>
      </a-menu-item>
      <template v-for="item in menus">
        <a-menu-item :key="item">
          <a style="color: #333;" @click="() => showConfigRouteModal(item)">{{ item }}</a>
        </a-menu-item>
      </template>
    </a-menu>
    <ConfigRoute :modal="configRouteModal" @update="configRouteConfirm" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ConfigRoute from './config-route'
const modules = require.context('../../../../views', true, /(\.vue)$/)
export default {
  name: 'Menu',
  components: {
    ConfigRoute
  },
  data () {
    return {
      configRouteModal: {
        show: false,
        data: {}
      }
    }
  },
  computed: {
    menus () {
      const vues = modules.keys()
      const menus = vues.map(i => i.split('/')[1])
      return menus
    }
  },
  created: function () {
    this.loadMenus()
    this.loadDictList()
  },
  methods: {
    ...mapActions(['loadMenus', 'loadDictList']),
    showConfigRouteModal (menuItem) {
      this.configRouteModal.show = true
      this.configRouteModal.data.parent = menuItem || ''
    },
    configRouteConfirm (data) {
      this.configRouteModal.data = data
    }
  }
}
</script>

<style lang="less" scoped>
.menu {
  height: calc(100% - 50px);
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 20px;
}

// 菜单栏展开状态时，选中项的背景色
.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background: linear-gradient(90deg, #F4F9F5 0%, #E5FAE9 100%);
}
</style>
