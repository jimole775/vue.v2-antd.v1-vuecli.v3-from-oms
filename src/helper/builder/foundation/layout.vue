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
      <a-row v-for="(cols, rowIndex) in viewMatrix" :key="rowIndex" :style="{ height: height }">
        <a-col
          v-for="(projectItem, colIndex) in cols"
          :span="span"
          :key="colIndex"
          class="project-item"
        >
          <div>
            <a v-if="projectItem.name === '__addition__'" class="icon-font-size" @click="() => createJob(rowIndex)"><a-icon type="plus-circle" /></a>
            <a v-else class="icon-font-size" @click="() => takeJob(projectItem, rowIndex, colIndex)">{{ projectItem.name || ' ' }}</a>
          </div>
        </a-col>
      </a-row>
      <ConfigRoute :modal="configRouteModal" @update="configRouteConfirm" />
    </div>
  </div>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
import Menu from './menu'
import Header from './header'
import mixins from '@builder/mixins'
import ConfigRoute from '../config-modals/config-route'
const level1 = 2 * 3
const level2 = 3 * 6
// const level3 = 4 * 8
export default {
  mixins: [mixins],
  name: 'Layout',
  components: {
    Menu,
    Header,
    ConfigRoute
  },
  data () {
    return {
      currentJob: '',
      projects: [],
      viewMatrix: [[], []],
      configRouteModal: {
        show: false,
        disparent: false,
        cache: {},
        data: {}
      }
    }
  },
  computed: {
    span () {
      const cols = this.viewMatrix[0].length || 3
      return 24 / cols
    },
    height () {
      const rows = this.viewMatrix.length || 2
      return (100 / rows) + '%'
    }
  },
  mounted () {
    api.getbuilderprojects().then((res) => {
      if (res.code === 200) {
        this.projects = res.data.projects || []
      }
      this.projects.push('__addition__')
      this.buildMatrix()
    })
  },
  methods: {
    buildMatrix () {
      // 使用矩阵陈列，2 * 3 | 3 * 6 | 4 * 8
      let curLength = this.projects.length + 1
      if (curLength <= level1) {
        this.viewMatrix = createMatrixItem(2, 3)
      } else if (curLength > level1) {
        this.viewMatrix = createMatrixItem(3, 6)
      } else if (curLength > level2) {
        this.viewMatrix = createMatrixItem(4, 8)
      }
      this.fillProjectInfo()
    },
    fillProjectInfo () {
      const rows = this.viewMatrix.length
      this.projects.forEach((pro, index) => {
        const colIndex = index % rows
        const rowIndex = Math.ceil(index / rows)
        this.viewMatrix[rowIndex][colIndex] = {
          x: rowIndex,
          y: colIndex,
          name: pro
        }
      })
    },
    showConfigRouteModal () {
      this.configRouteModal.show = true
      // 放开parent的编辑权限
      this.configRouteModal.disparent = false
      this.configRouteModal.data = utils.clone(this.viewData.router)
    },
    configRouteConfirm (data) {
      this.currentJob = data.name
      this.setViewData({ key: 'name', value: data.name })
      this.setViewData({ key: 'router', value: data })
      this.setBuildData({ key: 'routerConfig', value: data })
    },
    takeJob (pro) {
      this.currentJob = pro
    },
    createJob () {
      this.showConfigRouteModal()
    },
    loadViewData (name) {
      api.getbuilderviewdata(name).then(res => {
        if (res.code === 200) {
          const keys = ['apply', 'approval', 'list', 'router', 'tabs', 'apimap', 'name']
          const data = res.data.viewData || {}
          keys.forEach(k => {
            if (utils.isValuable(data[k])) {
              this.setViewData({ key: k, value: data[k] })
            }
          })
        }
      })
    }
  }
}

function createMatrixItem (rowLen, colLen) {
  const rows = []
  const cols = []
  const item = Object.create(null)
  while (colLen--) {
    cols[colLen] = utils.clone(item)
  }
  while (rowLen--) {
    rows[rowLen] = utils.clone(cols)
  }
  return rows
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
}

.icon-font-size {
  i.anticon {
    font-size: 6rem;
  }
}

</style>
