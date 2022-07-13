<template>
  <div class="builder-menu">
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
      :selected-keys="menuSelectedKeys"
    >
      <template v-for="module in menus">
        <a-menu-item :disabled="!hasDisabled(module.path)" :key="module.path" :value="module.path">
          <a style="color: #333;" @click="() => showConfigRouteModal(module.path)">{{ module.name }}</a>
        </a-menu-item>
      </template>
    </a-menu>
    <ConfigRoute :modal="configRouteModal" @update="configRouteConfirm" />
  </div>
</template>

<script>
import utils from '@/utils'
import { mapState } from 'vuex'
import builder from '@builder/mixins/builder'
import ConfigRoute from '../config-modals/config-route'
export default {
  mixins: [builder],
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
    ...mapState({
      menus: state => state.builder.menus
    }),
    menuSelectedKeys () {
      return this.viewData.router.parent ? [this.viewData.router.parent] : []
    }
  },
  methods: {
    hasDisabled (name) {
      return this.viewData.router.parent === name
    },
    showConfigRouteModal (menuName) {
      if (this.viewData.router.parent === menuName) {
        this.configRouteModal.show = true
        this.configRouteModal.mode = 'modify'
        this.configRouteModal.data = utils.clone(this.viewData.router)
      }
    },
    configRouteConfirm (data) {
      this.setViewData({ key: 'router', value: data })
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
.builder-menu {
  overflow: auto;
  height: 100%;
}
</style>
