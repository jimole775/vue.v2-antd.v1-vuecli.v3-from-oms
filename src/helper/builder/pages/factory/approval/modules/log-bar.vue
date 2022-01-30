<template>
  <div class="panel-content border-bottom-1" style="overflow:auto">
    <a-steps :style="{ padding: '1rem 2%', minWidth: '100%', width: autoWidth }" :current="current">
      <a-step
        v-for="(node, index) in stepNodes"
        :key="node.key"
        :status="node.status"
        :style="countStyle(node)"
      >
        <template slot="title">
          <a-button v-if="node.edit" :type="current === index ? 'primary' : ''" @click="current = index">{{ node.title }}</a-button>
          <span v-if="!node.edit">{{ node.title }}</span>
          <a v-if="!node.fixed" @click="() => reduceNode(index)">
            <a-icon type="minus-circle" />
          </a>
        </template>
        <template slot="icon">
          <a v-if="node.key === '__addtion__'" @click="addNode">
            <a-icon type="plus-circle" />
          </a>
          <a v-else @click="() => editNode(node)">
            <a-icon type="edit" />
          </a>
        </template>
      </a-step>
    </a-steps>
    <AddStepNode :modal="modal" @update="formItemConfirm" />
  </div>
</template>
<script>
import AddStepNode from '../modals/add-step-node'
// import api from '@/api'
function countNodeWidth (str = '') {
  // 40: icon宽度
  // 14：字体大小
  // 16：字体 margin
  // 32：连接线预留长度
  return 40 + str.length * 14 + 16 + 32
}
const moduleModel = {
  collapsePanels: {},
  operation: {},
  log: {}
}
export default {
  name: 'LogBar',
  components: {
    AddStepNode
  },
  props: {
    record: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      modal: {
        show: false,
        data: undefined
      },
      current: 0,
      stepNodes: [
        {
          fixed: true,
          edit: true,
          key: 'start',
          status: 'finish',
          nodeRelation: 'reference',
          title: '流程开始',
          modules: moduleModel
        },
        {
          fixed: true,
          edit: false,
          key: '__addtion__',
          status: 'wait',
          title: '新增节点',
          modules: moduleModel
        },
        {
          fixed: true,
          edit: true,
          key: 'end',
          status: 'finish',
          nodeRelation: 'reference',
          title: '流程结束',
          modules: moduleModel
        }
      ]
    }
  },
  watch: {
    // current: {
    //   handler (val) {
    //     if (val !== undefined && val !== null) {
    //       const map = {
    //         0: 'wait',
    //         1: 'process',
    //         2: 'finish'
    //       }
    //       const currentNode = this.stepNodes[val] || {}
    //       if (map[currentNode.approvalStatus] === 'finish' && val === this.stepNodes.length - 1) {
    //         // 如果当前时最后一个节点，且状态为'finish',就置空审批人数组
    //         currentNode.approvalAccountList = []
    //       }
    //       this.$emit('update', currentNode)
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // }
  },
  computed: {
    autoWidth () {
      let res = 0
      this.stepNodes.forEach((node) => {
        res += countNodeWidth(node.title)
      })
      return res ? res + 'px' : 'auto'
    }
    // current () {
    //   let nodeIndex = null
    //   for (let index = 0; index < this.stepNodes.length; index++) {
    //     const option = this.stepNodes[index]
    //     // 0：待发起
    //     // 1：审批中
    //     // 2：正常结束
    //     // -1:终止
    //     if (option.approvalStatus === 1 || option.approvalStatus === -1) {
    //       nodeIndex = index
    //       break
    //     }
    //   }
    //   // 如果找不到激活中的节点，默认为end节点
    //   return nodeIndex === null ? this.stepNodes.length - 1 : nodeIndex
    // }
  },
  async created () {
    // await this.fetchData(this.id)
  },
  methods: {
    reduceNode (index) {
      this.stepNodes.replace(index, 1)
    },
    addNode () {
      this.modal.show = true
      this.modal.data = undefined
    },
    editNode (node) {
      this.modal.show = true
      this.modal.data = node
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
