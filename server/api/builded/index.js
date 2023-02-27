const path = require('path')
const prettierrc = require(global.path.root('.prettierrc.js'))
const recordId = require(global.path.common('record-id.js'))
const buildConstruct = require(global.path.server('constructor'))
const { writeFileSync, readDirSync, readFileSync } = require(global.path.utils())
const { execSync } = require('child_process')
const prettier = require('prettier')
const distPath = global.path.root('builder-dist')
module.exports = function (req, res) {
  return new Promise((resolve) => {
    const { buildData } = req.body
    if (buildData) {
      try {
        if (buildData.name === global.const.demo_name) {
          return resolve(`“${global.const.demo_name}”属于样例项目，只支持预览功能！`)
        }
        recordId(buildData.name)
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
    const fileType = evalFileType(info.path)
    const codes = prettier.format(info.content, { ...prettierrc, parser: evalParser(fileType) })
    writeFileSync(path.join(distPath, info.path), codes)
  })
}

function evalFileType (path) {
  if (!path) return ''
  return path.split('.').pop()
}

function evalParser (fileType) {
  const map = {
    [fileType]: fileType,
    js: 'babel',
    md: 'markdown',
    ts: 'babel-ts',
    flow: 'babel-flow'
  }
  return map[fileType]
}

// function storeBuildData (buildData) {
//   const fileInfos = buildConstruct(buildData)
//   fileInfos.forEach((info) => {
//     writeFileSync(path.join(distPath, info.path), info.content)
//   })
// }

function runScripts (buildData, resolve) {
  const errorLog = path.join(global.path.root('./logs/builder-error.log'))
  const gitEventsShell = path.join(global.path.root('./scripts/git_events.sh'))

  const projectName = buildData.router.name || ''
  if (!projectName) return resolve(`构建失败: ${projectName} 项目名异常！`)

  const dists = readDirSync(distPath)
  if (!dists || !dists.length) return resolve(`构建失败: ${distPath} 没有创建！`)

  // 执行脚本
  execSync(`"${gitEventsShell}" ${projectName}`, { cwd: global.path.root() })

  // 如果新的错误日志有内容，证明构建失败
  const content = readFileSync(errorLog)
  if (content && content.length) {
    return resolve(`构建失败: ${content.split('\n')[0]}`)
  } else {
    return resolve({
      data: '创建成功'
    })
  }
}
