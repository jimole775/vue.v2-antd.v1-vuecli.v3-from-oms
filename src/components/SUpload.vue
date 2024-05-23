<template>
  <div :class="['uploader-base', flow === 'v' ? 'vertical-bar' : 'horizontal-bar']">
    <a-upload
      name="file"
      :multiple="multiple"
      :accept="supportSeries"
      :before-upload="beforeUploadEvent"
      :file-list="fileList"
      :show-upload-list="false"
    >
      <slot v-if="$slots.default" :disabled="disabled" />
      <a-button v-else type="primary" :disabled="disabled">
        <a-icon type="upload" /> {{ buttonText }}
      </a-button>
    </a-upload>
    <div
      v-if="isCanDownload"
      class="download-bar"
      :style="{ margunLeft: flow === 'h' ? '0.5rem' : '' }"
    >
      <template v-for="(fileItem, index) in fileDataStore">
        <div class="download-item" :key="index">
          <a-icon class="file-icon" type="paper-clip" />
          <SDownload class="file-content" :len="len" :value="fileItem" />
          <a v-if="!disabled" class="file-close" @click="() => remove(fileItem)">x</a>
        </div>
      </template>
    </div>
    <div v-if="$slots.tips || $props.tips || $props.accept" class="upload-tips">
      <div v-if="$props.accept">格式支持：{{ $props.accept }}</div>
      <div v-else-if="$props.tips">{{ $props.tips }}</div>
      <slot v-else name="tips" />
    </div>
    <div v-if="uploadWarning" class="upload-warning">{{ uploadWarning }}</div>
  </div>
</template>

<script>
import api from '@/api'
import utils from '@/utils'
// import loading from '@/utils/loading'
import { getToken } from '@/utils/auth'

