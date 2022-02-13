<template>
  <div>
    <StepBar :data-source="stepNodes" @update="nodeChangeConfirm" />
    <BuildCollapsePanels :key="current" :data-source="collapsePanels" @update="panelUpdate" />
    <a-collapse
      :bordered="false"
      :active-key="['101', '102']"
    >
      <a-collapse-panel
        header="审批操作"
        key="101"
        class="m-block"
      >
        <OperationBar :key="current" :data-source="operation" @update="operationUpdate" />
      </a-collapse-panel>
      <LogBar :key="'102'" :data-source="log" @update="logUpdate" />
    </a-collapse>
  </div>
</template>
<script>
import Vue from 'vue'
// import utils from '@/utils'
import LogBar from './modules/log-bar'
import StepBar from './modules/step-bar'
import OperationBar from './modules/operation-bar'
import BuildCollapsePanels from '@/helper/builder/pages/factory/common/build-collapse-panels'
// const moduleModel = {
//   collapsePanels: [],
//   operation: [],
//   log: {}
// }
export default {
  components: {
    LogBar,
    StepBar,
    OperationBar,
    BuildCollapsePanels
  },
  props: {
    rank: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      log: {},
      operation: [],
      collapsePanels: [],
      current: 0,
      stepNodes: [
        {
          fixed: true,
          edit: true,
          key: 'start',
          title: '流程开始'
        },
        {
          fixed: true,
          edit: false,
          key: '__addtion__',
          title: '新增节点'
        },
        {
          fixed: true,
          edit: true,
          key: 'end',
          title: '流程结束'
        }
      ]
    }
  },
  computed: {
    currentNode () {
      return this.stepNodes[this.current] || {}
    }
  },
  methods: {
    operationUpdate (data) {
      this.operation = data
    },
    logUpdate (data) {
      this.log = data
    },
    panelUpdate (data) {
      this.collapsePanels = data
    },
    nodeChangeConfirm (current, stepNodes) {
      this.current = current
      this.stepNodes = stepNodes
    },
    handupApimap (data) {
      Vue.bus.$emit('_apimap_', this.rank - 1, data)
    },
    handup (data) {
      Vue.bus.$emit('_approval_', this.rank - 1, data)
    }
  }
}
</script>
<style lang="less" scoped>
.ppproject-footer {
  text-align: center;
  margin: 2rem 0;
  button {
    width: 16rem;height:2.6rem;
  }
}
/deep/.ant-row {
  line-height: 2.5;
}
</style>
