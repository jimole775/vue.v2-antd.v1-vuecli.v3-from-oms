/**
 * 记录并返回ID
 */
const nameIdDB = global.path.db('chunks', 'name-id.json')
const { writeFileSync } = require(global.path.utils())
module.exports = function recordId (projectName) {
  const nameIdMap = require(nameIdDB)
  if (!nameIdMap.hasOwnProperty(projectName)) {
    const ids = Object.values(nameIdMap)
    const lastId = ids.sort((a, b) => a - b).pop()
    nameIdMap[projectName] = lastId + 1
    writeFileSync(nameIdDB, nameIdMap)
    return lastId
  } else {
    return nameIdMap[projectName]
  }
}
