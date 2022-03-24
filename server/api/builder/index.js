const fs = require('fs')
const path = require('path')
const { writeFileSync, readDirSync, readFileSync } = require('../../utils')
const buildConstruct = require('../../constructor')
const { execSync } = require('child_process')
const distPath = './builder-dist'
const errorLog = path.join(global.src_path, './builder-error.log')
const gitEventsShell = path.join(global.src_path, './scripts/git_events.sh')
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
          writeFileSync(path.join(distPath, info.path), info.content)
        })
        const moduleName = buildData.routerConfig.name
        const dists = readDirSync(distPath)
        // 判断有没有 /builder-dist 目录
        if (dists && dists.length) {
          delBuilderErrorFile()
          execSync(`"${gitEventsShell}" ${moduleName}`, { cwd: global.src_path })
          const errors = readBuilderErrorFile()
          if (errors && errors.length) {
            return resolve(`构建失败: ${errors[0]}`)
          } else {
            return resolve(resData)
          }
        } else {
          return resolve(`构建失败: ${distPath} 没有创建！`)
        }
      } catch (error) {
        return resolve(`服务器解析异常: ${error}`)
      }
    } else {
      return resolve('参数不能为空！')
    }
  })
}

function delBuilderErrorFile () {
  fs.rmSync(errorLog, { force: true })
}

function readBuilderErrorFile () {
  const content = readFileSync(errorLog)
  return content.split('\n')
}
