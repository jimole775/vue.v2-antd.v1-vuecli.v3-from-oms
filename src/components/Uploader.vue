<template>
  <a-upload
    name="file"
    :accept="supportSeries"
    :before-upload="beforeUploadResume"
    :file-list="resumeFileList"
    :remove="removeFile"
    @preview="previewFile"
  >
    <a-button
      ghost
      type="primary"
      :disabled="disabled"
    >
      <a-icon type="upload" /> {{ uploadTxt }}
    </a-button>
  </a-upload>
</template>

<script>
import api from '@/api'
import Vue from 'vue'
import utils from '@/utils'
import { getToken } from '@/utils/auth'

export default {
  name: 'Uploader',
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
    defaultValue: {
      type: String,
      default: ''
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
      // fileList: [],
      resumeFileList: [],
      currentFile: {},
      isRemove: false
    }
  },
  model: {
    prop: 'value',
    event: 'update'
  },
  computed: {
    uploadTxt () {
      return this.resumeFileList.length ? '重新上传' : this.text
    },
    currentDomain () {
      // '域名'
      return this.$store.getters.getCurrentDomain()
    },
    supportSeries () {
      return this.accept ? this.accept : this.$store.getters.getFileTypePermisson()
      // const dicts = this.$store.getters.getDictByGroupCode('upload_file_suffix_while_list')
      // const supports = dicts.map((item) => {
      //   return '.' + item.itemCode
      // })
      // return this.accept ? this.accept : supports.join(',')
    }
  },
  watch: {
    defaultValue: {
      handler (val) {
        if (val) {
          let fileVal = new File(
            ['sdf'],
            val.split('/')[val.split('/').length - 1],
            { type: 'upload' }
          )
          fileVal.uid = val
          this.resumeFileList = [fileVal]
          this.currentFile = utils.splitUrl(`${this.currentDomain}${val}`)
          this.$emit('update', this.currentFile)
        }
      },
      immediate: true
    }
  },
  methods: {
    // 移除文件
    removeFile (file) {
      this.fileId = ''
      this.resumeFileList = []
      this.isRemove = true
      this.$emit('change', [])
      this.$emit('update', [])
    },
    handleChange (info) {
      console.log('handleChange')
    },
    // 上传文件
    async beforeUploadResume (file, files) {
      const pass = utils.verifyUploadType(file.name, this.supportSeries)
      if (!pass) return false
      Vue.bus.emit('loading', true) // 显示正在上传
      Vue.bus.emit('uploadDisabled', true) // 提交按钮禁用
      this.resumeFileList = [file]
      let form = new FormData()
      form.append('file', file)
      form.append('auth_token', `oms:${getToken()}`)
      form.append('scene', `oms`)
      form.append('output', 'json')
      api[this.action](form, this.currentDomain, this.injectParams).then(
        res => {
          if (res.data === null || res.data === undefined) {
            this.resumeFileList = []
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
            this.resumeFileList = []
            Vue.bus.emit('uploadDisabled', false)
            Vue.bus.emit('loading', false)
            this.$emit('change', [])
            this.$emit('update', [])
          }
          if (typeof res.data === 'object') {
            let obj = utils.splitUrl(res.data.url || res.data.filePath)
            this.currentFile = obj
            Vue.bus.emit('uploadDisabled', false)
            Vue.bus.emit('loading', false)
            this.$message.success('文件上传成功')
            this.$emit('change', [{ fileName: obj.fileName, filePath: obj.path }], res.data)
            this.$emit('update', [{ fileName: obj.fileName, filePath: obj.path }])
          }
        },
        () => {
          this.resumeFileList = []
          Vue.bus.emit('uploadDisabled', false)
          Vue.bus.emit('loading', false)
          this.$emit('change', [])
          this.$emit('update', [])
          this.$message.error('登录已过期,请重新登录!')
        }
      )
      return false
    },
    // 下载简历附件
    previewFile (file) {
      api.newDownLoad(
        `${this.currentFile.domain}${utils.encodeFileName(this.currentFile.path)}?auth_token=oms:${getToken()}`
      )
    }
  }
}
</script>
