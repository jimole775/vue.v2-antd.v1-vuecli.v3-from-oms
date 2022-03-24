const path = require('path')
const { writeFileSync, readDirSync } = require('../../utils')
const buildConstruct = require('../../constructor')
const { execSync } = require('child_process')
const basePath = './builder-dist'
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
        const gitEvents = path.join(global.src_path, './scripts/git_events.sh')
        // 判断有没有 /builder-dist 目录
        if (dists && dists.length) {
          execSync(`"${gitEvents}" ${moduleName}`, { cwd: global.src_path })
          return resolve(resData)
        } else {
          return resolve(`服务器解析异常: ${basePath} 没有创建！`)
        }
      } catch (error) {
        return resolve(`服务器解析异常: ${error}`)
      }
    } else {
      return resolve('参数不能为空！')
    }
  })
}
