<template>
  <div>
    <a-modal
      title="编写函数"
      v-model="modal.show"
      width="60%"
      @ok="confirm"
    >
      <a-form :form="form">
        <a-row>
          <a-col :span="24">
            <a-form-item label="函数实体" :label-col="{span: 4}" :wrapper-col="{span: 20}">
              <code class="code-style">
                <SLines :value="defaultEntity.head" />
                <a-textarea
                  :rows="6"
                  v-decorator="['expression', {
                    initialValue: defaultEntity.body,
                    rules: [
                      { required: true, message: '请输入函数实体' }
                    ]
                  }]"
                />
                <SLines :value="defaultEntity.tail" />
              </code>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <span>
      { <a v-if="proxy.expression" @click="modal.show = true">......</a> }
    </span>
    <span style="padding: 0 0.5rem">
      <a v-if="proxy.expression" @click="reset"><a-icon type="redo" /></a>
      <a v-else @click="modal.show = true"><a-icon type="plus-circle" /></a>
    </span>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        entity: '', // 函数实体
        experession: '', // 表达式
        functionType: '', // arrow | normal
        arguments: [],
        fixedLines: {
          front: [],
          behind: []
        },
        defaultLines: {
          front: [],
          behind: []
        }
      })
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      modal: { show: false },
      defaultEntity: { head: '', body: '', tail: '' },
      proxy: {},
      form: this.$form.createForm(this)
    }
  },
  watch: {
    value: {
      handler (data) {
        this.defaultEntity.head = this.getHead(data)
        this.defaultEntity.body = this.getBody(data)
        this.defaultEntity.tail = this.getTail(data)
        this.proxy = this.$utils.clone(this.value)
        // defaultLines 属于单例模式，拼装完之后就置空
        if (this.proxy.defaultLines) {
          this.proxy.defaultLines.front = []
          this.proxy.defaultLines.behind = []
        }
      },
      immediate: true
    }
  },
  methods: {
    getBody (ast) {
      let res = ''
      const defaultLines = ast.defaultLines || {}
      const frontLines = defaultLines.front || []
      const behindLines = defaultLines.behind || []
      res += frontLines.join('\n')
      res += (ast.expression || '') + '\n'
      res += behindLines.join('\n')
      return res
    },
    getHead (ast) {
      let res = ''
      let args = ast.arguments || []
      if (ast.functionType === 'arrow' || !ast.functionType) {
        res = `(${args.join(', ')}) => {\n`
      }
      if (ast.functionType === 'normal') {
        res = `function anonymous (${args.join(', ')}) => {\n`
      }
      const fixedLines = ast.fixedLines || {}
      const frontLines = fixedLines.front || []
      res += frontLines.map(i => ('\xa0\xa0' + i)).join('\n') // 每一行默认添加两个空格
      console.log('getHead:', res)
      return res
    },
    getTail (ast) {
      let res = ''
      const fixedLines = ast.fixedLines || {}
      const behindLines = fixedLines.behind || []
      res += behindLines.map(i => ('\xa0\xa0' + i)).join('\n') // 每一行默认添加两个空格
      res += '\n}\n'
      console.log('getTail:', res)
      return res
    },
    reset () {
      this.proxy.expression = ''
      this.form.resetFields()
      this.$emit('change', this.$utils.clone(this.proxy))
    },
    confirm () {
      this.form.validateFields((err, values) => {
        if (err) {
          return false
        }
        this.modal.show = false
        this.proxy.expression = values.expression
        this.proxy.entity = this.getHead(this.proxy) + this.getBody(this.proxy) + this.getTail(this.proxy)
        this.$emit('change', this.$utils.clone(this.proxy))
      })
    }
  }
}

</script>
<style lang="less" scoped>
.object-ctrl {
  display: flex;
  padding: 4px;
  button {
    margin-left: 4px;
  }
}
.code-style {
  .line-multiple {
    padding: 0.5rem 0;
  }
}
</style>
