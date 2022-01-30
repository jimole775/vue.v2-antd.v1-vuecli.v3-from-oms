<template>
  <div>
    <StepBar v-model="stepNodes" @update="nodeChangeConfirm" />
    <BuildCollapsePanels :key="current" :data-source="currentNode.modules.collapsePanels" @update="panelUpdate" />
    <a-collapse
      :bordered="false"
      :active-key="['1']"
    >
      <a-collapse-panel
        header="审批操作"
        key="1"
        class="m-block"
      >
        <OperationBar :key="current" v-model="currentNode.modules.operation" />
      </a-collapse-panel>
      <a-collapse-panel
        header="审批日志"
        key="9"
        class="m-block"
      >
        <LogBar :key="current" v-model="currentNode.modules.log" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
// import api from '@/api'
import utils from '@/utils'
import StepBar from './modules/step-bar'
import OperationBar from './modules/operation-bar'
import BuildCollapsePanels from '@/helper/builder/pages/factory/common/build-collapse-panels'
const moduleModel = {
  collapsePanels: [],
  operation: {},
  log: {}
}
export default {
  components: {
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
          status: 'finish',
          title: '流程开始',
          modules: utils.clone(moduleModel)
        },
        {
          fixed: true,
          edit: false,
          key: '__addtion__',
          status: 'wait',
          title: '新增节点',
          modules: utils.clone(moduleModel)
        },
        {
          fixed: true,
          edit: true,
          key: 'end',
          status: 'finish',
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
    panelUpdate (data) {
      this.currentNode.modules.collapsePanels = data
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
