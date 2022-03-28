<template>
  <div>
    <StepBar :data-source="stepNodes" @update="nodesUpdate" />
    <BuildCollapsePanels :key="current" :data-source="collapsePanels" @update="panelsUpdate" />
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
import utils from '@/utils'
import { mapGetters } from 'vuex'
import mixins from '@builder/mixins'
import LogBar from './modules/log-bar'
import StepBar from './modules/step-bar'
import OperationBar from './modules/operation-bar'
import BuildCollapsePanels from '@builder/config-modules/build-collapse-panels.vue'
export default {
  mixins: [mixins],
  components: {
    LogBar,
    StepBar,
    OperationBar,
    BuildCollapsePanels
  },
  props: {
    rank: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      log: {},
      operation: {},
      collapsePanels: [],
      current: 0,
      stepNodes: [
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
    ...mapGetters(['getStepNodes', 'getTabType']),
    currentNode () {
      return this.stepNodes[this.current] || {}
    }
  },
  methods: {
    operationUpdate (data) {
      this.operation = data
      this.transferPanels()
    },
    logUpdate (data) {
      this.log = data
      this.handupApimap(this.log)
    },
    panelsUpdate (data) {
      this.collapsePanels = data
      // 从基础信息配置的信息，获取detail的接口
      const baseItem = this.collapsePanels[0]
      this.handupApimap({
        detail: {
          url: baseItem.url,
          method: baseItem.method,
          params: {}
        }
      })
      this.transferPanels()
    },
    nodesUpdate (current, stepNodes) {
      this.current = current
      this.stepNodes = stepNodes
    },
    handupApimap (data) {
      // Vue.bus.$emit('__apimap__', this.rank, data)
      this.setViewData({ key: 'apimap', index: this.rank, value: data })
      this.setBuildData({ key: 'apimapConfig', index: this.rank, value: data })
    },
    handup (data) {
      // Vue.bus.$emit('__approval__', this.rank, data)
      this.setViewData({ key: 'approval', index: this.rank, value: data })
      this.setBuildData({ key: 'approvalConfig', index: this.rank, value: data })
    },
    transferPanels () {
      const model = {}
      this.getStepNodes.forEach((node) => {
        model[node.value] = {
          panels: {
            permission: [],
            dispermission: []
          }
        }
        const tabPanels = utils.clone(this.collapsePanels || [])
        const permissionPanels = model[node.value]['panels']['permission']
        const dispermissionPanels = model[node.value]['panels']['dispermission']
        tabPanels.forEach((aPanel) => {
          if (isRightNode(aPanel, node.value)) {
            const panelModel = {
              mode: 'edit',
              show: true,
              title: aPanel.title,
              formItems: transferFormItems(aPanel.formItems, node.value, ['originProps', 'stepNodes', 'configType', 'operations']),
              component: aPanel.component || 'FormItemRender'
            }
            permissionPanels.push(panelModel)
            dispermissionPanels.push({ ...panelModel, mode: 'readonly' })
          }
        })
        if (node.value !== 'end') {
          const operationPanel = this.transferOperation(node.value)
          permissionPanels.push(operationPanel)
        }
      })
      return this.handup(model)
    },
    transferOperation (nodeKey) {
      const panel = {
        component: 'ApprovalOperation',
        title: '审批操作',
        mode: 'edit',
        show: true,
        operationItem: {
          radios: [],
          inputs: []
        }
      }
      const { radios = [], inputs = [] } = this.operation
      const newRadios = panel.operationItem.radios
      const newInputs = panel.operationItem.inputs
      radios.forEach((radio) => {
        if (isRightNode(radio, nodeKey)) {
          const radioModel = {}
          radioModel.key = 'approvalResult'
          radioModel.value = radio.checked
          radioModel.label = radio.label
          newRadios.push(radioModel)
        }
      })
      transferFormItems(inputs, nodeKey).forEach((input) => {
        const inputModel = {
          ...input,
          required: true,
          show: getRadioValue(radios, input.operations)
        }
        delete inputModel.operations
        newInputs.push(inputModel)
      })

      return panel
    }
  }
}

function transferFormItems (originFormItems, nodeKey, fields = ['originProps', 'stepNodes', 'configType']) {
  const cFormItems = utils.clone(originFormItems)
  const formItems = []
  cFormItems.forEach((formItem) => {
    if ((nodeKey && isRightNode(formItem, nodeKey)) || !nodeKey) {
      fields.forEach((field) => {
        delete formItem[field]
      })
      deleteNoneFields(formItem)
      formItems.push(formItem)
    }
  })
  return formItems
}

// 清掉空值的字段
function deleteNoneFields (formItem) {
  const fields = ['props', 'operations', 'component']
  fields.forEach((field) => {
    const val = formItem[field]
    if (
      val === undefined ||
      (utils.isObject(val) && Object.keys(val).length === 0) ||
      (utils.isArray(val) && val.length === 0)
    ) {
      delete formItem[field]
    }
  })
}

function isRightNode (item, nodeKey) {
  return item.stepNodes && item.stepNodes.includes(nodeKey)
}

function getRadioValue (radios, keys) {
  const res = []
  keys.forEach(key => {
    const rightItem = radios.find(i => i.value === key)
    res.push(rightItem.checked)
  })
  return res
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
