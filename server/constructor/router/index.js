// import mock from './mock.json'
const { toCamelCase } = require(global.path.utils())
const recordId = require(global.path.common('record-id.js'))
module.exports = function buildRouter (router) {
  const routerFiles = [
    // {
    //   path: '',
    //   content: ''
    // }
  ]
  routerFiles.push(createMockMenu(router))
  routerFiles.push(buildRouteFile(router))
  return routerFiles
}

function buildRouteFile ({ path: routePath, parent: parentName, name: moduleName }) {
  let parentPath = ''
  let routerFile = ''
  if (parentName === 'views') {
    parentPath = ''
    routerFile = `/src/router/modules/${moduleName}.js`
  } else {
    parentPath = `${parentName}/`
    routerFile = `/src/router/modules/${parentName}.js`
  }

  // 把路径的/去掉，并把首字母转成大写
  const routeName = toCamelCase(routePath, '\/')
  const component = `() => import('@/views/${parentPath}${moduleName}/index.vue')`
  return {
    path: routerFile,
    content: `export default {
      path: '${routePath}',
      name: '${routeName}',
      component: ${component}
    }`
  }
}

function createMockMenu ({ path: routePath, menuName, name: moduleName }) {
  // {
  //   "flag": null,
  //   "icon": "fa-code",
  //   "id": 900001,
  //   "order": 1,
  //   "parentId": 0,
  //   "path": "/helper/examples",
  //   "title": "组件样例"
  // }
  // todo 先收集已有 ID，再决定 ID，避免重复
  return {
    path: `/src/mock/menus/modules/${moduleName}.json`,
    content: `{
      "id": ${recordId(moduleName)},
      "order": 1,
      "parentId": 0,
      "flag": null,
      "icon": "fa-code",
      "path": "${routePath}",
      "title": "${menuName}"
    }`
  }
}
