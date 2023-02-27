const { readFileSync } = require(global.path.utils())
// const demoDb = global.path.db('/demo/builder-demo.json')
module.exports = function (req, res) {
  return new Promise((resolve) => {
    const { name } = req.query
    if (name) {
      try {
        const midPath = name === global.const.demo_name ? 'demo' : 'view-data'
        const viewData = readFileSync(global.path.db(midPath, `${name}.json`))
        return resolve({ viewData })
      } catch (error) {
        return resolve('获取失败:', error)
      }
    } else {
      return resolve('参数不能为空！')
    }
  })
}
