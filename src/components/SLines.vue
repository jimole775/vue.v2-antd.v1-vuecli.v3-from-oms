<script>
import utils from '@/utils'
export default {
  title: '多行文本',
  forBuilder: true,
  functional: true,
  name: 'SLines',
  props: {
    len: {
      type: Number,
      default: 20
    },
    value: {
      type: String,
      default: ''
    },
    lineEnd: {
      type: String,
      default: 'ellipsis'
    }
  },
  render (h, vm) {
    const { len = 20, value = '', lineEnd = 'ellipsis' } = vm.props || {}
    const style = vm.data.style || {}
    const text = utils.isValuable(value) ? value : getChildrenText(vm.children)
    if (utils.isNone(text)) return ''
    const sentences = getSentences(text)
    return (
      <div class="line-multiple" style={style}>
        {
          sentences.map((sentence) => {
            if (lineEnd === 'ellipsis') {
              // xxxxx..
              // xxxxx..
              return <SLine style={style} len={len} value={sentence} />
            } else if (lineEnd === 'break') {
              // xxxxxxx
              // xxx
              // xxxxxxx
              // xxxxx
              const lines = utils.breakSentence(sentence, len)
              return lines.map(line => {
                return <div class="line-multiple">{ line }</div>
              })
            } else {
              return ''
            }
          })
        }
      </div>
    )
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
