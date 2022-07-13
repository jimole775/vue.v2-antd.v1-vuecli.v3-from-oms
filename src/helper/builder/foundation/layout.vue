<template>
  <div class="layout">
    <a-layout v-if="showProjectFactory" id="layout-custom">
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
    <Projects v-else />
  </div>
</template>
<script>
import Menu from './menu'
import Header from './header'
import builder from '@builder/mixins/builder'
import Projects from './projects'
export default {
  mixins: [builder],
  name: 'Layout',
  components: {
    Menu,
    Header,
    Projects
  },
  data () {
    return {
      showProjectFactory: false
    }
  },
  watch: {
    projectName: {
      handler (name) {
        this.showProjectFactory = !!name
      },
      immediate: true
    }
  }
}

</script>
<style lang="less" scoped>

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

.layout, .layout-project-list {
  width: 100%;
  height: 100%;
  background: #333;
}

.layout-project-list [class~='ant-col'] {
  display: flex;
  align-items: center;
  background: transparent;
  height: 100%;
  border-right: 1px solid #222;
  border-bottom: 1px solid #222;
  border-top: 1px solid #444;
  border-left: 1px solid #444;
  > div {
    margin: 0 auto;
  }
  p.project-name {
    margin-top: 5px;
    text-align: center;
    font-size: 1rem;
  }
}

</style>
