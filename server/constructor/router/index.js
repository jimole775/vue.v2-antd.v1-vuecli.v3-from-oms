// import mock from './mock.json'
// import { object2file } from '@builder/utils'
// const basePath = './src/router/modules'
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
  let exportCmd = 'export default {\n'
  // 把路径的/去掉，并把首字母转成大写
  const routeName = routePath.replace(/\/\w/g, m => m.toUpperCase().replace(/\//, ''))
  const component = `() => import('@/views/${parentPath}${moduleName}/index.vue')`
  exportCmd += `  path: '${routePath}',\n`
  exportCmd += `  name: '${routeName}',\n`
  exportCmd += `  component: ${component}\n`
  exportCmd += `}\n`
  return {
    path: routerFile,
    content: `${exportCmd}`
  }
}
