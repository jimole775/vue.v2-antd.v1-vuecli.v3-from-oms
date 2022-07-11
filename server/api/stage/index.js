const { writeFileSync } = require(global.path.utils())
const recordId = require(global.path.common('record-id.js'))
module.exports = function (req, res) {
  return new Promise((resolve) => {
    const { viewData } = req.body
    if (viewData) {
      if (!viewData.name) {
        return resolve('请确认项目名再暂存！')
      }
      try {
        if (viewData.name === 'builder-demo') {
          return resolve('“builder-demo”属于样例项目，只支持预览功能！')
        }
        viewData.id = recordId(viewData.name)
        writeFileSync(global.path.db('view-data/', viewData.name + '.json'), viewData)
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
