<script>
import Clipboard from 'clipboard'
import Vue from 'vue'
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
  render (h, vm) {
    const { value = '' } = vm.props || {}
    const clsName = 'clipboard-btn-' + new Date().getTime()
    return <a
      class={clsName}
      data-clipboard-text={value}
      onClick={clipEvent}
    >
      <a-tooltip title="点击复制">
        <a-icon type="copy" />
      </a-tooltip>
    </a>
  }
}
function clipEvent (e) {
  let target = e.currentTarget || e.target
  let className = target.className || ''
  let classSelect = '.' + className.split(' ').shift()
  let clipboard = new Clipboard(classSelect)
  clipboard.on('success', function (e) {
    e.clearSelection()
    clipboard.off('success')
    clipboard = null
    Vue.prototype.$message.success('复制成功')
  })
}
</script>
