<template>
  <div class="layout-project-list">
    <a-row v-for="(cols, rowIndex) in viewMatrix" :key="rowIndex" :style="{ height: height }">
      <a-col
        v-for="(projectItem, colIndex) in cols"
        :span="span"
        :key="colIndex"
        class="project-item"
      >
        <div>
          <a
            v-if="projectItem.name === '__addition__'"
            @click="() => createJob(rowIndex)"
          >
            <a-icon :style="{ fontSize }" type="plus-circle" />
            <p class="project-name">新建项目</p>
          </a>
          <a
            v-else
            @click="() => takeJob(projectItem)"
          >
            <a-icon :style="{ fontSize }" v-if="projectItem.name" type="flag" />
            <p class="project-name">{{ projectItem.name }}</p>
          </a>
        </div>
      </a-col>
    </a-row>
    <ConfigRoute :modal="configRouteModal" @update="configRouteConfirm" />
  </div>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
import builder from '@/mixins/builder'
import ConfigRoute from '../config-modals/config-route'
const level1 = 2 * 3
const level2 = 3 * 6
// const level3 = 4 * 8
export default {
  mixins: [builder],
  name: 'Projects',
  components: {
    ConfigRoute
  },
  data () {
    return {
      projects: [],
      viewMatrix: [[], []],
      configRouteModal: {
        show: false,
        data: {}
      }
    }
  },
  computed: {
    span () {
      const colLength = this.viewMatrix[0].length || 3
      return 24 / colLength
    },
    height () {
      const rowLength = this.viewMatrix.length || 2
      return (100 / rowLength) + '%'
    },
    fontSize () {
      const rowLength = this.viewMatrix.length || 2
      return (2 / (rowLength * 0.1) ** 0.5) + 'rem'
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
      // const rowLength = this.viewMatrix.length
      const colLength = this.viewMatrix[0].length
      this.projects.forEach((pro, index) => {
        const colIndex = index % colLength
        const rowIndex = Math.floor(index / colLength)
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
      this.configRouteModal.mode = 'add'
      this.resetViewData()
    },
    configRouteConfirm (data) {
      this.setViewData({ key: 'name', value: data.name })
      this.setBuildData({ key: 'name', value: data.name })
      this.setViewData({ key: 'router', value: data })
      this.setBuildData({ key: 'router', value: data })
      this.$emit('update', data.name)
    },
    takeJob (proItem) {
      this.loadViewData(proItem.name)
      this.setEditType('modify')
    },
    createJob () {
      this.showConfigRouteModal()
      this.setEditType('new')
    },
    loadViewData (name) {
      api.getbuilderviewdata(name).then(res => {
        if (res.code === 200) {
          const keysOfRank = ['apply', 'approval', 'list', 'apimap']
          const data = res.data.viewData || {}
          Object.keys(data).forEach(key => {
            const module = data[key]
            if (utils.isValuable(module)) {
              if (keysOfRank.includes(key)) {
                Object.keys(module).forEach((rank) => {
                  this.setViewData({ key, rank, value: module[rank] })
                  this.setBuildData({ key, rank, value: module[rank] })
                })
              } else {
                this.setViewData({ key, value: module })
                this.setBuildData({ key, value: module })
              }
            }
          })
          this.$emit('update', name)
        } else {
          this.$message.warning(res.message)
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
  p.project-name {
    margin-top: 5px;
    text-align: center;
    font-size: 1rem;
  }
}

</style>
