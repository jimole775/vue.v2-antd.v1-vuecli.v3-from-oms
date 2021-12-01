<script>
import utils from '@/utils'
export default {
  name: 'SLines',
  props: {
    value: {
      type: String,
      default: ''
    },
    len: {
      type: Number,
      default: 20
    },
    lineEnd: {
      type: String,
      default: 'ellipsis'
    },
    rows: {
      type: Number,
      default: 0
    }
  },
  render (h) {
    const text = this.value || getChildrenText(this.$children)
    if (utils.isNone(text)) return ''
    const sentences = getSentences(text)
    if (sentences.length === 1) {
      if (this.rows > 0) {
        return <SLine len={this.len} value={sentences[0]} line-end={'break'} rows={this.rows} />
      } else {
        return <SLine len={this.len} value={sentences[0]} line-end={'ellipsis'} />
      }
    } else {
      let multiSentences = sentences
      // 裁剪多余行
      if (this.rows > 0 && sentences.length > this.rows) {
        multiSentences = sentences.slice(0, this.rows)
      }
      multiSentences = multiSentences.map((sentence) => {
        if (this.lineEnd === 'ellipsis') {
          // xxxxx..
          // xxxxx..
          return <SLine len={this.len} value={sentence} />
        } else if (this.lineEnd === 'break') {
          // xxxxxxx
          // xxx
          // xxxxxxx
          // xxxxx
          return utils.breakSentence(sentence, this.len).map(line => {
            return <div>{ line }</div>
          })
        } else {
          return ''
        }
      })
      // 增加查看全部文本的锚点
      if (this.rows > 0 && sentences.length > this.rows) {
        multiSentences.push(
          <div>
            <a style="color: inherit" onClick={ () => this.$modal.warning({
              title: '提示',
              content: sentences.join('\r\n')
            })}>...</a>
          </div>
        )
      }
      return (
        <div class="line-multiple">
          {
            multiSentences
          }
        </div>
      )
    }
  }
}

function getChildrenText (children = []) {
  let res = ''
  children.forEach((vnode) => {
    if (vnode.text) {
      res += vnode.text + '\n'
    }
  })
  return res
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
