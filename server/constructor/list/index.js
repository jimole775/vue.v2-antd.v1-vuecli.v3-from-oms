// import mock from './mock.json'
const utils = require('../../utils')
// const basePath = 'list'
// buildList(mock)
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
    content: `${exportCode}${exportData}\n`
  }
}

function buildSearchor (prevDir, searchor) {
  const exportCode = `export default `
  const exportData = utils.object2file(searchor)
  return {
    path: `${prevDir}/searchor.js`,
    content: `${exportCode}${exportData}\n`
  }
}

function buildListLoadFile (prevPath) {
  const content = `import columns from './columns'
import searchor from './searchor'
export default {
  columns,
  searchor
}
`
  return {
    path: `${prevPath}/index.js`,
    content
  }
}

function buildTabLoadFile (prevPath, tabsTree) {
  let importCmd = ''
  let exportCmd = 'export default {\n'

  const tabIndexs = Object.keys(tabsTree)
  tabIndexs.forEach((tabIndex) => {
    const varTab = 'tab' + (tabIndex * 1 + 1)
    importCmd += `import ${varTab} from './${varTab}'\n`
    exportCmd += `  ${tabIndex * 1}: ${varTab}\n`
  })
  exportCmd += '}\n'
  return {
    path: `${prevPath}/index.js`,
    content: `${importCmd}\n${exportCmd}`
  }
}
