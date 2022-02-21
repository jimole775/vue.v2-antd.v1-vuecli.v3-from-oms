const buildTabs = require('./approval')
module.exports = function (req, res) {
  const resData = {
    data: '创建成功'
  }
  return new Promise((resolve) => {
    const { buildConstructs } = req.body
    if (!buildConstructs) {
      return resolve('参数不能为空！')
    } else {
      return resolve(resData)
    }
  })
}
