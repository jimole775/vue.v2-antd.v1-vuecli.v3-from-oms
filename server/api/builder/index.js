const path = require('path')
const { writeFileSync, readDirSync } = require('../../utils')
const buildConstruct = require('../../constructor')
const { exec } = require('child_process')
const basePath = './dist'
module.exports = function (req, res) {
  const resData = {
    data: '创建成功'
  }
  return new Promise((resolve) => {
    const { buildData } = req.body
    if (buildData) {
      try {
        const fileInfos = buildConstruct(buildData)
        fileInfos.forEach((info) => {
          writeFileSync(path.join(basePath, info.path), info.content)
        })
        const moduleName = buildData.routerConfig.name
        const dists = readDirSync(basePath)
        if (dists && dists.length) {
          exec(`"./scripts/git_before_build.sh ${moduleName}"`, () => {
            exec('"./scripts/move_files.sh"')
          })
        }
        return resolve(resData)
      } catch (error) {
        return resolve(`服务器解析异常: ${error}`)
      }
    } else {
      return resolve('参数不能为空！')
    }
  })
}
