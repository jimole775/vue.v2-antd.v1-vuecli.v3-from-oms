const fs = require('fs')
const removeId = require(global.path.common('remove-id.js'))
module.exports = function (req, res) {
  const resData = {
    data: '删除成功'
  }
  return new Promise((resolve) => {
    const { name } = req.body
    if (name) {
      try {
        fs.rmSync(global.path.db('/view-data/', name + '.json'))
        removeId(name)
        return resolve(resData)
      } catch (error) {
        return resolve(`服务器解析异常: ${error}`)
      }
    } else {
      return resolve('参数不能为空！')
    }
  })
}
