// import mock from './mock.json'
const buildPanels = require('../common/buildPanels')
const buildOperation = require('../common/buildOperation')
const buildTabsLoader = require('../common/buildTabsLoader')
module.exports = function buildApproval (tabsTree, router, basePath) {
  let approvalFiles = [
    // { path: '', content: '' }
  ]
  const tabsLoader = buildTabsLoader(basePath, tabsTree)
  const tabIndexs = Object.keys(tabsTree)
  tabIndexs.forEach((tabIndex) => {
    const curTab = tabsTree[tabIndex]
    const tabFolder = `${basePath}/tab${(tabIndex * 1 + 1)}`

    const panelsFiles = buildPanels(tabFolder, curTab)
    const operationFiles = buildOperation(tabFolder, curTab)

    const curTabLoader = buildCurTabLoader(tabFolder, panelsFiles)

    approvalFiles = approvalFiles.concat([curTabLoader])
    approvalFiles = approvalFiles.concat(panelsFiles, operationFiles)
  })
  approvalFiles.push(tabsLoader)
  return approvalFiles
}

function buildCurTabLoader (tabFolder, panelsFiles) {
  const panelsModules = []
  panelsFiles.forEach((panel, index) => {
    const indx = index + 1
    const path = `'./panels/panel${indx}'`
    const vari = `panel${indx}`
    const code = `import ${vari} from ${path}\n`
    panelsModules.push({ path, vari, code })
  })
  return {
    path: `${tabFolder}/index.js`,
    content: `import operation from './operation'
    ${panelsModules.map(i => i.code).join('\n')}
    export default {
      panels: [${panelsModules.map(i => i.vari).join(',')}],
      operation: operation
    }`
  }
}
