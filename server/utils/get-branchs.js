const { execSync } = require('child_process')
const getSentences = require('./get-sentences')
const unique = require('./unique')
module.exports = function getBranchs () {
  const branchsBuffer = execSync('git branch -a')
  const branchTexts = branchsBuffer.toString('utf-8')
  const branchArray = getSentences(branchTexts)
  const branchNames = branchArray.map((log) => {
    const name = log.replace(/^[\*\s]*([\w\d-_\/\\]+)/i, '$1')
    return name.split('\/').pop()
  }).filter(i => i)
  return unique(branchNames)
}
