import utils from '@/utils'
export default function approval ({ collapsePanels = [], baseInfoPanel = {}, operator = {} }) {
  const res = {
    panels: [],
    operator: {}
  }
  const copyPanels = utils.clone(collapsePanels)
  const copyOperation = utils.clone(operator)
  if (!utils.isEmptyObject(baseInfoPanel)) {
    copyPanels.unshift(baseInfoPanel)
  }
  res['panels'] = transferPanels(copyPanels, copyOperation)
  res['operator'] = transferOperation(copyPanels, copyOperation)
  return res
}

function transferPanels (collapsePanels, operator) {
  collapsePanels.forEach((aPanel) => {
    aPanel.formItems = transferFormItems(aPanel.formItems)
    aPanel.formItems = evalRadioValue(aPanel.formItems, operator)
  })
  return collapsePanels
}

function transferOperation (collapsePanels, operator) {
  operator.inputs = transferFormItems(operator.inputs)
  operator.inputs = evalRadioValue(operator.inputs, operator)
  return operator
}

function transferFormItems (originFormItems = [], delFields = ['originProps', 'configType']) {
  const cpFormItems = utils.clone(originFormItems)
  const formItems = []
  cpFormItems.forEach((formItem) => {
    delFields.forEach((field) => {
      delete formItem[field]
    })
    deleteEmptyFields(formItem)
    formItems.push(formItem)
  })
  return formItems
}

// 清掉空值的字段
function deleteEmptyFields (formItem) {
  const emptyVisible = ['showOnEnv', 'showOnRoles', 'showOnRadios', 'showOnNodes']
  const emptyEditable = ['editOnNodes', 'editOnRoles']
  const emptyFields = ['props', 'operations', 'component']
  emptyFields.concat(emptyVisible, emptyEditable).forEach((field) => {
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

function evalRadioValue (formItems, operator) {
  const radios = operator.radios || []
  formItems.forEach(formItem => {
    if (formItem.showOnRadios) {
      const keys = formItem.showOnRadios
      const queryKeys = keys.map(k => {
        const findItem = radios.find(r => (r.key === k))
        return findItem && findItem.value
      }).filter(i => i)
      if (queryKeys && queryKeys.length) {
        formItem.showOnRadios = queryKeys
      }
    }
  })
  return formItems
}
