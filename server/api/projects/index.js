// const path = require('path')
// const db = './server/data-base/view-data'
// const demoDb = './server/data-base/demo'
const { readDirSync, readFileSync } = require(global.path.utils())
module.exports = function (req, res) {
  return new Promise((resolve) => {
    try {
      const projectNames = readDirSync(global.path.db('view-data'))
      const demoProject = readFileSync(global.path.db('/demo/builder-demo.json'))
      const projects = [demoProject]
      projectNames.forEach(name => {
        const jsonObject = readFileSync(global.path.db('view-data', name))
        projects.push({ ...jsonObject.router, id: jsonObject.id })
      })
      return resolve({ projects })
    } catch (error) {
      return resolve('获取失败:', error)
    }
  })
}
