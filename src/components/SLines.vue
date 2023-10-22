<script>
import utils from '@/utils'
export default {
  title: '多行文本',
  enumerated: true,
  functional: true,
  name: 'SLines',
  // props提供给componentSelect进行枚举显示
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
    },
    rows: {
      type: Number,
      default: 0
    },
    copy: {
      type: Boolean,
      default: false
    }
  },
  render (h, vm) {
    const { len = 20, value = '', lineEnd = 'ellipsis', rows = 0, copy = false } = vm.props || {}
    const style = vm.data.staticStyle || {}
    const className = vm.data.staticClass || ''
    const text = utils.isValuable(value) ? value : getChildrenText(vm.children)
    if (utils.isNone(text)) return ''
    let dataSentences = getSentences(text)
    let viewSentences = rows ? dataSentences.filter((i, ii) => ii < rows) : dataSentences
    return (
      <div class="line-multiple">
        {
          viewSentences.map((sentence, index) => {
            if (lineEnd === rows - 1) {
              // 如果规定了显示行数，那么就对最后一行进行显示处理
              const endline = utils.appandEllipsis(utils.ellipsisSentence(sentence, len))
              const title = dataSentences.join('\n')
              return <div class={className} style={style}>
                <a-tooltip title={title}>
                  <span>{ endline }&nbsp;</span>
                </a-tooltip>
                { copy && <SClipboard value={title} /> }
              </div>
            } else {
              if (lineEnd === 'ellipsis') {
                // xxxx...
                // xxxx...
                return <SLine class={className} style={style} len={len} value={sentence} />
              } else if (lineEnd === 'break') {
                // xxxxxxx
                // xxx
                // xxxxxxx
                // xxxxx
                const lines = utils.breakSentence(sentence, len)
                return <div class={className} style={style}> {
                  lines.map(line => <div>{ line }</div>)
                }</div>
              } else {
                return ''
              }
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

function getSentences (content = '') {
  if (utils.isNone(content)) return ''
  return content.split(/\r?\n|\r/)
}

</script>
