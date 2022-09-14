const os = require('os')
const { execSync } = require('child_process')
const readline = require('readline')
const {
  existsSync, rmSync, mkdirSync, writeFileSync, createReadStream
} = require('fs')
const HASH_LENGTH = 7
const PACKAGE_FILE = './package.json'
const PACKAGE_FILE_LOCK = './package-lock.json'
const DOCUMENT_DIST = 'docs'
const CHANGELOG = `${DOCUMENT_DIST}/CHANGELOG.md`
const VERSION_LIMIT = '99.99.99-999'
const VERSION_REGEXP = /\d{1,2}\.\d{1,2}\.\d{1,2}(-\d{1,})/
// const VERSION_TYPES = ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease']
const PARAMETER_ACCESS = ['v', 'version', 'm', 'message', 't', 'test']
const CHANGELOG_TYPE = { WHOLE: 0, DEFAULT: 1, APPEND: 2 }

const STORE_NAME = cmd('git remote show -n')
const BRANCH_NAME = cmd('git rev-parse --abbrev-ref HEAD')

const CMD_PARAMS = getCmdParams()
const CURRENT_VERSION = getCurrentVersion()
const NEXT_VERSION = growupVersionNumber(CURRENT_VERSION)

const MESSAGE = {
  DUCPLICATE: 'that is a commit version already in CHANGLOG.md, maybe has not featrue to be update.',
  VERSION: `"chore: updates version ${CURRENT_VERSION} to ${NEXT_VERSION}"`,
  CHANGELOG: `"chore: creates CHANGELOG.md of iteration version which ${NEXT_VERSION}"`
}

const rollbackStack = {
  stash: [],
  version: [],
  changelog: [],
  tag: []
}

!CMD_PARAMS.t && main()

async function main () {
  monitor()
  await configUserInfo()
  await stashGitWorkspace()
  await updateVersion()
  await updateChangelog()
  await updateTag()
  await distashGitWorkspace()
  resetRollbackStack()
  process.exit(0)
}

async function cmdRevert (message) {
  console.log(message)
  await revertTag()
  await revertChangelog()
  await revertVersion()
  await distashGitWorkspace()
  resetRollbackStack()
  process.exit(0)
}

function monitor () {
  process.on('SIGINT', cmdRevert)
  process.on('SIGTERM', cmdRevert)
  process.on('unhandledRejection', cmdRevert)
  process.on('uncaughtException', cmdRevert)
}

function resetRollbackStack () {
  rollbackStack.stash = []
  rollbackStack.version = []
  rollbackStack.changelog = []
  rollbackStack.tag = []
}

async function updateVersion () {
  const dupLine = await getDuplicateVersion()
  if (dupLine) {
    const message = `${MESSAGE.DUCPLICATE}\nduplicate commit: ${dupLine}.\n`
    return Promise.reject(new Error(message))
  }
  await modifyFileVersoion(PACKAGE_FILE)
  await modifyFileVersoion(PACKAGE_FILE_LOCK)
  rollbackStack.version.push([cmd, `git checkout -q ${PACKAGE_FILE}`])
  rollbackStack.version.push([cmd, `git checkout -q ${PACKAGE_FILE_LOCK}`])

  cmd('git add .')
  rollbackStack.version.push([cmd, 'git reset -q HEAD'])

  cmd(`git commit -m ${MESSAGE.VERSION}`)
  rollbackStack.version.push([cmd, 'git reset --soft HEAD~'])

  return Promise.resolve()
}

