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
    >
      <a-menu-item :disabled="!hasDisabled('views')">
        <a style="color: #333;" @click="() => showConfigRouteModal('views')">顶层菜单</a>
      </a-menu-item>
      <template v-for="name in menus">
        <a-menu-item :disabled="!hasDisabled(name)" :key="name">
          <a style="color: #333;" @click="() => showConfigRouteModal(name)">{{ name }}</a>
        </a-menu-item>
      </template>
    </a-menu>
    <ConfigRoute :modal="configRouteModal" @update="configRouteConfirm" />
  </div>
</template>

<script>
import utils from '@/utils'
import { mapActions } from 'vuex'
import builder from '@/mixins/builder'
import routes from '@/router/routes.js'
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
    menus () {
      const res = Object.create(null)
      // 设置赋值 当前已选的 父级菜单
      res[this.viewData.router.parent] = null

      // 通过routes的component筛选出 父级菜单
      routes.forEach(i => {
        if (i.component) {
          const dirty = i.component.toString()
          const pure = dirty.match(/\.\/src\/views\/.*?\.(vue|js)/g)
          if (pure) {
            res[pure[0].replace(/\.\/src\/views\/(.*?)\/.+/g, '$1')] = null
          }
        }
      })
      return Object.keys(res)
    }
  },
  created: function () {
    this.loadMenus()
    this.loadDictList()
  },
  methods: {
    ...mapActions(['loadMenus', 'loadDictList']),
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
      this.setBuildData({ key: 'router', value: data })
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
