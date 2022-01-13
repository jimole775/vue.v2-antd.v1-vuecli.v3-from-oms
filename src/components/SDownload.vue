<template>
  <div class="default-style">
    <span v-if="mode === 'text'">
      <a-tooltip v-if="len && fileData.fileName.length > len" :title="fileData.fileName">
        <a class="href-style" @click="download">{{ fileData.fileName | ellipsisSentence(len) }}</a>
      </a-tooltip>
      <a v-else class="href-style" @click="download">{{ fileData.fileName }}</a>
      &nbsp;
      <a
        v-if="fileData.fileName"
        title="预览"
        class="preview-style"
        @click="getFilePreviewUrl"
      >
        <a-icon type="eye" />
      </a>
    </span>
    <span v-if="mode === 'button'">
      <a-button
        ghost
        type="primary"
        @click="download"
      >
        <a-icon type="download" /> {{ buttonText }}
      </a-button>
    </span>
    <PreviewFrame :modal="modal" />
  </div>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
import PreviewFrame from '@/components/PreviewFrame'
const imgSeries = /\.(jpe?g|png|bmp|gif|tiff|webp)$/i
const docSeries = /\.(xlsx?|docx?|pdf|pptx?)$/i
export default {
  title: '下载',
  name: 'SDownload',
  forBuilder: true,
  components: { PreviewFrame },
  props: {
    value: {
      type: Object,
      default: undefined
    },
    len: {
      type: Number,
      default: 0
    },
    mode: {
      type: String,
      default: 'text' // 'text' || 'button'
    },
    buttonText: {
      type: String,
      default: '点击下载'
    },
    fileName: { // 定制下载的文件名
      type: String,
      default: ''
    }
  },
  watch: {
    value: {
      handler (val) {
        if (val) {
          this.modal.name = val['fileName'] || ''
          if (docSeries.test(this.modal.name)) {
            this.modal.type = 'doc'
          }
          if (imgSeries.test(this.modal.name)) {
            this.modal.type = 'img'
          }
          this.fileData = val
        }
      },
      deep: true,
      immediate: true
    }
  },
  // computed: {
  //   canPerview () {
  //     return docSeries.test(this.fileData.fileName)
  //   }
  // },
  filters: {
    ellipsisSentence: utils.ellipsisSentence.bind(utils)
  },
  data () {
    return {
      modal: {
        show: false,
        data: '',
        type: '',
        name: ''
      },
      fileData: {}
    }
  },
  methods: {
    download () {
      if (this.fileData['fileId']) {
        api.gfsfiledownload(this.fileData['fileId'], this.fileName)
      }
    },
    async getFilePreviewUrl () {
      if (this.fileData['fileId']) {
        this.modal.data = this.fileData['fileId']
        this.modal.show = true
      } else {
        this.modal.show = false
        this.$message.error('预览失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.default-style {
  line-height: 1.5;
  margin-top: 0.5rem;
  word-break: break-word;
  a.href-style {
    color: #2DC84D;
    text-decoration: underline;
  }
  a.preview-style {
    color: #868C97;
  }
}
</style>
