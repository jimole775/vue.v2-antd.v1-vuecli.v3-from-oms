import apimap from './apimap'
import approval from './approval'
import list from './list'
import tabs from './tabs'

/**
 * viewData结构："./constructor/view.yaml"
 * buildData结构："./constructor/build.yaml"
 * @param {Object} viewData
 * @returns buildData
 */
export default function (viewData = {}) {
  const buildData = Object.create(null)
  buildData['apimap'] = apimap(viewData, buildData)

  Object.keys(viewData).forEach((key) => {
    const module = viewData[key]
    switch (key) {
      case 'list':
        !buildData['list'] && (buildData['list'] = {})
        Object.keys(module).forEach((rank) => {
          const value = module[rank] || {}
          const table = value.table || {}
          buildData['list'][rank] = list(table)
        })
        break
      case 'approval':
        !buildData['approval'] && (buildData['approval'] = {})
        Object.keys(module).forEach((rank) => {
          const value = module[rank] || {}
          buildData['approval'][rank] = approval(value)
        })
        break
      case 'tabs':
        const tabsBuild = tabs(module, viewData['approval'])
        buildData[key] = tabsBuild
        break
      case 'name':
      case 'router':
        buildData[key] = module
        break
    }
  })

  return buildData
}
