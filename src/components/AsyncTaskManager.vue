<template>
  <div>
    <div v-if="(taskingList && taskingList.length) || failureList.data.length" class="task-hover-button">
      <a-tooltip v-model="tipmodal.show" trigger="contextmenu">
        <template slot="title">
          <span>{{ tipmodal.message }}</span>
        </template>
        <a-button @click="managermodal.show = true">
          <span>
            <a-icon type="bars" />&nbsp;
            <span class="desc">任务列表</span>
          </span>
        </a-button>
      </a-tooltip>
    </div>
    <a-modal
      class="task-hover-window"
      title="任务列表"
      :footer="null"
      v-model="managermodal.show"
    >
      <a-list bordered :data-source="taskingList">
        <a-list-item slot="renderItem" slot-scope="item">
          <div class="list-item">
            <a-tooltip :title="behavior[item.type] || '任务运行中...'">
              <a-button class="fake-loading-icon" :loading="true" />
            </a-tooltip>
            <span class="file-name" style="padding-left: 0.5rem;">{{ item.fileName }}</span>
            <a-button class="close-icon" @click="() => delExportListItemConfirm(item)">
              <a-icon type="close" />
            </a-button>
          </div>
        </a-list-item>
      </a-list>
      <a-list v-if="failureList.data.length" bordered :data-source="failureList.data">
        <a-list-item slot="renderItem" slot-scope="item, index">
          <div class="list-item">
            <a-tooltip :title="item.msg">
              <a-button class="fake-loading-icon">
                <a-icon type="exclamation-circle" />
              </a-button>
            </a-tooltip>
            <a-tooltip :title="点击重试">
              <a-button class="redo-icon" @click="() => tryReloadFormErrorList(item, index)">
                <a-icon type="redo" />
              </a-button>
            </a-tooltip>
            <span class="file-name">{{ item.fileName }}</span>
            <a-button class="close-icon" @click="() => delErrorListItem(item)">
              <a-icon type="close" />
            </a-button>
          </div>
        </a-list-item>
      </a-list>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