function modifyFileVersoion (fileName) {
  return new Promise(async (resolve) => {
    if (!existsSync(fileName)) return resolve('')
    const json = require(fileName)
    json.version = NEXT_VERSION
    // 针对 package-lock 的packages的version属性的变更
    const packages = json.packages || {}
    if (packages['']) packages[''].version = NEXT_VERSION
    if (packages[json.name]) packages[json.name].version = NEXT_VERSION

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
  // clean 和 checkout 一起使用，确保“新增”和“变更”都能还原
  rollbackStack.changelog.push([cmd, `git clean -f -q -- ${CHANGELOG}`])
  rollbackStack.changelog.push([cmd, `git checkout -q -- ${CHANGELOG}`])

  cmd(`git add ${CHANGELOG}`)
  rollbackStack.changelog.push([cmd, `git reset -q HEAD -- ${CHANGELOG}`])

  cmd(`git commit ${CHANGELOG} -m ${CHANGELOG}`)
  rollbackStack.changelog.push([cmd, `git reset --soft HEAD~`])

  return Promise.resolve()
}

function updateTag () {
  const date = getDate()
  const message = CMD_PARAMS.m || CMD_PARAMS.message
  cmd(`git tag -a v${NEXT_VERSION} -m "${message || date}"`)
  rollbackStack.tag.push([cmd, `git tag -d v${NEXT_VERSION}`])
  cmd(`git push --tags`)
  rollbackStack.tag.push([cmd, `git push ${STORE_NAME} :refs/tags/v${NEXT_VERSION}`])
  return Promise.resolve()
}

function growupVersionNumber (v) {
  // 重新考虑【预】发版类型 prexxx 的版本号的处理逻辑
  const limitArray = VERSION_LIMIT.split('.')
  const majorLimit = Number(limitArray[0])
  const minorLimit = Number(limitArray[1])
  const patchLimit = Number(limitArray[2].split('-')[0])

  let growType = CMD_PARAMS.v || CMD_PARAMS.version
  // 如果 growType 为版本号，直接返回
  if (VERSION_REGEXP.test(growType)) return growType
  // 如果没定义 growType
  // 设置默认升级小版本 patch
  growType = growType || 'patch'
  let majorVersion = Number(v.split('.')[0])
  let minorVersion = Number(v.split('.')[1])
  let patchVersion = Number(v.split('.')[2].split('-')[0])
  let preVersion = Number(v.split('.')[2].split('-')[1])
  if (growType === 'prerelease') {
    if (Number.isNaN(preVersion)) {
      patchVersion = patchVersion + 1
      preVersion = 0
    } else {
      preVersion = preVersion + 1
    }
  } else {
    // prepatch preminor premajor 都视为 preVersion === NaN
    // 这样就可以让 updatePatch() updateMinor() updateMajor() 直接升级对应的版本号
    if (/^pre/.test(growType)) {
      preVersion = NaN
    }

    if (['patch', 'prepatch'].includes(growType)) {
      updatePatch()
    }

    if (['minor', 'preminor'].includes(growType)) {
      updateMinor()
    }

    if (['major', 'premajor'].includes(growType)) {
      updateMajor()
    }

    // prepatch preminor premajor 不管如何计算，预版本号都会置为 0
    if (/^pre/.test(growType)) {
      preVersion = 0
    }
  }

  return `${majorVersion}.${minorVersion}.${patchVersion}`

  function updateMajor () {
    if (Number.isNaN(preVersion)) {
      majorVersion = majorVersion + 1
      patchVersion = 0
      minorVersion = 0
    } else {
      if (patchVersion !== 0 || minorVersion !== 0) {
        majorVersion = majorVersion + 1
        patchVersion = 0
        minorVersion = 0
      }
      preVersion = NaN
    }
    if (majorVersion > majorLimit) {
      patchVersion = patchLimit
      minorVersion = minorLimit
      majorVersion = majorLimit
    }
  }
  function updateMinor () {
    if (Number.isNaN(preVersion)) {
      minorVersion = minorVersion + 1
      patchVersion = 0
    } else {
      if (patchVersion !== 0) {
        minorVersion = minorVersion + 1
        patchVersion = 0
      }
      preVersion = NaN
    }
    if (minorVersion > minorLimit) updateMajor()
  }
  function updatePatch () {
    if (Number.isNaN(preVersion)) {
      patchVersion = patchVersion + 1
    } else {
      preVersion = NaN
    }
    if (patchVersion > patchLimit) updateMinor()
  }
}

function getCurrentVersion () {
  // todo 需要判断远程 tag 和 本地 tag
  const tag = cmd('git describe --tags --abbrev=0')
  if (VERSION_REGEXP.test(tag)) {
    return tag.replace('v', '')
  } else {
    return '1.0.0'
  }
}

function getCmdParams () {
  const res = {}
  const paramReg = /^-\w[\w-_]*&/ig
  const args = process.argv || []
  args.forEach((item, index) => {
    if (item && paramReg.test(item)) {
      let key = item.replace('-', '')
      let val = args[index + 1]
      if (PARAMETER_ACCESS.includes(key)) {
        if (paramReg.test(val)) val = true
        if (!val) val = true
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
    rollbackStack.stash.push([cmd, 'git reset -q HEAD'])
    cmd('git stash save "for update version"')
    rollbackStack.stash.push([cmd, 'git stash pop 0'])
  }
  // 先push一次，防止当前分支是未推送过的分支
  cmd(`git push --set-upstream ${STORE_NAME} ${BRANCH_NAME}`)
  // 保持最新，避免冲突
  cmd(`git pull ${STORE_NAME} ${BRANCH_NAME}`)

  return Promise.resolve()
}

async function revertVersion() {
  await callRollbackStack(rollbackStack.version)
  return Promise.resolve()
}

async function revertChangelog() {
  await callRollbackStack(rollbackStack.changelog)
  return Promise.resolve()
}

async function revertTag() {
  await callRollbackStack(rollbackStack.tag)
  return Promise.resolve()
}

async function distashGitWorkspace() {
  await callRollbackStack(rollbackStack.stash)
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

// 版本是否重复的判断，应该从最后一个 commit 的内容开始判断
async function getDuplicateVersion () {
  const lastLine = await getLastFeatCommit()
  const revertHash = lastLine.substring(0, HASH_LENGTH)
  const regx = new RegExp(`\\[${revertHash}\\]`, 'ig')
  const readmeStream = createReadStream(CHANGELOG)
  const rl = readline.createInterface({ input: readmeStream })
  return new Promise((resolve) => {
    rl.on('line', (line) => {
      if (regx.test(line)) {
        rl.close()
        readmeStream.close()
        resolve(line)
      }
    })
    rl.on('close', () => {
      resolve('')
      rl.close()
      readmeStream.close()
    })
  })
}

function getLastFeatCommit (n) {
  return new Promise((resolve) => {
    loop(resolve, 1)
  })

  function loop (resolve, n) {
    const lineString = cmd(`git log -n ${n} --pretty=format:"%h|%s"`)
    const lastLine = lineString.split('\n').pop()
    if (/(fix:|feat:|pref:|Revert)\s/.test(lastLine)) {
      return resolve(lastLine)
    } else {
      loop(resolve, ++n)
    }
  }
}

function isWindows () {
  const platform = os.platform()
  return /^win/.test(platform)
}

// 中间报错需要帮助用户进行操作回滚
function callRollbackStack (stack = []) {
  return new Promise(async (resolve) => {
    let item = null
    while ((item = stack.pop())) {
      const func = item[0]
      const param = item[1]
      if (typeof func === 'function') {
        await func.apply(null, typeof param === 'string' ? [param] : param)
      }
    }
    resolve('')
  })
}
