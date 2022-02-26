const path = require('path')
const { writeFileSync, object2file } = require('../../utils')
const basePath = './src/router/modules'
const mock = require('./mock.json')
buildRouter(mock)
function buildRouter (routerConfig) {
  buildRouteFile(routerConfig)
}
function buildRouteFile (routerConfig) {
  let exportCmd = 'export default {\n'
  const moduleName = routerConfig.name
  const routeParent = routerConfig.parent
  const routePath = routerConfig.path
  const routeName = routePath.replace(/\/\w/g, m => m.toUpperCase().replace(/\//, ''))
  const component = `() => import('@/views/${routeParent ? routeParent + '/' : ''}${moduleName}/index.vue')`
  exportCmd += `  path: '${routePath}',\n`
  exportCmd += `  name: '${routeName}',\n`
  exportCmd += `  component: ${component}\n`
  exportCmd += `}\n`
  writeFileSync(
    path.join(basePath, `${moduleName}.js`),
    `${exportCmd}`
  )
}
