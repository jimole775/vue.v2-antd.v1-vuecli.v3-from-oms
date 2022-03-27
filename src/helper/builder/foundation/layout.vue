<template>
  <div class="layout">
    <a-layout v-if="currentJob" id="layout-custom">
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
    <div v-else class="layout-project-list">
      <a-row style="display: table">
        <a-col
          :span="span"
          :key="pro"
          v-for="pro in projects"
        >
          <a @click="() => takeJob(pro)">{{ pro }}</a>
        </a-col>
        <a-col
          :span="span"
        >
          <a @click="createJob"><a-icon type="plus-circle" /></a>
        </a-col>
      </a-row>
      <ConfigRoute :modal="configRouteModal" @update="configRouteConfirm" />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import api from '@/api'
import Menu from './menu'
import Header from './header'
import ConfigRoute from '../config-modals/config-route'
const minLength = 3
const maxLength = 6
export default {
  name: 'Layout',
  components: {
    Menu,
    Header,
    ConfigRoute
  },
  data () {
    return {
      currentJob: '',
      projects: []
    }
  },
  computed: {
    span () {
      if (this.projects.length <= minLength) {
        return 24 / minLength
      } else {
        return 24 / maxLength
      }
    }
  },
  mounted () {
    const res = api.getbuilderprojects()
    if (res.code === 200) {
      this.projects = res.data.projects
    }
  },
  methods: {
    showConfigRouteModal (menuName) {
      this.configRouteModal.show = true
      this.configRouteModal.data.parent = menuName || ''
    },
    configRouteConfirm (data) {
      this.currentJob = data.name
      Vue.bus.$emit('__router__', data)
    },
    takeJob (pro) {
      this.currentJob = pro
    },
    createJob () {
      this.showConfigRouteModal()
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
}
.layout-project-list [class~='ant-col'] {
  background: transparent;
  border: 0;
}
.layout-project-list [class~='ant-col'] > div {
  background: #00a0e9;
  height: 120px;
  line-height: 120px;
  font-size: 13px;
}
.layout-project-list pre {
  background: #f9f9f9;
  border-radius: 6px;
  font-size: 13px;
  padding: 8px 16px;
}
</style>
