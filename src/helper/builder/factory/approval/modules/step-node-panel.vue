<script>
import utils from '@/utils'
import ConfigNode from '@builder/config-modals/config-node'
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
    ConfigNode
  },
  props: {
    value: {
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
      nodes: []
    }
  },
  computed: {
    autoWidth () {
      let res = 0
      this.nodes.forEach((node) => {
        res += countNodeWidth(node.label)
      })
      return res ? res + 'px' : 'auto'
    }
  },
  watch: {
    value: {
      handler (data) {
        if (data) {
          this.nodes = data
        }
      },
      immediate: true
    }
  },
  methods: {
    AddNodeConfirm (node) {
      const model = this.nodes[0] || {}
      if (utils.isNone(this.modal.index)) {
        const insertIndex = this.nodes.length - 2
        this.nodes.splice(insertIndex, 0, {
          ...utils.clone(model),
          fixed: false,
          value: node.value,
          label: node.label
        })
      } else {
        this.nodes[this.modal.index].value = node.value
        this.nodes[this.modal.index].label = node.label
      }
      this.$emit('update', this.nodes)
    },
    reduceNode (index) {
      this.$modal.confirm({
        title: '提示',
        content: '是否删除？',
        onOk: () => {
          this.nodes.splice(index, 1)
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
    countNodeStyle (node) {
      return { minWidth: countNodeWidth(node.label) + 'px' }
    },
    buildTitle (node, index) {
      const label = node.value === '__addition__'
        ? <span>{ node.label }</span>
        : <a onClick={() => node.edit && this.editNode(index, node)}>{ node.label }</a>
      const reduceIcon = !node.fixed && <a style="color:red" onClick={() => this.reduceNode(index)}><a-icon type="minus-circle" /></a>
      return <template slot="title">
        {reduceIcon}&nbsp;{label}
      </template>
    },
    buildIcon (node, index) {
      if (node.value === '__addition__') {
        return <template slot="icon">
          <a onClick={this.addNode}><a-icon type="plus-circle" /></a>
        </template>
      } else {
        return <template slot="icon">
          <a-icon type="check-circle" />
        </template>
      }
    }
  },
  render (h) {
    return (<div class="panel-content border-bottom-1" style="overflow:auto">
      <a-steps style={this.countBarStyle()} size="small" current={this.current}>
        {
          this.nodes && this.nodes.map((node, index) => {
            return (<a-step
              key={node.value}
              status={node.status || 'finish'}
              style={this.countNodeStyle(node)}
            >
              {this.buildTitle(node, index)}
              {this.buildIcon(node, index)}
            </a-step>)
          })
        }
      </a-steps>
      <ConfigNode modal={this.modal} onUpdate={this.AddNodeConfirm} />
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
