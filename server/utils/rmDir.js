const fs = require('fs')
// const path = require('path')
/**
 * 删除目录【慎用】
 * @param { String } asbFilePath 绝对路径
 * @return { undefined }
 */
module.exports = async function rmDir (asbFilePath) {
  console.log('asbFilePath:', asbFilePath)
  const isExist = fs.existsSync(asbFilePath)
  if (!isExist) return false
  const res = await fs.rmdirSync(asbFilePath)
  return res
}
