const path = require('path')
const { writeFileSync, object2file } = require('../../utils')
const basePath = 'list'
const mock = require('./mock.json')
buildList(mock)
function buildList (tabsTree) {
  const tabIndexs = Object.keys(tabsTree)
  tabIndexs.forEach((tabIndex) => {
    const listConfig = tabsTree[tabIndex]
    const tabFolder = `${basePath}/tab${(tabIndex * 1 + 1)}`
    buildColumns(tabFolder, listConfig.columns)
    buildSearchor(tabFolder, listConfig.searchor)
    buildListLoadFile(tabFolder)
  })
  buildTabLoadFile(basePath, tabsTree)
}

function buildColumns (prevDir, columns) {
  const exportCode = `export default `
  const exportData = object2file(columns)
  writeFileSync(path.join(prevDir, 'columns.js'), `${exportCode}${exportData}`)
}

function buildSearchor (prevDir, searchor) {
  const exportCode = `export default `
  const exportData = object2file(searchor)
  writeFileSync(path.join(prevDir, 'searchor.js'), `${exportCode}${exportData}`)
}

function buildListLoadFile (prevPath) {
  const content = `import columns from './columns'
import searchor from './searchor'
export default {
  columns,
  searchor
}
`
  writeFileSync(path.join(prevPath, 'index.js'), content)
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
  writeFileSync(
    path.join(prevPath, 'index.js'),
    `${importCmd}\n${exportCmd}`
  )
}
