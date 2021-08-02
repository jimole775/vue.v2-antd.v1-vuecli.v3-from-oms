<template>
  <div class="uploader-base">
    <a-upload
      name="file"
      :multiple="true"
      :accept="supportSeries"
      :before-upload="beforeUploadEvent"
      :file-list="fileList"
      :remove="removeFile"
      :show-upload-list="false"
      @preview="previewFile"
    >
      <a-button
        ghost
        type="primary"
        :disabled="disabled"
      >
        <a-icon type="upload" /> {{ text }}
      </a-button>
    </a-upload>
    <template v-for="(urlItem, index) in urlStore">
      <div class="download-bar" :key="index">
        <a-icon class="file-icon" type="paper-clip" />
        <DownLoadFile class="file-content" :value="urlItem.path" />
        <a class="file-close" @click="() => removeUrl(urlItem)">x</a>
      </div>
    </template>
  </div>
</template>

<script>
import api from '@/api'
import Vue from 'vue'
import utils from '@/utils'
import { getToken } from '@/utils/auth'

export default {
  name: 'UploaderMultiple',
  props: {
    injectParams: {
      type: Object,
      default: null
    },
    action: {
      type: String,
      default: 'newUpload'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => []
    },
    defaultFiles: {
      type: Array,
      default: () => []
    },
    accept: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: '上传文件'
    }
  },
  data () {
    return {
      headers: {
        authorization: 'authorization-text'
      },
      fileList: [],
      urlStore: []
    }
  },
  model: {
    prop: 'value',
    event: 'update'
  },
  computed: {
    currentDomain () {
      return this.$store.getters.getCurrentDomain()
    },
    supportSeries () {
      return this.accept ? this.accept : this.$store.getters.getFileTypePermisson()
    }
  },
  watch: {
    value: {
      handler (val) {
        // v-model 绑定的对象被清空时，对应的数据也需要清空
        if (!val || (val && val.length === 0)) {
          this.urlStore = []
          this.fileList = []
        }
      }
    },
    // 默认赋值，使用defaultFiles属性，
    // 不能使用value属性，因为这个组件的输入输出的类型是不一样的
    // 1. 输入：['./xxx/xxx.xx', './xxx/xxx.xx']
    // 2. 输出：[{}，{}]
    defaultFiles: {
      handler (vals) {
        if (vals && vals.length) {
          this.urlStore = []
          this.fileList = []
          vals.forEach((item) => {
            let fileVal = new File(
              ['sdf'],
              item.split('/')[item.split('/').length - 1],
              { type: 'upload' }
            )
            fileVal.uid = item
            this.fileList.push(fileVal)
            this.urlStore.push(utils.splitUrl(`${this.currentDomain}${item}`))
          })
          this.$emit('update', this.urlStore)
        }
      },
      immediate: true
    }
  },
  methods: {
    // 下载附件
    previewFile (file) {
      this.urlStore.forEach((item) => {
        if (file.name === item.fileName) {
          api.newDownLoad(`${item.domain}${utils.encodeFileName(item.path)}?auth_token=oms:${getToken()}`)
        }
      })
    },
    // 通过url, 移除文件
    removeUrl (urlItem) {
      for (let index = 0; index < this.urlStore.length; index++) {
        const item = this.urlStore[index]
        if (urlItem.path === item.path) {
          this.fileList.splice(index, 1)
          this.urlStore.splice(index, 1)
          break
        }
      }
      this.$emit('change', this.urlStore)
      this.$emit('update', this.urlStore)
    },
    // 通过file, 移除文件
    removeFile (file) {
      for (let index = 0; index < this.urlStore.length; index++) {
        const item = this.urlStore[index]
        if (file.name === item.fileName) {
          this.fileList.splice(index, 1)
          this.urlStore.splice(index, 1)
          break
        }
      }
      this.$emit('change', this.urlStore)
      this.$emit('update', this.urlStore)
    },
    // 上传文件，并存储返回的url
    async beforeUploadEvent (file, files) {
      const pass = utils.verifyUploadType(file.name, this.supportSeries)
      if (!pass) return false
      Vue.bus.emit('loading', true) // 显示正在上传
      Vue.bus.emit('uploadDisabled', true) // 提交按钮禁用
      this.fileList = [...this.fileList, file]
      let form = new FormData()
      form.append('file', file)
      form.append('auth_token', `oms:${getToken()}`)
      form.append('scene', `oms`)
      form.append('output', 'json')
      api[this.action](form, this.currentDomain, this.injectParams).then(
        res => {
          if (res.data === null || res.data === undefined) {
            res.message && this.$modal.warning({
              title: '提示',
              content: res.message
            })
            return false
          }
          if (typeof res.data === 'string') {
            this.$message.warning(
              `文件上传失败 ${
                res.data.split(':')[res.data.split(':').length - 1]
              }`
            )
            Vue.bus.emit('uploadDisabled', false)
            Vue.bus.emit('loading', false)
            this.$emit('change', this.urlStore)
            this.$emit('update', this.urlStore)
          }
          if (typeof res.data === 'object') {
            // 处理res.data  文件地址 http://dfs.test-o2.adc.com/group1/default/20191111/14/25/6/rBAoMF26VQGAABbqAA3VOd-tjko271.jpg
            let obj = utils.splitUrl(res.data.url || res.data.filePath)
            this.urlStore = [...this.urlStore, obj]
            this.$message.success('文件上传成功')
            Vue.bus.emit('uploadDisabled', false)
            Vue.bus.emit('loading', false)
            this.$emit('change', this.urlStore, res.data)
            this.$emit('update', this.urlStore)
          }
        },
        () => {
          Vue.bus.emit('uploadDisabled', false)
          Vue.bus.emit('loading', false)
          this.$emit('change', this.urlStore)
          this.$emit('update', this.urlStore)
          this.$message.error('登录已过期,请重新登录!')
        }
      )
      return false
    }
  }
}
</script>
<style lang="less" scoped>
.file-icon {
  font-size: 14px;
  left: 0.4rem;
  top: 0.4rem;
  position: absolute;
  color: rgba(0, 0, 0, 0.45);
}
.file-content {
  font-size: 14px;
  text-indent: 1.5rem;
}
.file-close {
  position: absolute;
  right: 1rem;
  top: -1px;
  color: #ff4545;
  padding: 0 0.3rem;
  font-size: 13px;
  &:hover {
    background-color: #efefef;
  }
}

.download-bar {
  line-height: 1.5rem;
  position: relative;
  /deep/ .default-style {
    margin: 0;
    line-height: 1.5rem;
    &:hover {
      background-color: #efefef;
    }
  }
}

.uploader-base {
  transition: height 0.3s;
}
</style>
