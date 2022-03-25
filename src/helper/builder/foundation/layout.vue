<template>
  <div class="layout">
    <a-layout v-if="project" id="layout-custom">
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
      <a-row v-for="(rowItem, rowKey) in appInfo" :key="rowKey" style="display: table">
        <a-col
          span="1"
          class="icon-box"
          v-for="(colItem, colKey) in rowItem"
          :style="iconStyle"
          :key="colKey"
        >
          <AppIcon :appItem="colItem" />
        </a-col>
      </a-row>
      <button ref="_iconConsult" type="info" class="kick-out">
        <!--当前元素只是作用计算屏幕容量的-->
        <Icon type="ios-disc" />
      </button>
    </div>
  </div>
</template>
<script>
import Menu from './menu'
import Header from './header'
import utils from '@/utils'
import { mapMutations, mapActions } from 'vuex'
import { rowToCol, fillArray } from '../utils'
import emulationData from './apps.info.json'
import storage from '@/store/storage'
export default {
  name: 'Layout',
  components: {
    Menu,
    Header
  },
  data () {
    return {
      project: '',
      iconStyle: {
        height: '',
        width: ''
      }
      // cordinate: {
      //   drag: {
      //     x: 0,
      //     y: 0
      //   },
      //   drop: {
      //     x: 0,
      //     y: 0
      //   }
      // }
    }
  },
  computed: {
    appInfo () {
      return this.$store.state.appInfo
    },
    activeThreads () {
      return this.$store.state.threads
    }
  },
  mounted () {
    const that = this
    that.refreshMatrices()
    window.onresize = function () {
      console.log('window resize!')
      that.$nextTick(() => {
        that.resetAppInfo() // 避免重复填充
        that.refreshMatrices()
      })
    }
  },
  methods: {
    ...mapMutations(['appInfoUpdate', 'resetAppInfo']),
    ...mapActions(['setBuildData', 'getBuildData']),
    queryRightElement (src, targetSign) {
      if (src) {
        let srcElement = src
        if (srcElement.className.includes(targetSign)) {
          return srcElement
        } else {
          return this.queryRightElement(srcElement.parentElement, targetSign)
        }
      }
    },
    // drag(e) {
    //   let target = e.target
    //   this.cordinate.drag = this.countCordinate(target)
    // },
    // drop(e) {
    //   let target = e.target
    //   this.cordinate.drop = this.countCordinate(target)
    //   this.dropTransfer(this.cordinate)
    // },
    // allowDrop(e) {
    //   e.preventDefault()
    // },
    // countCordinate (src) {
    //   // 获取坐标的逻辑
    //   let target = this.queryRightElement(src, 'ivu-col')
    //   let theRow = this.queryRightElement(target, 'ivu-row')
    //   let rowContainer = theRow.parentElement
    //   return {
    //     x: Array.prototype.indexOf.call(theRow.children, target),
    //     y: Array.prototype.indexOf.call(rowContainer.children, theRow)
    //   }
    // },
    isModelUpdated () {
      const oldModelVersion = storage.getItem('_appContainerModel_version')
      return oldModelVersion !== emulationData.version
    },
    refreshMatrices () {
      const doc = document
      // const contentContainer = doc.querySelector("#_content") || doc.body
      const footer = doc.querySelector('.ivu-layout-footer') || {
        clientHeight: 89
      }
      const contentClientRect = {
        width: doc.body.clientWidth,
        height: doc.body.clientHeight - footer.clientHeight
      }

      const iconConsult = this.$refs._iconConsult.$el || {
        getBoundingClientRect: () => {
          return {
            height: 32,
            width: 32
          }
        }
      }
      const iconClientRect = iconConsult.getBoundingClientRect()
      const capacityHeight = iconClientRect.height + iconClientRect.height / 2
      const capacityWidth = iconClientRect.width + iconClientRect.width / 2
      const moHeight = contentClientRect.height % capacityHeight
      const moWidth = contentClientRect.width % capacityWidth
      const rows = (contentClientRect.height - moHeight) / capacityHeight
      const cols = (contentClientRect.width - moWidth) / capacityWidth

      this.iconStyle.height = moHeight / rows + capacityHeight + 'px'
      this.iconStyle.width = moWidth / cols + capacityWidth + 'px'
      const chcheContainerModel = storage.getItem('_appContainerModel')
      if (
        !chcheContainerModel ||
        !chcheContainerModel.length ||
        this.isModelUpdated()
      ) {
        // 如果没有缓存，或者数据有更新，就使用默认的盒子模型
        const defaultContainerModel = fillArray(
          rowToCol(emulationData.items, rows),
          {},
          rows,
          cols
        )
        this.appInfoUpdate({
          items: defaultContainerModel,
          version: emulationData.version
        })
      } else {
        const contentContainers = rows * cols
        const cacheCols = chcheContainerModel[0].length
        const cacheRows = chcheContainerModel.length
        // 如果有缓存了，需要根据当前的屏幕尺寸，重新规划盒子模型
        // 分两种情况:
        // 1. 窗口缩小了，需要裁掉缓存的模型，
        // 裁掉的部分，如果有APP，就把它塞进附近位置
        // todo 如果所有盒子都装满了App，缩小屏幕后，有溢出的部分，用另一个列表装起来，放在底部栏
        if (contentContainers < cacheCols * cacheRows) {
          // let overStackStore = []
          let y = cacheRows
          // 裁剪行
          while (y-- > rows) {
            if (chcheContainerModel[y]) {
              let cuttingRow = chcheContainerModel.splice(y, 1)[0]
              cuttingRow.forEach(function (item) {
                if (!utils.isEmptyObject(item)) {
                  backRollInsertRow(item, y - 1, chcheContainerModel)
                }
              })
            }
          }

          // 裁剪列
          let yAfterCutted = chcheContainerModel.length
          while (yAfterCutted--) {
            const yAfterCuttedRow = chcheContainerModel[yAfterCutted]
            let x = cacheCols
            while (x-- > cols) {
              const latestItem = yAfterCuttedRow.splice(x, 1)[0]
              if (utils.isObject(latestItem) && !utils.isEmptyObject(latestItem)) {
                backRollInsertCol(
                  latestItem,
                  chcheContainerModel,
                  yAfterCutted,
                  cols
                )
              }
            }
          }
        }

        // 2. 窗口扩大了，需要填充模型
        if (contentContainers > cacheCols * cacheRows) {
          let thisLayerY = rows
          while (thisLayerY--) {
            if (!chcheContainerModel[thisLayerY]) {
              // 直接填充整行
              chcheContainerModel[thisLayerY] = new Array(cols).fill({})
            } else {
              // 检查填充行内的空盒子
              let thisLayerX = cols
              while (thisLayerX--) {
                if (!chcheContainerModel[thisLayerY][thisLayerX]) {
                  chcheContainerModel[thisLayerY][thisLayerX] = {}
                }
              }
            }
          }
        }

        this.appInfoUpdate({ items: chcheContainerModel })
      }
    }
  }
}

function backRollInsertCol (
  latestItem,
  chcheContainerModel,
  loopY,
  fixedX
) {
  const latestRow = chcheContainerModel[loopY]
  let isInsert = false
  let loopX = fixedX
  while (loopX--) {
    if (utils.isObject(latestRow[loopX]) && utils.isEmptyObject(latestRow[loopX])) {
      latestRow[loopX] = latestItem
      isInsert = true
    }
    if (isInsert) break
  }
  if (!isInsert) {
    return backRollInsertCol(
      latestItem,
      chcheContainerModel,
      loopY - 1,
      fixedX
    )
  }
}

function backRollInsertRow (item, latestRowIndex, chcheContainerModel) {
  const latestRow = chcheContainerModel[latestRowIndex]
    ? chcheContainerModel[latestRowIndex]
    : []
  let isInsert = false
  let loop = latestRow.length
  while (loop--) {
    if (utils.isObject(latestRow[loop]) && utils.isEmptyObject(latestRow[loop])) {
      isInsert = true
      latestRow[loop] = item
    }
    if (isInsert) break
  }
  if (!isInsert) {
    return backRollInsertRow(item, latestRowIndex - 1, chcheContainerModel)
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
