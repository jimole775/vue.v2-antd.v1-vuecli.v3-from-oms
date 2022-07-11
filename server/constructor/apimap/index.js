// import mock from './mock.json'
const {
  isObject,
  stringMark,
  object2file,
  isString,
  isEmptyArray,
  isEmptyObject
} = require(global.path.utils())
let hasExportApi = false

module.exports = function buildApimap (tabApimap, { name: moduleName, parent: parentName }, basePath) {
  let apiFuncFile = ''
  if (parentName === 'views') {
    apiFuncFile = `/src/api/modules/${moduleName}/${moduleName}.js`
  } else {
    apiFuncFile = `/src/api/modules/${parentName}/${moduleName}.js`
  }
  // const availApimap = pickAvailableApi(tabApimap)

  // 写入 @/views/xxx/apimap.js 文件
  const apiFiles = buildApimapFiles(tabApimap, basePath)

  // 写入 @/api/ 文件
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

// 没有url或者method的api项，就删掉
// function pickAvailableApi (tabApimap) {
//   Object.keys(tabApimap).forEach((tabIndex) => {
//     const apimap = tabApimap[tabIndex]
//     Object.keys(apimap).forEach((module) => {
//       Object.keys(module).forEach((key) => {
//         const apiItem = module[key]
//         if (!apiItem.url || !apiItem.method) {
//           delete module[key]
//         }
//       })
//     })
//   })
//   return tabApimap
// }

// 创建内容文件
function buildApimapFile (tabFolder, curApimap) {
  const exportCode = `export default `
  const exportData = {}
  // const keys = Object.keys(curApimap)
  Object.keys(curApimap).forEach((module) => {
    const apiModule = curApimap[module]
    !exportData[module] && (exportData[module] = {})
    buildApimapContent(apiModule, exportData[module])
  })
  return {
    path: `${tabFolder}/index.js`,
    content: `${exportCode}${object2file(exportData)}`
  }
}

// apiModule: list, approval, apply
function buildApimapContent (apiModule, res) {
  Object.keys(apiModule).forEach((apiName) => {
    const apiInfo = apiModule[apiName]
    if (isObject(apiInfo)) {
      if (apiInfo.hasOwnProperty('url') && apiInfo.url) {
        res[apiName] = buildFunctionName(apiInfo)
      } else {
        !res[apiName] && (res[apiName] = {})
        return buildApimapContent(apiInfo, res[apiName])
      }
    }
  })
}

// 创建引导文件
function buildApiFuncFile (tabApimap, apiFuncFile) {
  const tabIndexs = Object.keys(tabApimap)
  const importCode1 = `import http from '@/utils/http'\n`
  const importCode2 = `import utils from '@/utils'\n`
  const exportCode = `export default `
  const exportData = {}
  tabIndexs.forEach((tabIndex) => {
    const curApimap = tabApimap[tabIndex]
    buildApiFunString(exportData, curApimap)
  })
  return {
    path: apiFuncFile,
    content: `${importCode1}${hasExportApi ? importCode2 : ''}${exportCode}${object2file(exportData)}`
  }
}

function buildApiFunString (exportData, curApimap) {
  Object.keys(curApimap).forEach((module) => {
    const apiModule = curApimap[module]
    // res[tabIndex].approval.submit = packageApiFunction(apimapItem.approval.submit)
    // res[tabIndex].approval.detail = packageApiFunction(apimapItem.approval.detail)
    // res[tabIndex].apply.submit = packageApiFunction(apimapItem.apply.submit)
    // res[tabIndex].list.batch = packageBtachApi(apimapItem.list.batch)
    // res[tabIndex].list.table.dataDir = apimapItem.list.table.dataDir
    // res[tabIndex].list.table.dataApi = packageApiFunction(apimapItem.list.table.dataApi)
    buildApiFuncContent(apiModule, exportData)
  })
  return exportData
}

// apiModule: list, approval, apply
function buildApiFuncContent (apiModule, res) {
  Object.keys(apiModule).forEach((apiName) => {
    const apiInfo = apiModule[apiName]
    if (isObject(apiInfo)) {
      if (apiInfo.hasOwnProperty('url') && apiInfo.url) {
        // if (!apiInfo.isAlready) {
        const name = buildFunctionName(apiInfo)
        const args = apiInfo.arguments
        const method = apiInfo.method
        const paramString = createParamString(apiInfo)
        const isExportApi = ['exportGetFile', 'exportPostFile'].includes(method)
        if (isExportApi) hasExportApi = true
        res[name] = stringMark.noQuotation(`function (${args}) {
          return ${isExportApi ? 'utils' : 'http'}.${method}(\`${apiInfo.url}\`${paramString ? ',' : ''}${paramString})
        }`)
        // }
      } else {
        return buildApiFuncContent(apiInfo, res)
      }
    }
  })
}

// 用url和method拼装成函数名，需要去掉 / 和 - _
function buildFunctionName ({ name, method, url }) {
  if (name) {
    return name
  } else {
    return `${method}${url.replace(/[\/\-_]/g, '')}`
  }
}

function createParamString (apiItem = {}) {
  // let res
  // // 如果params没有设置，那么直接返回 params 字符串
  if (!apiItem.params ||
    isEmptyObject(apiItem.params) ||
    isEmptyArray(apiItem.params)) {
    return ''
  }
  // if (typeof apiItem.params === 'string') res = apiItem.params
  // const keys = Object.keys(apiItem.params)
  // keys.forEach((key, index) => {
  //   // const val = `params.${key}`
  //   res[key] = `params.${key}`
  //   // const dot = index === keys.length - 1 ? '' : ','
  //   // const brk = index === keys.length - 1 ? '' : '\n'
  //   // const space = getInsertSpace(res)
  //   // const sign = index === keys.length - 1 ? '' : `${space}_insert_`
  //   // res = res.replace(/_insert_/g, `${key}: ${val}${dot}${brk}${sign}`)
  // })
  if (apiItem.method === 'GET') {
    return object2file({
      params: apiItem.params
    })
  } else {
    if (isString) {
      return apiItem.params
    } else {
      return object2file(apiItem.params)
    }
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
