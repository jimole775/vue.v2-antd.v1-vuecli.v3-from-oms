// import mock from './mock.json'
const { object2file, stringMark } = require('../../utils')
module.exports = function buildApimap (tabApimap, { name: moduleName, parent: parentName }, basePath) {
  const parentPath = parentName ? `${parentName}/` : ''
  const apiFuncFile = `/src/api/modules/${parentPath}${moduleName}.js`
  const apiFiles = buildApimapFiles(tabApimap, basePath)
  apiFiles.push(buildApiFuncFile(tabApimap, apiFuncFile))
  return apiFiles
}

function buildApimapFiles (tabApimap, prevPath) {
  const files = []
  const tabIndexs = Object.keys(tabApimap)
  tabIndexs.forEach((tabIndex) => {
    const tabFolder = `${prevPath}/tab${(tabIndex * 1 + 1)}`
    files.push(buildApimapFile(tabFolder, tabApimap[tabIndex]))
  })
  files.push(buildTabLoadFile(prevPath, tabApimap))
  return files
}

function buildApimapFile (tabFolder, curApimap) {
  const exportCode = `export default `
  const exportData = {}
  const keys = Object.keys(curApimap)
  keys.forEach((key) => {
    const apiItem = curApimap[key]
    const method = apiItem.method.toLocaleLowerCase()
    const name = `${method}${apiItem.url.replace(/\//g, '')}`
    exportData[key] = name
  })
  return {
    path: `${tabFolder}/index.js`,
    content: `${exportCode}${object2file(exportData)}\n`
  }
}

function buildApiFuncFile (tabApimap, apiFuncFile) {
  const tabIndexs = Object.keys(tabApimap)
  const inportCode1 = `import http from '@/utils/http'\n`
  const inportCode2 = `import utils from '@/utils'\n`
  const exportCode = `export default `
  const exportData = {}
  let hasExportApi = false
  tabIndexs.forEach((tabIndex) => {
    const curApimap = tabApimap[tabIndex]
    if (curApimap['export'] && curApimap['export'].url) {
      hasExportApi = true
    }
    buildApiFunString(exportData, curApimap)
  })
  return {
    path: apiFuncFile,
    content: `${inportCode1}${hasExportApi ? inportCode2 : ''}${exportCode}${object2file(exportData)}\n`
  }
}

function buildApiFunString (exportData, apimap) {
  Object.keys(apimap).forEach((apiName) => {
    const apiItem = apimap[apiName]
    const method = apiItem.method.toLocaleLowerCase()
    const name = `${method}${apiItem.url.replace(/\//g, '')}`
    // 导出类型的函数名不同
    if (apimap['export'] && apimap['export'].url) {
      const exportFuncName = method === 'get' ? 'exportGetFile' : 'exportPostFile'
      exportData[name] = stringMark.noQuotation(`function (params) {\n` +
        `${space(4)}return utils.${exportFuncName}('${apiItem.url}', params)\n` +
        `${space(2)}}`
      )
    } else {
      const params = createParamString(apiItem)
      exportData[name] = stringMark.noQuotation(`function (params) {\n` +
        `${space(4)}return http.${method}('${apiItem.url}', ${params})\n` +
        `${space(2)}}`
      )
    }
  })
  return exportData
}

function createParamString (apiItem) {
  let res = null
  // 如果params没有设置，那么直接返回 params 字符串
  if ((apiItem.params && !Object.keys(apiItem.params).length) || !apiItem.params) return 'params'
  if (apiItem.method === 'GET') {
    res = `{
      params: {
        _insert_
      }
    }`
  } else {
    res = `{
      _insert_
    }`
  }
  const keys = Object.keys(apiItem.params)
  keys.forEach((key, index) => {
    const val = `params.${key}`
    const dot = index === keys.length - 1 ? '' : ','
    const brk = index === keys.length - 1 ? '' : '\n'
    const space = getInsertSpace(res)
    const sign = index === keys.length - 1 ? '' : `${space}_insert_`
    res = res.replace(/_insert_/g, `${key}: ${val}${dot}${brk}${sign}`)
  })
  return res
}

// 获取字符串插入节点的space
function getInsertSpace (src) {
  let res = src.match(/\n\s*?_insert_/)[0]
  res = res.replace(/\n/, '').replace(/_insert_/, '')
  return res
}

function buildTabLoadFile (prevPath, tabsTree) {
  let importCmd = ''
  let exportCmd = 'export default {\n'

  const tabIndexs = Object.keys(tabsTree)
  tabIndexs.forEach((tabIndex) => {
    const varTab = 'tab' + (tabIndex * 1 + 1)
    importCmd += `import ${varTab} from './${varTab}'\n`
    exportCmd += `${space(2)}${tabIndex * 1}: ${varTab}\n`
  })
  exportCmd += '}\n'
  return {
    path: `${prevPath}/index.js`,
    content: `${importCmd}\n${exportCmd}`
  }
}

function space (len) {
  return new Array(len).fill(' ').join('')
}
