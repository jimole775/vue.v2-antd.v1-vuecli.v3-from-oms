<template>
  <a-breadcrumb class="oms-breadcrumb" separator="/">
    <a-breadcrumb-item href="/">
      <!-- <a-icon type="home" @click="toHome" /> -->
      <a @click="toHome">首页</a>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-for="(item, index) in pathRoads" :key="index">
      <span>{{ item.breadcrumbName }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
import utils from '@/utils'

export default {
  name: 'SBreadcrumb',
  data () {
    return {
      pathRoads: []
    }
  },
  computed: {
    menus () {
      return this.$store.state.global.menus
    }
  },
  watch: {
    '$route': {
      handler () {
        this.getPathRoads()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getPathRoads () {
      if (!this.menus || this.menus.length === 0) {
        return
      }
      let arr = utils.findPathDFS(this.menus, this.$router.history.current.path)
      this.pathRoads = arr.map((item) => {
        return {
          path: item.path,
          breadcrumbName: item.title
        }
      })
    },
    toHome () {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.oms-breadcrumb {
  position: relative;
  left: 0;
  top: 0;
  width: auto;
  display: inline-block;
  height: 45px;
  line-height: 45px;
  padding: 0 15px;
  > span {
    &:last-child {
      color: #333333;
    }
  }
}
</style>