export default {
  title: '上传',
  name: 'SUpload',
  enumerated: true,
  props: {
    injectParams: {
      type: Object,
      default: null
    },
    action: {
      type: String,
      default: 'gfsfileupload'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Array, Object],
      default: undefined
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: ''
    },
    len: {
      type: Number,
      default: 16
    },
    flow: {
      type: String,
      default: 'v'
    },
    tips: {
      type: String,
      default: ''
    },
    validator: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      fileList: [],
      uploadWarning: '',
      fileDataStore: []
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  computed: {
    supportSeries () {
      return this.accept ? this.accept : this.$store.getters.getFileTypePermisson()
    },
    isCanDownload () {
      return !!this.fileDataStore.find(item => item.fileId)
    },
    showButtonText () {
      if (this.buttonText) return this.buttonText
      if (this.fileDataStore.length) {
        return this.multiple ? '追加文件' : '上传文件'
      } else {
        return '上传文件'
      }
    }
  },
  watch: {
    value: {
      handler (val) {
        // 暂时不处理旧接口数据
        if (utils.isString(val)) return false
        // v-model 绑定的对象被清空时，对应的数据也需要清空
        if (utils.isNone(val)) {
          this.fileDataStore = []
          this.fileList = []
        } else {
          this.defaultSet(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    // 移除文件
    remove (file) {
      for (let index = 0; index < this.fileDataStore.length; index++) {
        const item = this.fileDataStore[index]
        if (file.fileId === item.fileId) {
          this.reduce(index)
          break
        }
      }
      this.update()
    },
    compatible (item) {
      // 旧接口兼容
      item.fileId = item.fileId ? item.fileId : item.filePath
    },
    defaultSet (val) {
      this.compatible(val)
      if (utils.isArray(val)) {
        this.fileDataStore = val
      } else {
        this.$set(this.fileDataStore, 0, val)
      }
    },
    reduce (index) {
      this.fileList.splice(index, 1)
      this.fileDataStore.splice(index, 1)
    },
    uprise (data, file) {
      this.compatible(data)
      if (this.multiple) {
        const listLen = this.fileList.length
        const storeLen = this.fileDataStore.length
        this.$set(this.fileList, listLen, file)
        this.$set(this.fileDataStore, storeLen, data)
      } else {
        this.$set(this.fileList, 0, file)
        this.$set(this.fileDataStore, 0, data)
      }
    },
    update () {
      if (this.multiple) {
        this.$emit('change', this.fileDataStore, this.fileList)
      } else {
        this.$emit('change', this.fileDataStore[0], this.fileList[0])
      }
      this.uploadWarning = ''
    },
    async execCustomValidator (file, files, vm) {
      let isPass = true
      if (this.$props.validator) {
        const validatedRes = await this.$props.validator(file, files, vm)
        if (utils.isString(validatedRes) && validatedRes.length) {
          this.uploadWarning = validatedRes
          isPass = false
        }
        if (utils.isBoolean(validatedRes)) {
          isPass = validatedRes
          this.uploadWarning = ''
        }
      } else {
        isPass = true
        this.uploadWarning = ''
      }
      return isPass
    },
    // 上传文件，并存储返回的url
    async beforeUploadEvent (file, files) {
      const pass = utils.verifyUploadType(file.name, this.supportSeries)
      const customPass = await this.execCustomValidator(file, files, this)
      if (pass && customPass) {
        this.$loading.mounted() // 显示正在上传
        const form = this.extendsForm(file)
        api[this.action](form, this.injectParams).then(
          (res) => this.successHandler(res, file),
          this.failerHandler
        )
      }
      return Promise.reject(new Error())
    },
    successHandler (res, file) {
      this.$loading.unmount()
      if (res.data === null || res.data === undefined) {
        res.message && this.$modal.warning({
          title: '提示',
          content: res.message
        })
        return false
      }
      if (utils.isString(res.data)) {
        this.$message.warning(
          `文件上传失败 ${
            res.data.split(':')[res.data.split(':').length - 1]
          }`
        )
      }
      if (utils.isObject(res.data) || utils.isArray(res.data)) {
        this.$message.success('文件上传成功')
        this.uprise(res.data, file)
        this.update()
      }
    },
    failerHandler (res) {
      this.$loading.unmount()
      this.$modal.error({ title: '上传失败', content: res.message })
    },
    extendsForm (file) {
      const form = new FormData()
      form.append('file', file)
      form.append('auth_token', `oms:${getToken()}`)
      form.append('scene', `oms`)
      form.append('output', 'json')
      if (this.injectParams) {
        Object.keys(this.injectParams).forEach((key) => {
          form.append(key, this.injectParams[key])
        })
      }
      return form
    }
  }
}
</script>
<style lang="less" scoped>
.uploader-base {
  transition: height 0.3s;
}
.download-bar {
  .download-item {
    height: 24px;
    line-height: 24px;
    transition: height 0.3s;
    padding: 0;
    margin: 0;
    display: flex;
    &:hover {
      background-color: #efefef;
      .file-close {
        visibility: visible;
      }
    }
    /deep/ .default-style {
      margin: 0;
      padding: 0;
      line-height: 24px;
      &:hover {
        background-color: #efefef;
      }
    }
    .file-icon {
      font-size: 14px;
      line-height: 2;
      color: rgba(0, 0, 0, 0.45);
    }
    .file-content {
      font-size: 14px;
    }
    .file-close {
      color: #ff4545;
      margin: 0 1rem;
      padding: 0 1rem;
      font-size: 14px;
      line-height: 1.5;
      visibility: hidden;
      &:hover {
        color: #ff9191;
      }
    }
  }
}
.vertical-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
}
.horizontal-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  .upload-warning {
    padding-left: 1rem;
  }
  .upload-tips {
    padding-left: 1rem;
  }
}
.upload-warning {
  color: #f5222d;
  padding-top: 2px;
  line-height: 1.25;
}
.upload-tips {
  font-size: 0.8rem;
  line-height: 1.25;
  color: #999;
}
</style>