import { mapActions } from 'vuex'
export default {
  title: '任务管理中心',
  name: 'TaskManager',
  data () {
    return {
      managermodal: {
        show: false
      },
      heartbeatState: {
        timesign: null
      },
      taskingListBackup: [], // 用来备份对比data的，已方便判断data有没有新增
      failureList: {
        data: [],
        backup: []
      },
      error: '在调用 global.pushTaskingList 时，请注意参数中的 type 值！',
      apimap: {
        import: api.getuploadfilekey,
        export: api.getdownfilekey,
      },
      behavior: {
        import: '正在导入...',
        export: '正在导出...',
      },
      tipmodal: {
        message: '',
        normal: '已加入任务队列，可点击查看！',
        failure: '任务失败，可点击查看！',
        success: '任务成功！',
        duplicate: '已在队列中！',
        show: false,
        timesign: null
      }
    }
  },
  watch: {
    'taskingList': {
      handler (data = []) {
        const backup = this.taskingListBackup || []
        // 防止无限循环
        if (data.length !== backup.length) {
          this.showNormalTips()
          this.heartbeat()
          this.syncTaskingListBak()
        }
      },
      immediate: true
    },
    'failureList.data': {
      handler (data = []) {
        const backup = this.failureList.backup || []
        // 防止无限循环
        if (data.length !== backup.length) {
          this.showFailureTips()
          this.syncFailureListBak()
        }
      },
      immediate: true
    }
  },
  computed: {
    taskingList () {
      const cache = this.$store.getters.getTaskingList
      // 防止无限循环
      if (cache && cache.length) {
        return cache
      } else {
        return this.$store.state.global.taskingList
      }
    }
  },
  methods: {
    ...mapActions(['pushTaskingList', 'spliceTaskingList']),
    delExportListItemConfirm (item) {
      this.$confirm({
        title: '提示',
        content: '文件正在运行中，是否删除这个任务？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          // 如果用户选择主动删除任务，那么，这里需要强调回收监听器，
          // 在其他情况下，this.$bus.$on 都是由其申请者确认回收
          this.$bus.$off(item.fileKey)
          this.delTaskListItem(item)
        }
      })
    },
    hasDuplicate (data = []) {
      let res = null
      for (let i = 0; i < data.length; i++) {
        const go = data[i]
        for (let j = data.length - 1; j > i; j--) {
          const back = data[j]
          if (go.fileName === back.fileName && j !== i) {
            res = back
            break
          }
        }
      }
      return res
    },
    showFailureTips (item = { fileName: '' }) {
      const data = this.failureList.data || []
      const backup = this.failureList.backup || []
      // 防止无限循环
      if (data.length > backup.length) {
        this.tipmodal.message = `${item.fileName}${this.tipmodal.failure}`
        this.showTipsHandler()
      }
    },
    showNormalTips (item = { fileName: '' }) {
      const data = this.taskingList || []
      const backup = this.taskingListBackup || []
      if (data.length > backup.length) {
        this.tipmodal.message = `${item.fileName}${this.tipmodal.normal}`
        this.showTipsHandler()
      }
    },
    showSuccessTips (item = { fileName: '' }) {
      this.tipmodal.message = `${item.fileName}${this.tipmodal.success}`
      this.$message.success(this.tipmodal.message)
    },
    showDuplicateTips (item = { fileName: '' }) {
      this.tipmodal.message = `${item.fileName}${this.tipmodal.duplicate}`
      this.$message.success(this.tipmodal.message)
    },
    showTipsHandler () {
      clearTimeout(this.tipmodal.timesign)
      this.tipmodal.timesign = null
      this.tipmodal.show = true
      this.tipmodal.timesign = setTimeout(() => {
        this.tipmodal.show = false
      }, 2000)
    },
    heartbeat () {
      clearTimeout(this.heartbeatState.timesign)
      this.heartbeatState.timesign = null
      this.heartbeatState.timesign = setTimeout(() => {
        if (this.taskingList && this.taskingList.length) {
          this.heartbeatQueueHandler().then(() => {
            return this.heartbeat()
          })
        }
      }, 1000)
    },
    addErrorItem (item, msg) {
      this.failureList.data.push({ ...item, msg })
    },
    delTaskListItem (item) {
      for (let i = 0; i < this.taskingList.length; i++) {
        const loopItem = this.taskingList[i]
        if (loopItem.fileKey === item.fileKey) {
          this.spliceTaskingList(i)
          break
        }
      }
    },
    delErrorListItem (item) {
      for (let i = 0; i < this.failureList.data.length; i++) {
        const loopItem = this.failureList.data[i]
        if (loopItem.fileKey === item.fileKey) {
          this.failureList.data.splice(i, 1)
          break
        }
      }
    },
    heartbeatQueueHandler () {
      return new Promise((resolve, reject) => {
        const taskingList = utils.clone(this.taskingList)
        taskingList.forEach(async (item, index) => {
          const apiFunc = this.apimap[item.type]
          if (!apiFunc) return reject(new Error(this.error))
          const res = await apiFunc(item).catch(() => {})
          if (utils.isBlob(res)) {
            // 如果直接返回流，就直接下载
            this.showSuccessTips(item)
            this.delTaskListItem(item)
            this.downloadByStream(res, item)
            this.$bus.$emit(item.fileKey, res, item)
          } else if (utils.isBackendResponse(res)) {
            // 如果返回后台数据，根据数据做判断
            if (res && res.code === 200) {
              if (res.data && utils.isValuable(res.data.fileStatus)) {
                // const statusmap = {
                //   '-1': '不存在',
                //   0: '失败',
                //   1: '成功',
                //   2: '处理中'
                // }
                if (res.data.fileStatus === -1 || res.data.fileStatus === 0) {
                  this.addErrorItem(item, res.message)
                  this.delTaskListItem(item)
                  this.$bus.$emit(item.fileKey, res, item)
                }
                if (res.data.fileStatus === 1) {
                  this.showSuccessTips(item)
                  this.delTaskListItem(item)
                  this.downloadByFileId(res, item)
                  this.$bus.$emit(item.fileKey, res, item)
                }
              } else {
                this.addErrorItem(item, res.message)
                this.delTaskListItem(item)
                this.$bus.$emit(item.fileKey, res, item)
              }
            } else {
              this.addErrorItem(item, res.message)
              this.delTaskListItem(item)
              this.$bus.$emit(item.fileKey, res, item)
            }
          } else {
            // 其他类型的数据，一律视作失败
            this.addErrorItem(item, res.message)
            this.delTaskListItem(item)
            this.$bus.$emit(item.fileKey, res, item)
          }
          if (index + 1 === taskingList.length) {
            // 一轮心跳完毕
            resolve()
          }
        })
      })
    },
    tryReloadFormErrorList (item, index) {
      this.pushTaskingList(item)
      this.delErrorListItem(item)
    },
    syncTaskingListBak () {
      this.taskingListBackup = utils.clone(this.taskingList)
    },
    syncFailureListBak () {
      this.failureList.backup = utils.clone(this.failureList.data)
    },
    downloadByFileId (res, item) {
      const fileId = res.data && res.data.fileUrl // 后端用fileUrl字段存储fileId
      api.gfsfiledownload(fileId, item.fileName)
    },
    downloadByStream (stream, item) {
      const link = document.createElement('a')
      const blob = new Blob([stream], { type: 'application/octet-stream' })
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', item.fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>
<style lang="less" scoped>
div.ant-list-item {
  padding-right: 12px;
  padding-left: 12px;
}
span.file-name {
  // padding-left: 1rem;
  line-height: 32px;
}
div.list-item {
  position: relative;
  width: 100%;
}
button.redo-icon {
  border: 0;
  box-shadow: none;
}
button.close-icon {
  border: 0;
  box-shadow: none;
  color: red;
  position: absolute;
  right: 0;
  top: 0;
}
button.fake-loading-icon {
  padding: 0 0.5rem !important;
  margin: 0 !important;
  border: 0 !important;
  background: none !important;
  box-shadow: none !important;
  cursor: default !important;
  svg {
    color: red;
  }
}
.task-hover-button {
  // position: fixed;
  // right: 150px;
  // bottom: 150px;
  border: 0;
  // width: 52px;
  // height: 52px;
  // overflow: hidden;
  // -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
  // box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
  // border-radius: 26px;
  text-align: center;
  // line-height: 52px;
  // -webkit-transition: all .3s ease-in-out;
  // transition: all .3s ease-in-out;
  /deep/button.ant-btn {
    width: 100%;
    height: 100%;
    border: 0;
    // border-radius: 100%;
    background: none;
    color: #2dc84d;
    /deep/i.anticon {
      font-size: 1.3rem;
    }
    span.desc {
      font-size: 0.8rem;
      position: relative;
      top: -1px;
    }
  }
}
</style>
