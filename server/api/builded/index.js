const fs = require('fs')
const path = require('path')
const { writeFileSync, readDirSync, readFileSync } = require('../../utils')
const buildConstruct = require('../../constructor')
const { execSync } = require('child_process')
const distPath = './builder-dist'
// const db = './server/data-base/build-data'
module.exports = function (req, res) {
  return new Promise((resolve) => {
    const { buildData } = req.body
    if (buildData) {
      try {
        buildCodeFiles(buildData)
        runScripts(buildData, resolve)
      } catch (error) {
        return resolve(`服务器解析异常: ${error}`)
      }
    } else {
      return resolve('参数不能为空！')
    }
  })
}

function buildCodeFiles (buildData) {
  const fileInfos = buildConstruct(buildData)
  fileInfos.forEach((info) => {
    writeFileSync(path.join(distPath, info.path), info.content)
  })
}

// function storeBuildData (buildData) {
//   const fileInfos = buildConstruct(buildData)
//   fileInfos.forEach((info) => {
//     writeFileSync(path.join(distPath, info.path), info.content)
//   })
// }

function runScripts (buildData, resolve) {
  const errorLog = path.join(global.src_path, './builder-error.log')
  const gitEventsShell = path.join(global.src_path, './scripts/git_events.sh')
  const projectName = buildData.name
  // 判断有没有 /builder-dist 目录
  const dists = readDirSync(distPath)
  if (dists && dists.length) {
    // 先删除错入日志
    fs.rmSync(errorLog, { force: true })

    // 执行脚本
    execSync(`"${gitEventsShell}" ${projectName}`, { cwd: global.src_path })

    // 如果新的错误日志有内容，证明构建失败
    const content = readFileSync(errorLog)
    if (content && content.length) {
      return resolve(`构建失败: ${content.split('\n')[0]}`)
    } else {
      return resolve({
        data: '创建成功'
      })
    }
  } else {
    return resolve(`构建失败: ${distPath} 没有创建！`)
  }
}
