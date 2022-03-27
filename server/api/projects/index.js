const path = require('path')
const { readDirSync } = require('../../utils')
const db = './server/data-base/view-data'
module.exports = function (req, res) {
  return new Promise((resolve) => {
    try {
      const projects = readDirSync(path.join(db, './'))
      return resolve({
        data: {
          projects: projects.map(i => i.replace(/\.json$/, ''))
        }
      })
    } catch (error) {
      return resolve('获取失败:', error)
    }
  })
}
