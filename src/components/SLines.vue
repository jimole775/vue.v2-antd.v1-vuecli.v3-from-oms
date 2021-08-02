<script>
import utils from '@/utils'
export default {
  functional: true,
  name: 'SLines',
  render (h, data) {
    const { len = 20, content = '', lineEnd = 'ellipsis' } = data.props || {}
    const sentences = getSentences(content)
    return (
      sentences.map((sentence) => {
        if (lineEnd === 'ellipsis') {
          // xxxxx..
          // xxxxx..
          return <SLine len={len} content={sentence} />
        } else if (lineEnd === 'break') {
          // xxxxxxx
          // xxx
          // xxxxxxx
          // xxxxx
          const lines = utils.breakSentence(sentence, len)
          return lines.map(line => {
            return <div>{ line }</div>
          })
        } else {
          return ''
        }
      })
    )
  }
}

function getSentences (content) {
  // 把所有换行符换成 _||_
  const splitSign = '_||_'
  content = content.replace(/(\r\n)/ig, splitSign)
  content = content.replace(/(\r)/ig, splitSign)
  content = content.replace(/(\n)/ig, splitSign)
  return content.split(splitSign)
}

</script>
