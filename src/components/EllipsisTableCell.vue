<script>
import utils from '@/utils'
export default {
  functional: true,
  name: 'EllipsisTableCell',
  render (h, data) {
    const { text = '', len = 7 } = data.props || {}
    return (
      <a-tooltip title={text}>
        <div class="overHidden3">{ utils.ellipsisWords(text, len) }</div>
      </a-tooltip>
    )
  }
}
</script>
