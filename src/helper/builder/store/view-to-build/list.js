import utils from '@/utils'
export function columnsViewToBuild (originColumns = []) {
  const copyColumns = utils.clone(originColumns)
  const columns = []
  copyColumns.forEach((col) => {
    const propsObject = col.props
    if (!propsObject) return false
    delete propsObject['anchor']
    delete propsObject['titleTips']
    delete propsObject['originTitle']
    // 当前只支持 "0":内部 "1":外部, 其他的情况，就把字段删除
    if (propsObject['permission'] === '0' || propsObject['permission'] === '1') {
      const permission = propsObject['permission']
      propsObject['permission'] = [permission]
    } else {
      delete propsObject['permission']
    }
    // 拼装 slotsRender 函数
    if (propsObject['slotsRender']) {
      const fnInstance = propsObject['slotsRender']
      propsObject['slotsRender'] = `(h, vm) => {\n${fnInstance}\n}\n`
    }
    // 拼装 scopedSlotsRender 函数
    if (propsObject['scopedSlotsRender']) {
      const fnInstance = propsObject['scopedSlotsRender']
      propsObject['scopedSlotsRender'] = `(h, record, vm) => {\n${fnInstance}\n}\n`
    }
    columns.push(propsObject)
  })
  return columns
}

export function searchorViewToBuild (originFormItems = [], fields = ['originProps', 'stepNodes', 'configType']) {
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
