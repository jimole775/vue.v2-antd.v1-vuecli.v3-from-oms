const nameIdDB = global.path.db('chunks', 'name-id.json')
const { writeFileSync } = require(global.path.utils())
module.exports = function removeId (projectName) {
  const nameIdMap = require(nameIdDB)
  if (nameIdMap.hasOwnProperty(projectName)) {
    delete nameIdMap[projectName]
    writeFileSync(nameIdDB, nameIdMap)
  }
}
