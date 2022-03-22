const buildApproval = require('./approval')
const buildApply = require('./apply')
const buildList = require('./list')
const buildRouter = require('./router')
const buildTabs = require('./tabs')
const buildApimap = require('./apimap')
function buildConstruct (filesInfo) {
  if (filesInfo) {
    const {
      tabsConfig = [],
      listConfig = {},
      applyConfig = {},
      apimapConfig = {},
      routerConfig = {},
      approvalConfig = {}
    } = filesInfo
    const listFileInfos = buildList(listConfig, routerConfig, buildPrevPath(routerConfig, 'list'))
    const applyFileInfos = buildApply(applyConfig, routerConfig, buildPrevPath(routerConfig, 'apply'))
    const approvalFileInfos = buildApproval(approvalConfig, routerConfig, buildPrevPath(routerConfig, 'approval'))
    const apimapFileInfos = buildApimap(apimapConfig, routerConfig, buildPrevPath(routerConfig, 'apimap'))
    const routerFileInfos = buildRouter(routerConfig)
    const tabsFileInfos = buildTabs(tabsConfig, routerConfig, buildPrevPath(routerConfig, 'tabs'))
    return [
      ...tabsFileInfos,
      ...listFileInfos,
      ...applyFileInfos,
      ...apimapFileInfos,
      ...routerFileInfos,
      ...approvalFileInfos
    ]
  }
}

function buildPrevPath ({ parent: parentName, name: moduleName }, tabTag) {
  const basePath = `/src/views`
  const parentPath = parentName ? `${parentName}/` : ''
  return `${basePath}/${parentPath}${moduleName}/${tabTag}`
}

module.exports = buildConstruct
