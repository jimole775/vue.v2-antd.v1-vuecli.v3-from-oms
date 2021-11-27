<script>
import utils from '@/utils'
export default {
  name: 'SLine',
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
  methods: {
    showmodal (text) {
      this.$modal.warning({
        title: '提示',
        content: text
      })
    },
    getChildrenText (children = []) {
      let res = ''
      children.forEach((vnode) => {
        if (vnode.text) {
          res += vnode.text + '\n'
        }
      })
      return res
    }
  },
  render (h) {
    const text = this.value || this.getChildrenText(this.$children)
    if (utils.isNone(text)) return ''
    let sentence = ''
    if (this.lineEnd === 'break') {
      sentence = utils.breakSentence(text, this.len, this.rows)
    }
    if (this.lineEnd === 'ellipsis') {
      sentence = utils.ellipsisSentence(text, this.len)
    }
    // 只有一行
    if (utils.isString(sentence)) {
      if (/(\.\.\.)$/.test(sentence)) {
        // 有省略
        return <div class="line-standard">
          <a style="color: inherit" onClick={() => {
            this.showmodal(text)
          }}>{ sentence }</a>
        </div>
      } else {
        // 无省略
        return <div class="line-standard">{ sentence }</div>
      }
    } else if (utils.isArray(sentence)) {
      // 多行
      return (
        <div class="line-multiple">
          {
            sentence.map((line) => {
              if (/(\.\.\.)$/.test(line)) {
                // 有省略
                return <div>
                  <a style="color: inherit" onClick={() => {
                    this.showmodal(text)
                  }}>{ line }</a>
                </div>
              } else {
                // 无省略
                return <div>{ line }</div>
              }
            })
          }
        </div>
      )
    } else {
      return <div class="line-standard">{ sentence }</div>
    }
  }
}

</script>
