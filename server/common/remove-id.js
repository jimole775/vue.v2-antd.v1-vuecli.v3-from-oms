const nameIdDB = 'chunks/name-id.json'
const { writeFileSync } = require(global.path.utils())
module.exports = function removeId (projectName) {
  const nameIdMap = require(global.path.db(nameIdDB))
  if (nameIdMap.hasOwnProperty(projectName)) {
    delete nameIdMap[projectName]
    writeFileSync(nameIdDB, nameIdMap)
  }
}
