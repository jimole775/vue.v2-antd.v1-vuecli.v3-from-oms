<template>
  <div>
    <StepBar :data-source="stepNodes" @update="nodesUpdate" />
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
      // this.handup(this.operation)
      this.transferStepNodes()
    },
    logUpdate (data) {
      this.log = data
      this.handupApimap(this.log)
    },
    panelUpdate (data) {
      this.collapsePanels = data
      // this.handup(this.collapsePanels)
      this.transferStepNodes()
    },
    nodesUpdate (current, stepNodes) {
      this.current = current
      this.stepNodes = stepNodes
    },
    handupApimap (data) {
      Vue.bus.$emit('_apimap_', this.rank - 1, data)
    },
    handup (data) {
      Vue.bus.$emit('_approval_', this.rank - 1, data)
    },
    transferStepNodes () {
      const approvalConfig = this.buildedData['approvalConfig']
      const tabIndexs = Object.keys(approvalConfig)
      const model = {
        // node: {
        //   panels: {
        //     p: [{}, {}],
        //     disp: [{}, {}]
        //   }
        // }
      }
      const nodeKeys = this.stepNodes.map(i => i.key)
      tabIndexs.forEach((tabIndex) => {
        nodeKeys.forEach((nodeKey) => {
          model[nodeKey] = { panels: {
            permission: [],
            dispermission: []
          } }
          const tabPanels = approvalConfig[tabIndex]
          tabPanels.forEach((aPanel) => {
            if (this.isRight(aPanel, nodeKey)) {
              const permissionPanel = model[nodeKey]['panels']['permission']
              const dispermissionPanel = model[nodeKey]['panels']['dispermission']
              // aPanel.formItems.forEach((formItem) => {
              //   if (this.isRight(formItem, nodeKey)) {
              //     const formItemModel = {
              //       ...formItem
              //     }
              //     formItemModel.component

              //   }
              // })
              const panelModel = {
                mode: 'edit',
                show: true,
                title: aPanel.title,
                formItems: aPanel.formItems,
                component: aPanel.component || 'FormItemRender'
              }
              permissionPanel.push(panelModel)
              dispermissionPanel.push({ ...panelModel, mode: 'readonly' })
            }
          })
        })
      })
      console.log(model)
    },
    isRight (item, nodeKey) {
      return item.stepNodes && item.stepNodes.includes(nodeKey)
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
