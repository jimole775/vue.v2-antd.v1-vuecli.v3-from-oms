<template>
  <div>
    <StepNodePanel
      :value="nodes"
      @update="nodesUpdate"
    />
    <BaseInfoPanel
      :nodes="availNodes"
      :radios="operator.radios"
      :value="{ panel: baseInfoPanel, detail: detailApi, columns }"
      @modify="baseInfoModify"
      @increase="panelsIncrease"
    />
    <CollapsePanels
      :nodes="availNodes"
      :radios="operator.radios"
      :value="collapsePanels"
      @update="panelsUpdate"
    />
    <!-- <LogInfoPanel
      :value="logInfo"
      @update="logUpdate"
    /> -->
    <OperationPanel
      :value="{ operator, approvalSubmitApi }"
      :nodes="availNodes"
      @update="operationUpdate"
    />
  </div>
</template>
<script>
import utils from '@/utils'
import { mapActions } from 'vuex'
import builder from '@builder/mixins/builder'
// import LogInfoPanel from './modules/log-info-panel'
import BaseInfoPanel from './modules/base-info-panel'
import StepNodePanel from './modules/step-node-panel'
import OperationPanel from './modules/operator-panel'
import CollapsePanels from './modules/collapse-panels'
export default {
  mixins: [builder],
  components: {
    // LogInfoPanel,
    BaseInfoPanel,
    StepNodePanel,
    OperationPanel,
    CollapsePanels
  },
  data () {
    return {
      logInfo: {},
      columns: [],
      operator: {},
      detailApi: {},
      baseInfoPanel: {},
      collapsePanels: [],
      approvalSubmitApi: {},
      nodes: [
        {
          fixed: true,
          edit: true,
          value: 'apply',
          label: '申请'
        },
        {
          fixed: true,
          edit: true,
          value: 'start',
          label: '流程开始'
        },
        {
          fixed: true,
          edit: false,
          value: '__addition__',
          label: '新增节点'
        },
        {
          fixed: true,
          edit: true,
          value: 'end',
          label: '流程结束'
        }
      ]
    }
  },
  computed: {
    availNodes () {
      const nodes = this.nodes.filter((node) => {
        return node.value !== '__addition__'
      })
      return nodes
    }
  },
  watch: {
    viewData: {
      handler (data) {
        if (data.approval) {
          const currentModule = data.approval[this.currentRank]
          if (currentModule.nodes) {
            this.nodes = utils.clone(currentModule.nodes)
          }
          if (currentModule.logInfo) {
            this.logInfo = utils.clone(currentModule.logInfo)
          }
          if (currentModule.operator) {
            this.operator = utils.clone(currentModule.operator)
          }
          if (currentModule.baseInfoPanel) {
            this.baseInfoPanel = utils.clone(currentModule.baseInfoPanel)
          }
          if (currentModule.detailApi) {
            this.detailApi = utils.clone(currentModule.detailApi)
          }
          if (currentModule.approvalSubmitApi) {
            this.approvalSubmitApi = utils.clone(currentModule.approvalSubmitApi)
          }
          if (currentModule.collapsePanels) {
            this.collapsePanels = utils.clone(currentModule.collapsePanels)
          }
        }
        if (data.list) {
          const curList = data.list[this.currentRank]
          this.columns = curList.table.columns || []
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['setNodes']),
    operationUpdate (data) {
      this.operator = data.operator
      this.approvalSubmitApi = data.approvalSubmitApi
      this.handupData()
    },
    logUpdate (data) {
      this.logInfo = data
      this.handupData()
    },
    baseInfoModify (data) {
      if (data.panel) {
        this.baseInfoPanel = data.panel
        this.handupData()
      }
      if (data.detail) {
        this.detailApi = data.detail
        this.handupData()
      }
    },
    panelsIncrease (data) {
      this.collapsePanels.push(data)
      this.handupData()
    },
    panelsUpdate (data) {
      this.collapsePanels = data
      this.handupData()
    },
    nodesUpdate (nodes) {
      this.nodes = nodes
      this.setNodes(nodes)
      this.handupData()
    },
    handupData () {
      const cacheData = {
        nodes: utils.clone(this.nodes),
        logInfo: utils.clone(this.logInfo),
        operator: utils.clone(this.operator),
        detailApi: utils.clone(this.detailApi),
        baseInfoPanel: utils.clone(this.baseInfoPanel),
        collapsePanels: utils.clone(this.collapsePanels),
        approvalSubmitApi: utils.clone(this.approvalSubmitApi)
      }
      this.setViewData({ key: 'approval', value: cacheData })
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
