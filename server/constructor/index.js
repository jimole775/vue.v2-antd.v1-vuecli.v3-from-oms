const buildApproval = require('./approval')
const buildApply = require('./apply')
const buildList = require('./list')
const buildRouter = require('./router')
const buildTabs = require('./tabs')
const buildApimap = require('./apimap')
const buildIndexVue = require('./main')
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
    /* fileInfos: { path: '', content: '' } */
    const listFileInfos = buildList(listConfig, routerConfig, buildPrevPath(routerConfig, 'config/list'))
    const applyFileInfos = buildApply(applyConfig, routerConfig, buildPrevPath(routerConfig, 'config/apply'))
    const approvalFileInfos = buildApproval(approvalConfig, routerConfig, buildPrevPath(routerConfig, 'config/approval'))
    const apimapFileInfos = buildApimap(apimapConfig, routerConfig, buildPrevPath(routerConfig, 'config/apimap'))
    const routerFileInfos = buildRouter(routerConfig)
    const tabsFileInfos = buildTabs(tabsConfig, routerConfig, buildPrevPath(routerConfig, 'config/tabs'))
    const indexFileInfos = buildIndexVue(buildPrevPath(routerConfig, ''))
    return [
      ...indexFileInfos,
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
