<script>
import utils from '@/utils'
export default {
  functional: true,
  name: 'SLine',
  render (h, data) {
    const { content = '', len = 10, lineEnd = 'ellipsis', rows = 3 } = data.props || {}
    if (!content) return ''
    let sentence = ''
    if (lineEnd === 'break') {
      sentence = utils.breakSentence(content, len, rows)
    } else {
      sentence = utils.ellipsisSentence(content, len)
    }
    if (utils.isString(sentence)) {
      if (content === sentence) {
        return <div>{ content }</div>
      } else {
        return (
          <a-tooltip title={content}>
            <div class="overHidden3">{ sentence }</div>
          </a-tooltip>
        )
      }
    } else if (utils.isArray(sentence)) {
      return (
        <a-tooltip title={content}>
          <div class="overHidden3">
            {
              sentence.map((line) => {
                return <div>{ line }</div>
              })
            }
          </div>
        </a-tooltip>
      )
    } else {
      return <div>{ content }</div>
    }
  }
}
</script>
