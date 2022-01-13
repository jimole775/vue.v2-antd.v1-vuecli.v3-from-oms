<script>
import utils from '@/utils'
export default {
  title: '单行文本',
  forBuilder: true,
  functional: true,
  name: 'SLine',
  props: {
    len: {
      type: Number,
      default: 10
    },
    value: {
      type: String,
      default: ''
    },
    lineEnd: {
      type: String,
      default: 'ellipsis'
    },
    rows: {
      type: Number,
      default: 3
    }
  },
  render (h, vm) {
    const { value = '', len = 10, lineEnd = 'ellipsis', rows = 3 } = vm.props || {}
    const style = vm.data.style || {}
    const text = utils.isValuable(value) ? value : getChildrenText(vm.children)
    if (utils.isNone(text)) return ''
    let sentence = ''
    if (lineEnd === 'break') {
      sentence = utils.breakSentence(text, len, rows)
    }
    if (lineEnd === 'ellipsis') {
      sentence = utils.ellipsisSentence(text, len)
    }
    if (utils.isString(sentence)) {
      if (text === sentence) {
        return <div class="line-standard" style={style}>{ text }</div>
      } else {
        return (
          <a-tooltip title={text}>
            <div class="line-standard" style={style}>{ sentence }</div>
          </a-tooltip>
        )
      }
    } else if (utils.isArray(sentence)) {
      return (
        <a-tooltip title={text}>
          <div class="line-multiple" style={style}>
            {
              sentence.map((line) => {
                return <div>{ line }</div>
              })
            }
          </div>
        </a-tooltip>
      )
    } else {
      return <div class="line-standard" style={style}>{ text }</div>
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

</script>
