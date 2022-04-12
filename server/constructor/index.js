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
      tabs = [],
      list = {},
      apply = {},
      apimap = {},
      router = {},
      approval = {}
    } = filesInfo
    /* fileInfos: { path: '', content: '' } */
    const listFileInfos = buildList(list, router, buildPrevPath(router, 'config/list'))
    const applyFileInfos = buildApply(apply, router, buildPrevPath(router, 'config/apply'))
    const approvalFileInfos = buildApproval(approval, router, buildPrevPath(router, 'config/approval'))
    const apimapFileInfos = buildApimap(apimap, router, buildPrevPath(router, 'config/apimap'))
    const routerFileInfos = buildRouter(router)
    const tabsFileInfos = buildTabs(tabs, router, buildPrevPath(router, 'config/tabs'))
    const indexFileInfos = buildIndexVue(buildPrevPath(router, ''))
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
