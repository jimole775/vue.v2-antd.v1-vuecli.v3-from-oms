const path = require('path')
const { readFileSync } = require('../../utils')
const db = './server/data-base/view-data'
module.exports = function (req, res) {
  return new Promise((resolve) => {
    const { name } = req.body
    if (name) {
      try {
        const viewData = readFileSync(path.join(db, name + '.json'))
        return resolve({
          data: { viewData }
        })
      } catch (error) {
        return resolve('获取失败:', error)
      }
    } else {
      return resolve('参数不能为空！')
    }
  })
}
