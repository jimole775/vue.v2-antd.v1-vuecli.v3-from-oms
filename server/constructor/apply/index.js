// import mock from './mock.json'
const buildPanelmap = require('../common/buildPanelmap')
const buildTabsLoader = require('../common/buildTabsLoader')
module.exports = function buildApply (tabsTree, router, basePath) {
  let applyFiles = [
    // { path: '', content: '' }
  ]
  const tabLoadFile = buildTabsLoader(basePath, tabsTree)
  const tabIndexs = Object.keys(tabsTree)
  tabIndexs.forEach((tabIndex) => {
    const curTab = tabsTree[tabIndex]
    const tabFolder = `${basePath}/tab${(tabIndex * 1 + 1)}`
    // const panelsFolder = `${tabFolder}/panelmap`
    const curTabLoader = buildCurTabLoader(tabFolder)
    const panelmapFiles = buildPanelmap(tabFolder, curTab)
    applyFiles = applyFiles.concat([curTabLoader])
    applyFiles = applyFiles.concat(panelmapFiles)
  })
  applyFiles.push(tabLoadFile)
  return applyFiles
}

function buildCurTabLoader (tabFolder) {
  return {
    path: `${tabFolder}/index.js`,
    content: `import panelmap from './panelmap'
    export default {
      panelmap
    }`
  }
}
