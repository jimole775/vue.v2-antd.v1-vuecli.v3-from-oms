const { object2file } = require(global.path.utils())
module.exports = function buildTabs (tabsArray, { name: moduleName, parent: parentName }, basePath) {
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
