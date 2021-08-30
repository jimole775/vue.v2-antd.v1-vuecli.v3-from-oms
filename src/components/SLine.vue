<script>
import utils from '@/utils'
export default {
  functional: true,
  name: 'SLine',
  render (h, data) {
    const { value = '', len = 10, lineEnd = 'ellipsis', rows = 3 } = data.props || {}
    if (!value) return ''
    let sentence = ''
    if (lineEnd === 'break') {
      sentence = utils.breakSentence(value, len, rows)
    } else {
      sentence = utils.ellipsisSentence(value, len)
    }
    if (utils.isString(sentence)) {
      if (value === sentence) {
        return <div>{ value }</div>
      } else {
        return (
          <a-tooltip title={value}>
            <div class="overHidden3">{ sentence }</div>
          </a-tooltip>
        )
      }
    } else if (utils.isArray(sentence)) {
      return (
        <a-tooltip title={value}>
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
      return <div>{ value }</div>
    }
  }
}
</script>
