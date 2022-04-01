const { getBranchs } = require('../../utils')
module.exports = function (req, res) {
  return new Promise((resolve) => {
    const branchs = getBranchs()
    if (branchs && branchs.length) {
      return resolve({ branchs })
    } else {
      return resolve('获取失败！')
    }
  })
}
