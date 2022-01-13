<template>
  <a-menu
    theme="light"
    mode="inline"
  >
    <a-menu-item>
      <span style="color: #333;">顶层菜单</span>
    </a-menu-item>
    <template v-for="item in menus">
      <a-menu-item v-if="item.children" :key="item.id">
        <!-- <span slot="title"> -->
        <!-- <i v-if="item.icon" :class="['far', item.icon]" /> -->
        <!-- <span>{{ item.title }}</span>
        </span> -->
        <span style="color: #333;">{{ item.title }}</span>
        <!-- <router-link :to="item.path">
        <i v-if="item.icon" :class="['far', item.icon]" />
        <span>{{ item.title }}</span>
        </router-link> -->
      </a-menu-item>
      <!-- <sub-menu
        v-else
        :menu-info="item"
        :key="item.id"
      /> -->
    </template>
  </a-menu>
</template>

<script>
import { mapActions } from 'vuex'
// import SubMenu from '@/components/SubMenu'
export default {
  name: 'Menu',
  // components: {
  // 'sub-menu': SubMenu
  // },
  computed: {
    menus () {
      return this.$store.state.global.menus
    }
  },
  created: function () {
    this.loadMenus()
    this.loadDictList()
  },
  methods: {
    ...mapActions(['loadMenus', 'loadDictList', 'loadUser'])
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
