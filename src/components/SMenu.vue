<template>
  <a-menu
    theme="light"
    mode="inline"
    :class="['menu']"
    :key="menuSelectedKeys.join()"
    :default-selected-keys="menuSelectedKeys"
    :default-open-keys="submenuSelectedKeys"
  >
    <div v-if="!menus || !menus.length">
      <!-- 没有数据前，渲染动画视图 -->
      <a-button :loading="loading" class="loading-animate">
        &nbsp;
      </a-button>
    </div>
    <template v-for="item in menus">
      <a-menu-item v-if="!item.children" :key="item.id">
        <router-link :to="item.path">
          <!-- <a-icon :type="item.icon" /> -->
          <i v-if="item.icon" :class="['far', item.icon]" />
          <span>{{ item.title }}</span>
        </router-link>
      </a-menu-item>
      <sub-menu
        v-else
        :menu-info="item"
        :key="item.id"
      />
    </template>
  </a-menu>
</template>

<script>
import SubMenu from './SubMenu'
import utils from '@/utils'

export default {
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'sub-menu': SubMenu
  },
  data () {
    return {
      menuSelectedKeys: [],
      submenuSelectedKeys: []
    }
  },
  computed: {
    menus () {
      return this.$store.state.global.menus
    },
    loading () {
      return this.$store.state.global.loading
    }
  },
  watch: {
    '$route': {
      handler () {
        this.getMenuSelectedKeys()
        this.getSubmenuSelectedKeys()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getMenuSelectedKeys () {
      const arr = utils.findPathDFS(this.menus, document.location.pathname)
      this.submenuSelectedKeys = arr.map(item => item.id)
    },
    getSubmenuSelectedKeys () {
      const arr = utils.findPathDFS(this.menus, document.location.pathname)
      this.menuSelectedKeys = !this.collapsed && arr.map(item => item.id)
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

ul.ant-menu-inline-collapsed {
  // 收缩时选中项的背景色
  li.ant-menu-item.ant-menu-item-selected {
    background: @primary-color;
    // 收缩时选中项的图标
    i.far {
      color: #fff;
    }
  }
  // 收缩时的文本
  li.ant-menu-item {
    a > span {
      display: none;
    }
  }
}
</style>
