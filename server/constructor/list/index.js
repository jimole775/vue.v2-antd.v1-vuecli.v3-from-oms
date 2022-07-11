const utils = require(global.path.utils())
module.exports = function buildList (tabsTree, { name: moduleName, parent: parentName }, basePath) {
  const listFiles = [
    // {
    //   path: '',
    //   content: ''
    // }
  ]
  const tabIndexs = Object.keys(tabsTree)
  tabIndexs.forEach((tabIndex) => {
    const listConfig = tabsTree[tabIndex]
    const tabFolder = `${basePath}/tab${(tabIndex * 1 + 1)}`
    listFiles.push(buildColumns(tabFolder, listConfig.columns))
    listFiles.push(buildSearchor(tabFolder, listConfig.searchor))
    listFiles.push(buildListLoadFile(tabFolder))
  })
  listFiles.push(buildTabLoadFile(basePath, tabsTree))
  return listFiles
}

function buildColumns (prevDir, columns) {
  const exportCode = `export default `
  const exportData = utils.object2file(columns)
  return {
    path: `${prevDir}/columns.js`,
    content: `${exportCode}${exportData}`
  }
}

function buildSearchor (prevDir, searchor) {
  const exportCode = `export default `
  const exportData = utils.object2file(searchor)
  return {
    path: `${prevDir}/searchor.js`,
    content: `${exportCode}${exportData}`
  }
}

function buildListLoadFile (prevPath) {
  return {
    path: `${prevPath}/index.js`,
    content: `import columns from './columns'
    import searchor from './searchor'
    export default {
      columns,
      searchor
    }`
  }
}

function buildTabLoadFile (prevPath, tabsTree) {
  let importCmd = ''
  let exportCmd = 'export default {'
  const tabIndexs = Object.keys(tabsTree)
  tabIndexs.forEach((tabIndex) => {
    const varTab = 'tab' + (tabIndex * 1 + 1)
    importCmd += `import ${varTab} from './${varTab}'\n`
    exportCmd += `${tabIndex * 1}: ${varTab}\n`
  })
  exportCmd += '}'
  return {
    path: `${prevPath}/index.js`,
    content: `${importCmd}\n${exportCmd}`
  }
}
