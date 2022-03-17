// import mock from './mock.json'
import { object2file } from '@builder/utils'
const basePath = 'list'
// buildList(mock)
export default function buildList (tabsTree) {
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
  const exportData = object2file(columns)
  return {
    path: `${prevDir}/columns.js`,
    content: `${exportCode}${exportData}`
  }
}

function buildSearchor (prevDir, searchor) {
  const exportCode = `export default `
  const exportData = object2file(searchor)
  return {
    path: `${prevDir}/searchor.js`,
    content: `${exportCode}${exportData}`
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
