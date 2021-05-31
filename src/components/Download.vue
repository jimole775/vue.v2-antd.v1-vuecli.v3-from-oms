<template>
  <div class="default-style">
    <a-tooltip v-if="textlength" :title="fileName">
      <a class="href-style" :href="href">{{ fileName | ellipsisWords(textlength) }}</a>
    </a-tooltip>
    <a v-else class="href-style" :href="href">{{ fileName }}</a>
    &nbsp;
    <a
      v-if="fileName && supportSeries.test(fileName)"
      title="预览"
      class="preview-style"
      @click="getFilePreviewUrl"
    >
      <a-icon type="eye" />
    </a>
    <div
      v-if="showModal"
      class="modal-wrapper"
    >
      <div class="modal-mask" @click="showModal = false">
        <div class="modal-content-layout">
          <div class="modal-head">
            <button type="button" class="ant-btn modal-close-btn" @click="showModal = false"><span>x</span></button>
          </div>
          <iframe :src="previewUrl" class="iframe" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import utils from '@/utils'
import api from '@/api'
export default {
  name: 'Download',
  props: {
    value: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    textlength: {
      type: Number,
      default: 0
    }
  },
  computed: {
    currentDomain () {
      return this.$store.getters.getCurrentDomain()
    },
    href () {
      return `${this.currentDomain}${utils.encodeFileName(this.value)}?auth_token=oms:${this.xToken}`
    },
    fileName () {
      if (this.name) return this.name
      return this.value ? this.value.indexOf('/') !== -1 ? this.value.split('/')[this.value.split('/').length - 1] : '' : ''
    }
  },
  filters: {
    ellipsisWords: utils.ellipsisWords.bind(utils)
  },
  data () {
    return {
      showModal: false,
      url: '',
      previewUrl: '',
      xToken: getToken(),
      imgSeries: /\.(jpe?g|png|bmp|gif|tiff|webp)$/i,
      supportSeries: /\.(xlsx?|docx?|pdf|pptx?)$/i
    }
  },
  methods: {
    async getFilePreviewUrl () {
      const res = await api.getFilePreviewUrl({
        filePath: this.value,
        fileServer: this.href,
        fileName: this.fileName
      })
      if (res.code === 200) {
        this.previewUrl = res.data
        this.showModal = true
      } else {
        this.showModal = false
        this.$message.error('预览失败')
      }
    }
  }
}
</script>
<style lang="less">
.default-style {
  line-height: 1.5;
  margin-top: 0.5rem;
  word-break: break-word;
  a.href-style {
    color: #2DC84D;
  }
  a.preview-style {
    color: #868C97;
  }
}

.modal-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #3339;
  z-index: 9999;
}

.modal-mask{
  position: relative;
  width: 100%;
  height: 100%;
}

.modal-content-layout {
    width: 60%;
    height: 80%;
    position: absolute;
    border: 1px;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    overflow: hidden;
    background: #333;
}

button.modal-close-btn {
  position: absolute;
  right: 0;
  top: 0;
  background: #ff2525;
  color: #fff;
  border: none;
  border-radius: 0;
}

.iframe {
  border: 1px;width: 100%;height: 100%;
}
.modal-head {
  position: relative;
  width: 100%;
  height: 2rem;
}
</style>
