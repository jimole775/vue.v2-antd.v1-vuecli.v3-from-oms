<template>
  <span class="docs-viewer">
    <span class="layout">
      <a @click="open">
        <slot />
      </a>
      <a-tooltip class="icon-button" title="下载为网页">
        <a @click="downloadForHtm"><a-icon type="html5" /></a>
      </a-tooltip>
      <a-tooltip class="icon-button" title="下载为excel">
        <a @click="downloadForXls"><a-icon type="file-excel" /></a>
      </a-tooltip>
      <a-tooltip class="icon-button" title="下载为图片">
        <a @click="downloadForImg"><a-icon type="file-imgage" /></a>
      </a-tooltip>
    </span>
    <a-modal
      v-model="show"
      :width="modalWidth"
      :footer="false"
    >
      <template slot="title">
        <div class="modal-title">
          {{ htmlTitle }}
          <a-tooltip class="icon-button" title="下载为网页">
            <a @click="downloadForHtm"><a-icon type="html5" /></a>
          </a-tooltip>
          <a-tooltip class="icon-button" title="下载为excel">
            <a @click="downloadForXls"><a-icon type="file-excel" /></a>
          </a-tooltip>
          <a-tooltip class="icon-button" title="下载为图片">
            <a @click="downloadForImg"><a-icon type="file-imgage" /></a>
          </a-tooltip>
        </div>
      </template>
      <div v-if="htmlContent" id="excelRender" v-html="htmlContent" />
    </a-modal>
  </span>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
// 这两个包可以通过 CDN 异步加载
import html2canvas from 'html2canvas'
import { read, writeFile } from 'xlsx/dist/xlsx.full.min'
let cache = {
  api: '',
  params: '',
  htmlTitle: '',
  modalWidth: '',
  htmlContent: ''
}
const defaultWidth = '600'
const defaultUnit = 'pt'
export default {
  name: 'DocsViewer',
  props: {
    api: {
      type: String,
      defualt: ''
    },
    params: {
      type: Object | Number | String
    }
  },
  data () {
    return {
      show: false,
      modalWidth: defaultWidth,
      htmlTitle: '',
      htmlContent: ''
    }
  },
  computed: {
    isExcel () {
      // 如果 body 的第一个子元素就是 table, 那么可以判断当前文档为 excel 表格
      return /<body\s[\w\d\s'"\=\-;:.\.]*?>\s*?<table/.test(this.htmlContent)
    }
  },
  watch: {
    show: {
      handler (show) {
        if (show) {
          if (this.isDuplicateCall()) {
            this.htmlTitle = cache.htmlTitle
            this.modalWidth = cache.modalWidth
            this.htmlContent = cache.htmlContent
          } else {
            this.fetchor()
          }
        } else {
          // 清空为了避免 htmlContent 中内嵌的公共 style 会影响其他同名样式
          this.htmlTitle = ''
          this.htmlContent = ''
        }
      },
      immediate: true
    }
  },
  methods: {
    open () {
      this.show = true
    },
    downloadForImg () {
      const doc = document.querySelector('#excelRender')
      const node = this.$slots.default[0] || {}
      const fileName = node.text || '说明文档'
      html2canvas(doc).then((canvas) => {
        utils.triggerDownloadLink(canvas.toDataURL('image/png', fileName + '.png'))
      })
    },
    downloadForXls () {
      const node = this.$slots.default[0] || {}
      const fileName = node.text || '说明文档'
      writeFile(read(this.htmlContent, { type: 'string' }), fileName + '.xlsx')
    },
    async downloadForHtm () {
      if (!this.htmlContent) await this.fetchor()
      const node = this.$slots.default[0] || {}
      const fileName = utils.trim(node.text || '说明文档')
      const blob = new Blob([this.htmlContent], { type: 'application/octet-stream' })
      utils.triggerDownloadLink(URL.createObjectURL(blob), fileName + '.html')
    },
    async fetchor () {
      const { api: apiName, params } = this.$props
      const res = await api[apiName](params || 0)
      if (res.code === 200) {
        this.htmlTitle = res.data.name
        this.htmlContent = this.adjustCharset(this.adjustTableStyle(res.data.value))
        this.modalWidth = this.isExcel ? this.getExcelWidth() : this.getWorkDocsWidth()
      } else {
        this.$modal.warning({
          title: '提示',
          content: res.message
        })
      }
      this.cacheLocalData()
      return Promise.resolve()
    },
    cacheLocalData () {
      const { api: apiName, params } = this.$props
      cache.api = apiName
      cache.params = params || 0
      cache.htmlTitle = this.htmlTitle
      cache.modalWidth = this.modalWidth
      cache.htmlContent = this.htmlContent
    },
    isDuplicateCall () {
      const { api: apiName, params } = this.$props
      if (utils.isValuable(apiName)) {
        const atulyParams = params || 0
        return (cache.api === apiName && toString(atulyParams) === toString(cache.params))
      }
    },
    adjustCharset (htmlString = '') {
      // content="text/html; charset=gb2312"
      return htmlString.replace(/charset=([\w\d\-\_]*?)"/, 'charset=utf-8"')
    },
    adjustTableStyle (htmlString = '') {
      // 强制给表格加上 flex 布局模式，以防【table-layout: ?fixed;】让表格破坏盒子结构
      return htmlString.replace(/<table(.*?)(table-layout: ?fixed;)/, '<table$1$2display:flex;flex-wrap:wrap;')
    },
    getExcelWidth () {
      const htmlString = this.htmlContent || ''
      let tableFirstTag = htmlString.match(/<table.*?>/)
      tableFirstTag = tableFirstTag ? tableFirstTag[0] : ''
      let style = tableFirstTag.match(/\bstyle=.*?width:.*?;/)
      style = style ? style[0] : ''
      let width = style.replace(/\bstyle=.*?width:(\d+\.*\d*)(\w+);/, '$1')
      let unit = style.replace(/\bstyle=.*?width:(\d+\.*\d*)(\w+);/, '$2')
      return (Number.parseFloat(width) + 22) + unit
    },
    getWorkDocsWidth () {
      const htmlString = this.htmlContent || ''
      const defWidth = defaultWidth + defaultUnit
      const matched = htmlString.match(/@page\s?[\w\d\-\_\s]+\{\s?.*[;\s]size:(.*?);/i)
      if (!matched) return defWidth
      const correctContent = matched[1]
      if (!correctContent) return defWidth
      const [width] = correctContent.split(' ')
      return width || defWidth
    }
  }
}
function toString (d) {
  utils.isArray(d) && (d = d.toString())
  utils.isObject(d) && (d = JSON.stringify(d))
  return d
}
</script>
<style lang="less" scoped>
.modal-title {
  font-size: 1rem;
}
.icon-button {
  margin-left: 0.5rem;
}
.docs-viewer {
  display: inline-block;
  .layout {
    display: flex;
  }
}
#excelRender {
  /deep/ table thead tr th,
  /deep/ table tbody tr td {
    white-space: normal;
  }
}
</style>
