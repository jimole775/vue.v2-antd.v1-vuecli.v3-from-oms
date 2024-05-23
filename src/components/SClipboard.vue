<script>
import Clipboard from 'clipboard'
export default {
  title: '剪切按钮',
  name: 'SClipboard',
  enumerated: true,
  functional: true,
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    clipEvent (e) {
      let target = e.currentTarget || e.target
      let className = target.className || ''
      let classSelect = '.' + className.split(' ').shift()
      let clipboard = new Clipboard(classSelect)
      clipboard.on('success', (e) => {
        e.clearSelection()
        clipboard.off('success')
        clipboard = null
        this.$message.success('复制成功')
      })
      clipboard.on('error', (e) => {
        this.$message.error('复制失败')
        clipboard.off('error')
        clipboard = null
      })
    }
  },
  render (h) {
    const clsName = 'clipboard-btn-' + new Date().getTime()
    return <a
      class={clsName}
      data-clipboard-text={this.value}
      onClick={this.clipEvent}
    >
      <a-tooltip title="点击复制">
        <a-icon type="copy" />
      </a-tooltip>
    </a>
  }
}
</script>
