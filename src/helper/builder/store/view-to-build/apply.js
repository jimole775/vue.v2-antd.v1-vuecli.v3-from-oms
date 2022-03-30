import utils from '@/utils'
export default function viewToBuild (collapsePanels = []) {
  const model = {
    panels: []
  }
  const tabPanels = utils.clone(collapsePanels || [])
  tabPanels.forEach((aPanel) => {
    const panels = model['panels']
    const panelModel = {
      mode: 'edit',
      show: true,
      title: aPanel.title,
      formItems: transferFormItems(aPanel.formItems),
      component: aPanel.component || 'FormItemRender'
    }
    panels.push(panelModel)
  })
  return model
  // this.handupBuildData(model)
}

function transferFormItems (originFormItems = [], fields = ['originProps', 'stepNodes', 'configType']) {
  const cpFormItems = utils.clone(originFormItems)
  const formItems = []
  cpFormItems.forEach((formItem) => {
    fields.forEach((field) => {
      delete formItem[field]
    })
    deleteNoneFields(formItem)
    formItems.push(formItem)
  })
  return formItems
}

// 清掉空值的字段
function deleteNoneFields (formItem = {}) {
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
