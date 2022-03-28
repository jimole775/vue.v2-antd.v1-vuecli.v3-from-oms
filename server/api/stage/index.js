const path = require('path')
const { writeFileSync } = require('../../utils')
const db = './server/data-base/view-data'
module.exports = function (req, res) {
  return new Promise((resolve) => {
    const { viewData } = req.body
    if (viewData) {
      if (!viewData.name) {
        return resolve('请确认项目名再暂存！')
      }
      try {
        writeFileSync(path.join(db, viewData.name + '.json'), viewData)
        return resolve({
          name: viewData.name
        })
      } catch (error) {
        return resolve('暂存失败:', error)
      }
    } else {
      return resolve('参数不能为空！')
    }
  })
}
