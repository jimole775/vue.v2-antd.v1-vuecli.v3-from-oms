import utils from '@/utils'
export default function viewToBuild ({ stepNodes = [], collapsePanels = [], operation = {} }) {
  const model = {}
  stepNodes.forEach((node) => {
    // __addition__ 节点过滤掉
    if (node.value === '__addition__') return false

    // 正常逻辑
    model[node.value] = {
      panels: {
        permission: [],
        dispermission: []
      }
    }
    const tabPanels = utils.clone(collapsePanels || [])
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
    // end节点，没有审批操作
    if (node.value !== 'end') {
      const operationPanel = transferOperation(node.value, operation)
      permissionPanels.push(operationPanel)
    }
  })
  return model
  // return this.handupBuildData(model)
}

function transferOperation (nodeKey, operation) {
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
  const { radios = [], inputs = [] } = operation
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

function transferFormItems (originFormItems = [], nodeKey, fields = ['originProps', 'stepNodes', 'configType']) {
  const cpFormItems = utils.clone(originFormItems)
  const formItems = []
  cpFormItems.forEach((formItem) => {
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
