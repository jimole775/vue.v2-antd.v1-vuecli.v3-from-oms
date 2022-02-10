<template>
  <div>
    <StepBar :data-source="stepNodes" @update="nodeChangeConfirm" />
    <BuildCollapsePanels :key="current" :data-source="currentNode.modules.collapsePanels" @update="panelUpdate" />
    <a-collapse
      :bordered="false"
      :active-key="['1', '9']"
    >
      <a-collapse-panel
        header="审批操作"
        key="1"
        class="m-block"
      >
        <OperationBar :key="current" :data-source="currentNode.modules.operation" @update="operationUpdate" />
      </a-collapse-panel>
      <LogBar :key="'9'" :data-source="currentNode.modules.log" @update="logUpdate" />
    </a-collapse>
  </div>
</template>
<script>
import utils from '@/utils'
import LogBar from './modules/log-bar'
import StepBar from './modules/step-bar'
import OperationBar from './modules/operation-bar'
import BuildCollapsePanels from '@/helper/builder/pages/factory/common/build-collapse-panels'
const moduleModel = {
  collapsePanels: [],
  operation: [],
  log: {}
}
export default {
  components: {
    LogBar,
    StepBar,
    OperationBar,
    BuildCollapsePanels
  },
  props: {
  },
  data () {
    return {
      current: 0,
      stepNodes: [
        {
          fixed: true,
          edit: true,
          key: 'start',
          title: '流程开始',
          modules: utils.clone(moduleModel)
        },
        {
          fixed: true,
          edit: false,
          key: '__addtion__',
          title: '新增节点',
          modules: utils.clone(moduleModel)
        },
        {
          fixed: true,
          edit: true,
          key: 'end',
          title: '流程结束',
          modules: utils.clone(moduleModel)
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
      this.currentNode.modules.operation = data
      console.log(this.stepNodes)
    },
    logUpdate (data) {
      this.currentNode.modules.log = data
      console.log(this.stepNodes)
    },
    panelUpdate (data) {
      this.currentNode.modules.collapsePanels = data
      console.log(this.stepNodes)
    },
    nodeChangeConfirm (current, stepNodes) {
      this.current = current
      this.stepNodes = stepNodes
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
