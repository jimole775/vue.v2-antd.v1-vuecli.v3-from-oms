// import mock from './mock.json'
const { object2file, stringMark } = require('../../utils')
module.exports = function buildApimap (tabApimap, { name: moduleName, parent: parentName }, basePath) {
  const parentPath = parentName ? `${parentName}/` : ''
  const apiFuncFile = `/src/api/modules/${parentPath}${moduleName}.js`
  const availApimap = pickAvailableApi(tabApimap)
  const apiFiles = buildApimapFiles(availApimap, basePath)
  apiFiles.push(buildApiFuncFile(availApimap, apiFuncFile))
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

// 没有url或者method的api项，就删掉
function pickAvailableApi (tabApimap) {
  Object.keys(tabApimap).forEach((tabIndex) => {
    const apimap = tabApimap[tabIndex]
    Object.keys(apimap).forEach((key) => {
      const apiItem = apimap[key]
      if (!apiItem.url || !apiItem.method) {
        delete apimap[key]
      }
    })
  })
  return tabApimap
}

// 创建内容文件
function buildApimapFile (tabFolder, curApimap) {
  const exportCode = `export default `
  const exportData = {}
  const keys = Object.keys(curApimap)
  keys.forEach((key) => {
    const apiItem = curApimap[key]
    exportData[key] = buildFunctionName(apiItem)
  })
  return {
    path: `${tabFolder}/index.js`,
    content: `${exportCode}${object2file(exportData)}`
  }
}

// 创建引导文件
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
    content: `${inportCode1}${hasExportApi ? inportCode2 : ''}${exportCode}${object2file(exportData)}`
  }
}

function buildApiFunString (exportData, apimap) {
  Object.keys(apimap).forEach((apiName) => {
    const apiItem = apimap[apiName]
    const method = apiItem.method.toLocaleLowerCase()
    const name = buildFunctionName(apiItem)
    // 导出类型的函数名不同
    if (apimap['export'] && apimap['export'].url) {
      const exportFuncName = method === 'get' ? 'exportGetFile' : 'exportPostFile'
      exportData[name] = stringMark.noQuotation(`function (params) {
        return utils.${exportFuncName}('${apiItem.url}', params)
      }`)
    } else {
      const params = createParamString(apiItem)
      exportData[name] = stringMark.noQuotation(`function (params) {
        return http.${method}('${apiItem.url}', ${params})
      }`)
    }
  })
  return exportData
}

// 用url和method拼装成函数名，需要去掉 / 和 - _
function buildFunctionName ({ method, url }) {
  return `${method.toLocaleLowerCase()}${url.replace(/[\/\-_]/g, '')}`
}

function createParamString (apiItem) {
  const res = {}
  // 如果params没有设置，那么直接返回 params 字符串
  if ((apiItem.params && !Object.keys(apiItem.params).length) || !apiItem.params) return 'params'
  const keys = Object.keys(apiItem.params)
  keys.forEach((key, index) => {
    // const val = `params.${key}`
    res[key] = `params.${key}`
    // const dot = index === keys.length - 1 ? '' : ','
    // const brk = index === keys.length - 1 ? '' : '\n'
    // const space = getInsertSpace(res)
    // const sign = index === keys.length - 1 ? '' : `${space}_insert_`
    // res = res.replace(/_insert_/g, `${key}: ${val}${dot}${brk}${sign}`)
  })
  if (apiItem.method === 'GET') {
    return object2file({
      params: res
    })
  } else {
    return object2file(res)
  }
}

// 获取字符串插入节点的space
// function getInsertSpace (src) {
//   let res = src.match(/\n\s*?_insert_/)[0]
//   res = res.replace(/\n/, '').replace(/_insert_/, '')
//   return res
// }

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

// function space (len) {
//   return new Array(len).fill(' ').join('')
// }
