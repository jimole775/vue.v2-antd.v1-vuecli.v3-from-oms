<script>
import utils from '@/utils'
export default {
  functional: true,
  name: 'EllipsisTableCell',
  render (h, data) {
    const { text = '', len = 7 } = data.props || {}
    const shortText = utils.ellipsisSentence(text, len)
    if (text.length > shortText.length) {
      return (
        <a-tooltip title={text}>
          <div class="overHidden3">{ shortText }</div>
        </a-tooltip>
      )
    } else {
      return (
        <div>{ text }</div>
      )
    }
  }
}
</script>
