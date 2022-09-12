const os = require('os')
const { execSync } = require('child_process')
const readline = require('readline')
const {
  existsSync, rmSync, mkdirSync, writeFileSync
} = require('fs')
const PACKAGE_FILE = './package.json'
const PACKAGE_FILE_LOCK = './package-lock.json'
const DOCUMENT_DIST = 'docs'
const CHANGELOG = `${DOCUMENT_DIST}/CHANGELOG.md`
const CMD_PARAMS = getCmdParams()
const STORE_NAME = cmd('git remote show -n')
const BRANCH_NAME = cmd('git rev-parse --abbrev-ref HEAD')
const VERSION_LIMIT = '99.99.99'
const VERSION_REGEXP = /\d{1,2}\.\d{1,2}\.\d{1,2}/
// const VERSION_TYPES = ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease']
const PARAMETER_ACCESS = ['v', 'version', 'm', 'message']
const CHANGELOG_TYPE = { WHOLE: 0, DEFAULT: 1, APPEND: 2 }
const CURRENT_VERSION = getCurrentVersion()
const NEXT_VERSION = growupVersionNumber(CURRENT_VERSION)

main()
async function main () {
  await configUserInfo()
  await stashGitWorkspace()
  await updateVersion()
  await updateChangelog()
  await updateTag()
  await distashGitWorkspace()
}

async function updateVersion () {
  await modifyFileVersoion(PACKAGE_FILE)
  await modifyFileVersoion(PACKAGE_FILE_LOCK)
  return Promise.resolve()
}

function modifyFileVersoion (fileName) {
  return new Promise(async (resolve) => {
    if (!existsSync(fileName)) return resolve('')
    const json = require(fileName)
    json.version = NEXT_VERSION
    const depend = json.dependencies[json.name]
    if (depend) depend.version = NEXT_VERSION
    const pertyCodes = await codesPretting(JSON.stringify(json))
    writeFileSync(fileName, pertyCodes, { encoding: 'utf8' })
    resolve('')
  })
}

async function updateChangelog () {
  // 运行之前，需要在当前项目确认 commitizen, cz-conventional-changelog 已经安装
  // 1. 安装 commitizen 指令
  // `npm install --save-dev commitizen`
  // 2. 安装cz-conventional-changelog包，并初始化 conventional-changelog 的配置
  // `commitizen init cz-conventional-changelog --save --save-exact`
  // 3. 生产log
  // `conventional-changelog -p angular -i ${CHANGELOG} -s -r ${logType}`
  let logType = CHANGELOG_TYPE.APPEND

  if (!existsSync(DOCUMENT_DIST)) mkdirSync(DOCUMENT_DIST)

  if (!existsSync(CHANGELOG)) {
    logType = CHANGELOG_TYPE.WHOLE
  } else {
    if (['minor', 'major', 'preminor', 'premajor'].includes(CMD_PARAMS.v || CMD_PARAMS.version)) {
      rmSync(CHANGELOG)
      logType = CHANGELOG_TYPE.APPEND
    }
  }
  await callPackage('commitizen')

  cmd(`commitizen init cz-conventional-changelog --save --save-exact`)
  cmd(`conventional-changelog -p angular -i ${CHANGELOG} -s -r ${logType}`)
  cmd(`git add ${CHANGELOG}`)
  cmd(`git commit ${CHANGELOG} -m \"chore: 创建周迭代CHANGELOG\"`)
  return Promise.resolve()
}

function updateTag () {
  const date = getDate()
  const message = CMD_PARAMS.m || CMD_PARAMS.message
  cmd('git add .')
  cmd(`git commit -m "chore: update version to ${NEXT_VERSION}"`)
  cmd(`git tag -a v${NEXT_VERSION} -m "${message || date}"`)
  cmd(`git push ${STORE_NAME} ${BRANCH_NAME}`)
  cmd(`git push --tags`)
  return Promise.resolve()
}

