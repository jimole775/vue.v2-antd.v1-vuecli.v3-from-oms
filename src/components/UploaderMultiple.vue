<template>
  <div>
    <a-upload
      name="file"
      :multiple="true"
      :accept="supportSeries"
      :before-upload="beforeUploadResume"
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
        <Download :value="urlItem.path" />
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
  // model: {
  //   prop: 'value',
  //   event: 'change'
  // },
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
    },
    // 上传文件，并存储返回的url
    async beforeUploadResume (file, files) {
      const pass = utils.verifyUploadType(file.name, this.supportSeries)
      if (!pass) return false
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
            this.$emit('change', this.urlStore)
          }
          if (typeof res.data === 'object') {
            let obj = utils.splitUrl(res.data.url || res.data.filePath)
            this.urlStore = [...this.urlStore, obj]
            this.$message.success('文件上传成功')
            Vue.bus.emit('uploadDisabled', false)
            this.$emit('change', this.urlStore, res.data)
          }
        },
        () => {
          Vue.bus.emit('uploadDisabled', false)
          this.$emit('change', this.urlStore)
          this.$message.error('登录已过期,请重新登录!')
        }
      )
      return false
    }
  }
}
</script>
<style lang="less" scoped>
.file-close {
  position: absolute; right: 1rem; top: 0; color: #ff4545; padding: 0 0.3rem;
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
</style>
