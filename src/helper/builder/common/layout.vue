<template>
  <a-layout id="layout-custom">
    <a-layout-sider
      :trigger="null"
      class="oms-sider"
      width="190"
    >
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
      <Menu />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="bd-bottom">
        <a-icon
          class="trigger"
          :type="'menu-fold'"
        />
        <div class="pull-right">
          <a-avatar icon="user" class="mr5" :src="user.image" />
          <span class="black" v-text="user.name" />
          (<span style="margin: 0 0.2rem;font-size: 12px;" v-text="user.employeeNumber" />
          <span v-if="user.supplierAbbreation" style="margin: 0 0.2rem;font-size: 12px;" v-text="user.supplierAbbreation" />)
          <a href="javascript:;" class="sing-out red" />
        </div>
      </a-layout-header>
      <a-layout-content class="pd">
        <slot />
      </a-layout-content>
      <a-layout-footer class="oms-footer">
        <a-row>
          <a-col :span="16">
            <span style="color:gray">(请注意信息安全)</span>
          </a-col>
          <a-col :span="8">
            <span>
              <a-tooltip :trigger="'click'">
                <template slot="title">
                  <div>
                    <p>联系我们</p>
                  </div>
                </template>
              </a-tooltip>
            </span>
          </a-col>
        </a-row>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import Menu from './menu'
export default {
  name: 'Layout',
  components: {
    Menu
  },
  data () {
    return {
    }
  },
  computed: {
    user () {
      return this.$store.state.global.user
    }
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="less">

.ant-layout {
  height: 100%;
  min-width:1180px;
}

.oms-sider {
  background: #FFFFFF!important;
  overflow: hidden;
}

.content-box {
  padding: 2rem;
  border-left: 1px solid #e8e8e8;
  background: #FFFFFF;
}

</style>
