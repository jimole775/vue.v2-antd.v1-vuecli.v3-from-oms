// import mock from './mock.json'
// import { object2file } from '@builder/utils'
const basePath = './src/router/modules'
// buildRouter(mock)
export default function buildRouter (routerConfig) {
  const routerFiles = [
    // {
    //   path: '',
    //   content: ''
    // }
  ]
  routerFiles.push(buildRouteFile(routerConfig))
  return routerFiles
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
  return {
    path: `${basePath}/${moduleName}.js`,
    content: `${exportCmd}`
  }
}
