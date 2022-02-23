const path = require('path')
const { writeFileSync, object2file } = require('../../utils')
const basePath = 'tabs'
const mock = require('./mock.json')
buildTabs(mock)
function buildTabs (tabsArray) {
  const exportCode = `export default `
  const exportData = object2file(tabsArray)
  writeFileSync(path.join(basePath, 'index.js'), `${exportCode}${exportData}`)
}
