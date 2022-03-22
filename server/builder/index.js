const path = require('path')
const { writeFileSync } = require('../utils')
const buildConstruct = require('../constructor')
const basePath = './dist'
module.exports = function (req, res) {
  const resData = {
    data: '创建成功'
  }
  return new Promise((resolve) => {
    const { buildData } = req.body
    if (buildData) {
      const fileInfos = buildConstruct(buildData)
      fileInfos.forEach((info) => {
        writeFileSync(path.join(basePath, info.path), info.content)
      })
      return resolve(resData)
    } else {
      return resolve('参数不能为空！')
    }
  })
}