function growupVersionNumber (v) {
  // todo 重新考虑【预】发版类型 prexxx 的版本号的处理逻辑
  // 参考：https://blog.csdn.net/weixin_35665584/article/details/112885247
  const limitArray = VERSION_LIMIT.split('.')
  const majorLimit = Number(limitArray[0])
  const minorLimit = Number(limitArray[1])
  const patchLimit = Number(limitArray[2])

  let growType = CMD_PARAMS.v || CMD_PARAMS.version
  // 如果 growType 为版本号，直接返回
  if (VERSION_REGEXP.test(growType)) return growType
  // 如果没定义 growType
  // 设置默认升级小版本 patch
  growType = growType || 'patch'
  let majorVersion = Number(v.split('.')[0])
  let minorVersion = Number(v.split('.')[1])
  let patchVersion = Number(v.split('.')[2])
  let operator = getOperator(growType)
  if (['patch', 'prepatch'].includes(growType)) {
    updatePatch(operator)
  }

  if (['minor', 'preminor'].includes(growType)) {
    updateMinor(operator)
  }

  if (['major', 'premajor'].includes(growType)) {
    updateMajor(operator)
  }

  return `${majorVersion}.${minorVersion}.${patchVersion}`

  function updateMajor (opr) {
    patchVersion = 0
    minorVersion = 0
    majorVersion = eval(`majorVersion${opr}1`)
    if (majorVersion < 0) {
      patchVersion = 0
      minorVersion = 0
      majorVersion = 0
    }
    if (majorVersion > majorLimit) {
      patchVersion = patchLimit
      minorVersion = minorLimit
      majorVersion = majorLimit
    }
  }
  function updateMinor (opr) {
    minorVersion = eval(`minorVersion${opr}1`)
    patchVersion = 0
    if (minorVersion < 0) minorVersion = 0
    if (minorVersion > minorLimit) updateMajor('+')
  }
  function updatePatch (opr) {
    patchVersion = eval(`patchVersion${opr}1`)
    if (patchVersion < 0) patchVersion = 0
    if (patchVersion > patchLimit) updateMinor('+')
  }
  function getOperator (desc) {
    if (/^pre/.test(desc)) {
      return '-'
    } else {
      return '+'
    }
  }
}

function getCurrentVersion () {
  const tag = cmd('git describe --tags')
  if (VERSION_REGEXP.test(tag)) {
    return tag.replace('v', '')
  } else {
    return '1.0.0'
  }
}

// function renameFile (fileName) {
//   try {
//     rmSync(fileName)
//     renameSync('tmp.' + fileName, fileName)
//     return Promise.resolve()
//   } catch (error) {
//     return Promise.reject(error)
//   }
// }

function getCmdParams () {
  const res = {}
  const paramReg = /^-\w[\w-_]*&/ig
  const args = process.argv || []
  args.forEach((item, index) => {
    if (item && paramReg.test(item)) {
      const key = item.replace('-', '')
      const val = args[index + 1] || ''
      if (PARAMETER_ACCESS.includes(key)) {
        res[key] = val
      }
    }
  })
  return res
}

function getDate () {
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = date.getMonth() + 1
  const dd = date.getDate()
  return `${yyyy}-${mm}-${dd}`
}

function stashGitWorkspace() {
  const status = cmd('git status -s')
  if (status && status.length) {
    cmd('git add .')
    cmd('git stash save "for update version"')
    global.$hasdStash = true
  }
  // 先push一次，防止当前分支是未推送过的分支
  cmd(`git push --set-upstream ${STORE_NAME} ${BRANCH_NAME}`)
  // 保持最新，避免冲突
  cmd(`git pull ${STORE_NAME} ${BRANCH_NAME}`)
  return Promise.resolve()
}

function distashGitWorkspace() {
  if (global.$hasdStash) {
    cmd('git stash pop 0')
    delete global.$hasdStash
  }
  return Promise.resolve()
}

function cmd (line) {
  try {
    const res = execSync(line, { encoding: 'utf8' })
    return typeof res === 'string' ? res.trim() : res
  } catch (error) {
    return ''
  }
}

async function codesPretting (content) {
  const prettier = await callPackage('prettier')
  return prettier.format(content, { parser: 'json' })
}

function callPackage (packzip) {
  return new Promise((resolve) => {
    loop(packzip, resolve)
  })
  function loop(packzip, resolve) {
    try {
      resolve(require(packzip))
    } catch (error) {
      execSync(`npm install --save-dev ${packzip}`)
      loop(packzip, resolve)
    }
  }
}

// 判断需不需要配置git的user信息
function configUserInfo () {
  return new Promise((resolve) => {
    const queryStax = isWindows() ? 'findstr user' : 'grep user'
    const localGitUserInfo = cmd(`git config --local --list | ${queryStax}`)
    const globalGitUserInfo = cmd(`git config --global --list | ${queryStax}`)
    const regx = /(user\.(email|name)[=.\r\n@\w\d'"]*?user\.(email|name))/ig
    // local 和 global，只要有一个有就行
    const hadUserInfo = regx.test(`${localGitUserInfo}${globalGitUserInfo}`)
    if (!hadUserInfo) {
      const inquirer = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })

      inquirer.question('please config your gitlab\'s user.name:', (name) => {
        if (name && name.length) {
          cmd(`git config --local user.name ${name.trim()}`)
          inquirer.question('please config your gitlab\'s user.email:', (email) => {
            if (email && email.length) {
              cmd(`git config --local user.email ${email.trim()}`)
              inquirer.close()
              resolve('')
            }
          })
        }
      })
    } else {
      resolve('')
    }
  })
}

// todo 版本是否重复的判断，应该从最后一个 commit 的内容开始判断
// function isDupVersion () {
//   // if (CURRENT_VERSION)
//   console.log('That is duplicate version number, maybe has not featrue to be update!')
// }

function isWindows () {
  const platform = os.platform()
  return /^win/.test(platform)
}

// todo 中间报错需要帮助用户进行操作回滚
