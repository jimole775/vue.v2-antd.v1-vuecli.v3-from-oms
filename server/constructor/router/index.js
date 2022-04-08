// import mock from './mock.json'
const { toCamelCase } = require('../../utils')
// buildRouter(mock)
module.exports = function buildRouter (routerConfig) {
  const routerFiles = [
    // {
    //   path: '',
    //   content: ''
    // }
  ]
  routerFiles.push(buildRouteFile(routerConfig))
  return routerFiles
}

function buildRouteFile ({ path: routePath, parent: parentName, name: moduleName }) {
  const parentPath = parentName ? `${parentName}/` : ''
  const routerFile = `/src/router/modules/${parentPath}${moduleName}.js`
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
