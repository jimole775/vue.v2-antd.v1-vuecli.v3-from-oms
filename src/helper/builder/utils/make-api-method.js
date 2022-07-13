
import api from '@/api'
import utils from '@/utils'
import http from '@/utils/http'
export default function makeApiMethod (apimap = {}) {
  const res = {}
  const tabIndexs = Object.keys(apimap)
  tabIndexs.forEach((tabIndex) => {
    res[tabIndex] = utils.clone(apimap[tabIndex])
    const apimapItem = utils.clone(apimap[tabIndex])
    res[tabIndex].approval.submit = packageApiFunction(apimapItem.approval.submit)
    res[tabIndex].approval.detail = packageApiFunction(apimapItem.approval.detail)
    res[tabIndex].apply.submit = packageApiFunction(apimapItem.apply.submit)
    res[tabIndex].list.batch = packageBtachApi(apimapItem.list.batch)
    res[tabIndex].list.table.dataDir = apimapItem.list.table.dataDir
    res[tabIndex].list.table.dataApi = packageApiFunction(apimapItem.list.table.dataApi)
  })
  return res
}

function packageBtachApi (batchInfo = {}) {
  const res = {}
  const batchNames = Object.keys(batchInfo)
  batchNames.forEach((name) => {
    res[name] = {
      api: packageApiFunction(batchInfo[name]),
      permission: batchInfo[name].permission
    }
  })
  return res
}

function packageApiFunction (apiInfo) {
  if (apiInfo && apiInfo.method && apiInfo.url) {
    if (!apiInfo.isAlready) {
      const hasExportApi = ['exportGetFile', 'exportPostFile'].includes(apiInfo.method)
      const argString = apiInfo.arguments ? apiInfo.arguments.join(',') : ''
      const paramsString = apiInfo.params ? JSON.stringify(apiInfo.params) : ''
      const fnString = `(${argString}) => {
        return ${hasExportApi ? 'utils' : 'http'}.${apiInfo.method}(\`${apiInfo.url}\`, ${paramsString})
      }`
      console.log(http.status, '跳过http未使用的检测')
      api[apiInfo.name] = eval(fnString)
    }
    return apiInfo.name
  }
}
