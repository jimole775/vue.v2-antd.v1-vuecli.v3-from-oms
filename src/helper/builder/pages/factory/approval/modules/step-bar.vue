<template>
  <div class="panel-content border-bottom-1" style="overflow:auto">
    <a-steps :style="{ padding: '1rem 2%', minWidth: '100%', width: autoWidth }" :current="current">
      <a-step
        v-for="(node, index) in stepNodes"
        :key="node.key"
        :status="node.status || 'finish'"
        :style="countStyle(node)"
      >
        <template slot="title">
          <a-button v-if="node.edit" :type="current === index ? 'primary' : ''" @click="() => nodeChange(index)">{{ node.title }}</a-button>
          <span v-if="!node.edit">{{ node.title }}</span>
          <a v-if="!node.fixed" @click="() => reduceNode(index)">
            <a-icon type="minus-circle" />
          </a>
        </template>
        <template slot="icon">
          <a v-if="node.key === '__addtion__'" @click="addNode">
            <a-icon type="plus-circle" />
          </a>
          <a v-else @click="() => editNode(index, node)">
            <a-icon type="edit" />
          </a>
        </template>
      </a-step>
    </a-steps>
    <AddStepNode :modal="modal" @update="stepChangeConfirm" />
  </div>
</template>
<script>
// import utils from '@/utils'
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
    value: {
      type: Array,
      default: undefined
    }
  },
  model: {
    prop: 'value',
    event: 'change'
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
    value: {
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
      this.stepNodes[this.modal.index].key = node.key
      this.stepNodes[this.modal.index].title = node.title
      this.$emit('update', this.current, this.stepNodes)
    },
    reduceNode (index) {
      this.stepNodes.replace(index, 1)
    },
    addNode () {
      this.modal.show = true
      this.modal.data = undefined
    },
    editNode (index, node) {
      this.modal.show = true
      this.modal.data = node
      this.modal.index = index
    },
    countStyle (node) {
      return { minWidth: countNodeWidth(node.title) + 'px' }
    }
  }
}
</script>
<style lang="less" scoped>
// /deep/.ant-steps-item-title::after {
//   height: 0 !important;
// }
</style>
