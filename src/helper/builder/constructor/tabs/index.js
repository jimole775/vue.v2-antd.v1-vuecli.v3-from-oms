// import mock from './mock.json'
import { object2file } from '@builder/utils'
const basePath = 'tabs'
// buildTabs(mock)
export default function buildTabs (tabsArray) {
  const tabFiles = [
    // {
    //   path: '',
    //   content: ''
    // }
  ]
  const exportCode = `export default `
  const exportData = object2file(tabsArray)
  tabFiles.push({
    path: `${basePath}/index.js`,
    content: `${exportCode}${exportData}`
  })
  return tabFiles
}
