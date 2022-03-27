const fs = require('fs')
const path = require('path')
const db = './server/data-base/view-data'
module.exports = function (req, res) {
  const resData = {
    data: '删除成功'
  }
  return new Promise((resolve) => {
    const { name } = req.body
    if (name) {
      try {
        fs.rmSync(path.join(db, name + '.json'))
        return resolve(resData)
      } catch (error) {
        return resolve(`服务器解析异常: ${error}`)
      }
    } else {
      return resolve('参数不能为空！')
    }
  })
}
