<script>
import utils from '@/utils'
import AddStepNode from '../modals/add-step-node'
function countNodeWidth (str = '') {
  // 40: icon宽度
  // 14：字体大小
  // 16：字体 margin
  // 32：连接线预留长度
  return 40 + str.length * 14 + 16 + 32
}
export default {
  name: 'StepBar',
  components: {
    AddStepNode
  },
  props: {
    dataSource: {
      type: Array,
      default: undefined
    }
  },
  data () {
    return {
      modal: {
        index: null,
        show: false,
        data: undefined
      },
      current: 0,
      stepNodes: []
    }
  },
  computed: {
    autoWidth () {
      let res = 0
      this.stepNodes.forEach((node) => {
        res += countNodeWidth(node.title)
      })
      return res ? res + 'px' : 'auto'
    }
  },
  watch: {
    dataSource: {
      handler (data) {
        if (data) {
          this.stepNodes = data
        }
      },
      immediate: true
    }
  },
  methods: {
    nodeChange (index) {
      this.current = index
      this.$emit('update', this.current, this.stepNodes)
    },
    stepChangeConfirm (node) {
      const model = this.stepNodes[0]
      if (utils.isNone(this.modal.index)) {
        const insertIndex = this.stepNodes.length - 2
        this.stepNodes.splice(insertIndex, 0, {
          ...utils.clone(model),
          fixed: false,
          key: node.key,
          title: node.title
        })
      } else {
        this.stepNodes[this.modal.index].key = node.key
        this.stepNodes[this.modal.index].title = node.title
      }
      this.$emit('update', this.current, this.stepNodes)
    },
    reduceNode (index) {
      this.$modal.confirm({
        title: '提示',
        content: '是否删除？',
        onOk: () => {
          this.stepNodes.splice(index, 1)
          this.nodeChange(index - 1 ? index - 1 : 0)
        }
      })
    },
    addNode () {
      this.modal.index = null
      this.modal.show = true
      this.modal.data = undefined
    },
    editNode (index, node) {
      this.modal.show = true
      this.modal.data = node
      this.modal.index = index
    },
    countBarStyle () {
      return {
        padding: '1rem 2%', minWidth: '100%', width: this.autoWidth
      }
    },
    countNodeClass (index) {
      return this.current === index ? 'select-node' : 'diselect-node'
    },
    countNodeStyle (node) {
      return {
        minWidth: countNodeWidth(node.title) + 'px'
      }
    },
    buildTitle (node, index) {
      const title = node.key === '__addtion__'
        ? <span>{ node.title }</span>
        : <a onClick={() => this.nodeChange(index)} onDblclick={() => node.edit && this.editNode(index, node)}>{ node.title }</a>
      const reduceIcon = !node.fixed && <a style="color:red" onClick={() => this.reduceNode(index)}><a-icon type="minus-circle" /></a>
      return <template slot="title">
        {reduceIcon}&nbsp;{title}
      </template>
    },
    buildIcon (node, index) {
      if (node.key === '__addtion__') {
        return <template slot="icon">
          <a onClick={this.addNode}><a-icon type="plus-circle" /></a>
        </template>
      } else {
        const checkIcon = this.current === index && <a onClick={() => this.nodeChange(index)}><a-icon type="check-circle" /></a>
        const decheckIcon = this.current !== index && <a onClick={() => this.nodeChange(index)}><a-icon type="clock-circle" /></a>
        return <template slot="icon">
          {checkIcon}{decheckIcon}
        </template>
      }
    }
  },
  render (h) {
    return (<div class="panel-content border-bottom-1" style="overflow:auto">
      <a-steps style={this.countBarStyle()} size="small" current={this.current}>
        {
          this.stepNodes.map((node, index) => {
            return (<a-step
              key={node.key}
              status={node.status || 'finish'}
              class={this.countNodeClass(index)}
              style={this.countNodeStyle(node)}
            >
              {this.buildTitle(node, index)}
              {this.buildIcon(node, index)}
            </a-step>)
          })
        }
      </a-steps>
      <AddStepNode modal={this.modal} onUpdate={this.stepChangeConfirm} />
    </div>)
  }
}
</script>
<style lang="less" scoped>
.select-node {
  a {
    color: #2DC84D;
  }
}
.diselect-node {
  a {
    color: #999999;
  }
}
</style>
