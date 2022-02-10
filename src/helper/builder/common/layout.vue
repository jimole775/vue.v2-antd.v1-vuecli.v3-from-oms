<template>
  <a-layout id="layout-custom">
    <a-layout-sider
      :trigger="null"
      class="oms-sider"
      width="190"
    >
      <slot name="sider" />
      <Menu />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="bd-bottom">
        <Header />
      </a-layout-header>
      <a-layout-content class="pd">
        <slot name="content" />
      </a-layout-content>
      <!-- <a-layout-footer class="oms-footer">
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
      </a-layout-footer> -->
    </a-layout>
  </a-layout>
</template>
<script>
import Menu from './menu'
import Header from './header'
export default {
  name: 'Layout',
  components: {
    Menu,
    Header
  },
  data () {
    return {
    }
  },
  created () {
    // this.$bus
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
  background: #FFFFFF !important;
  overflow: hidden;
}

.content-box {
  padding: 2rem;
  border-left: 1px solid #e8e8e8;
  background: #FFFFFF;
}

</style>
