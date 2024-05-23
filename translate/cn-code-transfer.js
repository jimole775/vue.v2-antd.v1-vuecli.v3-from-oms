/**
 * @ Author: Your name
 * @ Create Time: 2024-04-28 23:18:05
 * @ Modified by: Your name
 * @ Modified time: 2024-04-29 02:11:32
 * @ Description:
 */

const path = require('path')
const assert = require('./utils/assert')
const readDirSync = require('./utils/read-dir-sync')
const readFileSync = require('./utils/read-file-sync')
const writeFileSync = require('./utils/write-file-sync')
const BunchThread = require('./utils/bunch-thread')

const dist = './transfer'
const projectTarget = './src'
const mainPath = `${projectTarget}\\src\\views`
const blackPaths = [`${projectTarget}\\src\\xxx`]
const extractPaths = [`${projectTarget}\\src\\components`]

const startSignReg = '[(（【]?'
const midSignReg = '[\\w\\d\\-\\/\\[\\]【】（）*%￥$@？！。·、，：“”‘’~+|_ ]*'
const endSignReg = '[)）】?？;；:：！!.。%]?'
const expressionReg = `[\\w\\d\\/\\-_ |!?$&*+=:.,{}()'"]*?`
const cnCode = '[\\u4e00-\\u9fa5]'
const chineseReg = `(${startSignReg})((${midSignReg}${cnCode}${midSignReg})+)(${endSignReg})`

const fileNameMap = Object.create(null)

readDirSync(mainPath).forEach((folder) => {
  const aModuleFiles = collectFilesFromModuleDir(path.join(mainPath, folder))
  fileNameMap[folder] = aModuleFiles
})

const bunch1 = new BunchThread(1)
const bunch2 = new BunchThread(1)

extractPaths.forEach((extractPath) => {
  const moduleName = extractPath.split('\\').pop()
  fileNameMap[moduleName] = collectFilesFromModuleDir(extractPath)
})

const fileNames = Object.entries(fileNameMap)
bunch1
  .register(fileNames, async ([moduleName, filePaths]) => {
    await transferChineseCodeProcess(filePaths)
    return Promise.resolve()
  })
  .emit()

async function transferChineseCodeProcess(filePaths) {
  await bunch2.register(filePaths, (fp) => {
    if (!isVue(fp) && !isJs(fp)) return Promise.resolve()
    return new Promise((resolve) => {
      try {
        const content = readFileSync(fp)
        if (!/[\u4e00-\u9fa5]/.test(content)) return resolve()
        if (isVue(fp)) {
          let [tempPart, scriptPart] = content.split('<script')
          const tst = transformTemplate(tempPart)
          const tsc = transformScript(scriptPart)
          writeFileToDist(fp, tsc ? `${tst}<script>${tsc}` : tst)
        }
        // if (isJs(fp)) {
        //   writeFileSync(fp, transformScript(content))
        // }
        return resolve()
      } catch (error) {
        console.error(error)
        return resolve(error.message)
      }
    })
  }).emit()
  return Promise.resolve()
}

function transformTemplate (vueTemplateString) {
  if (!vueTemplateString) return ''
  // message: "提示文本"
  // message: '提示文本'
  // message: `提示文本`
  // { xxxXX: '中文' }
  const regx1 = new RegExp(`\\s?([\\w\\-_]+): ?'(${chineseReg})'`, 'g')
  vueTemplateString = vueTemplateString.replace(regx1, ' $1: $t(\'$2\')')

  // xxx="中文"
  // :xxx="`中文`"
  // :xxx="'中文'"
  const regx2 = new RegExp(`\\s:?([\\w\\-]+)="[\'\`]?(${chineseReg})[\`\']?"`, 'g')
  vueTemplateString = vueTemplateString.replace(regx2, ' :$1="$t(\'$2\')"')

  // <span>中文</span>
  // <div><b style="color:#000">*</b> 中标份额（%）</div>
  // <a v-if="xxx">中文&nbsp;&nbsp;</a>
  const regx3 = new RegExp(`>((\\s|&nbsp;)*)(\\*?\\s?)(${chineseReg})((\\s|&nbsp;)*)<\\/`, 'g')
  vueTemplateString = vueTemplateString.replace(regx3, '>$1$3{{ $t(\'$4\') }}$9</')

  // >中文：{{ xxx.xxx }}中文</
  // >中文：{{ xxx.xxx('中文', '') }} 中文</
  // >中文：{{ xxx.xxx(xxx, 2) }}</
  const regx4 = new RegExp(`(>\\s*)?(\\*?\\s?)(${chineseReg})(\\s+)?\\{\\{(${expressionReg})\\}\\}(${chineseReg})?([\\s\\n\\r<]+)?`, 'g')
  vueTemplateString = vueTemplateString.replace(regx4, '$1$2{{ $t(\'$3$8{0}$10\', [$9]) }}$15')

  // >{{ xxxx.xxx }} 中文</
  const regx5 = new RegExp(`(>\\s+)?(\\*?\\s?)\\{\\{(${expressionReg})\\}\\}(\\s+)?(${chineseReg})(\\s+)?<\\/`, 'g')
  vueTemplateString = vueTemplateString.replace(regx5, '>$1$2{{ $t(\'{0}$4$5\', [$3]) }}$8</')

  // :file-name="`${xxx.xxx}中文`"
  const regx6 = new RegExp(`\\s:?([\\w\\-]+)="\`(\\$\\{(${expressionReg})\\})(${chineseReg})\`"`, 'g')
  vueTemplateString = vueTemplateString.replace(regx6, ' :$1="$t(\'{0}$4\', [$3])"')

  // :file-name="`中文${xxx.xxx}`"
  const regx7 = new RegExp(`\\s:?([\\w\\-]+)="\`(${chineseReg})(\\$\\{(${expressionReg})\\})\`"`, 'g')
  vueTemplateString = vueTemplateString.replace(regx7, ' :$1="$t(\'$2{0}\', [$4])"')

  // :file-name="`【${xxx.xxx}】中文`"
  const regx8 = new RegExp(`\\s:?([\\w\\-]+)="\`(${chineseReg}|${startSignReg})(\\$\\{(${expressionReg})\\})(${chineseReg}|${endSignReg})\`"`, 'g')
  vueTemplateString = vueTemplateString.replace(regx8, ' :$1="$t(\'$2{0}$9\', [$8])"')

  // :file-name="`${xxx.xxx}中文${xxx.xxx}`"
  const regx9 = new RegExp(`\\s:?([\\w\\-]+)="\`(\\$\\{(${expressionReg})\\})(${chineseReg})(\\$\\{(${expressionReg})\\})\`"`, 'g')
  vueTemplateString = vueTemplateString.replace(regx9, ' :$1="$t(\'{0}$4{0}\', [$3, $10])"')

  // 中文（中文）：
  const regx10 = new RegExp(`(\\s*)(${chineseReg})([\\n\\r]+)`, 'g')
  vueTemplateString = vueTemplateString.replace(regx10, '$1{{ $t(\'$2\') }}$7')

  return vueTemplateString
}

function transformScript (scriptNstyle) {
  if (!scriptNstyle) return ''
  let [vueScriptString, ...vueStyles] = scriptNstyle.split('<style')
  // xxx('中文')
  // 需要识别 this.$t('中文') 这种已经被转换过的
  const regx = new RegExp(`(?<!(\\$t))\\(['\`](${chineseReg})['\`]\\)`, 'g')
  vueScriptString = vueScriptString.replace(regx, '(this.$t(\'$2\'))')

  // { xxx: '中文' }
  const regx1 = new RegExp(`((\\s)('${chineseReg}')|('${chineseReg}')(\\s)|(\\s)('${chineseReg}')(\\s))`, 'g')
  vueScriptString = vueScriptString.replace(regx1, '$2$10this.$t($3$8$11)$9$15')

  // <div xx-xx="中文" />
  const regx2 = new RegExp(`\\s([\\w\\-]+)="(${chineseReg})"`, 'g')
  vueScriptString = vueScriptString.replace(regx2, ' $1={this.$t(\'$2\')}')

  // xxx = "中文"
  // xxx ==== "中文"
  const regx3 = new RegExp(`\\s(=+)\\s'(${chineseReg})'`, 'g')
  vueScriptString = vueScriptString.replace(regx3, ' $1 this.$t(\'$2\')')

  // >中文</
  const regx4 = new RegExp(`>((\\s|&nbsp;)*)(\\*?\\s?)(${chineseReg})((\\s|&nbsp;)*)<\\/`, 'g')
  vueScriptString = vueScriptString.replace(regx4, '>$1$3{ this.$t(\'$4\') }$9</')

  // >（中文{ xxx.xxx }%）</
  // >(中文：{ xxx.xxx }%)</
  const regx5 = new RegExp(`>((\\s|&nbsp;|${startSignReg})*)(${chineseReg})\\{(${expressionReg})\\}((\\s|&nbsp;|${endSignReg})*)<\\/`, 'g')
  vueScriptString = vueScriptString.replace(regx5, '>{ this.$t(\'$1$3{0}$9\', [$8]) }</')

  // {'中文'}
  // title={xxx && '中文'}
  const regx6 = new RegExp(`\\{(${expressionReg})?(\\s+)?'(${chineseReg})'(\\s+)?\\}`, 'g')
  vueScriptString = vueScriptString.replace(regx6, '{ $1$2this.$t(\'$3\') }')

  // `中文${xxx.xxx}`
  const regx7 = new RegExp(`\`(\\$\\{(${chineseReg})\\})(\\s*)(${expressionReg})\``, 'g')
  vueScriptString = vueScriptString.replace(regx7, 'this.$t(\'$2$7{0}\', [$8])')

  // `${xxx.xxx} 中文`
  const regx8 = new RegExp(`\`(\\$\\{(${expressionReg})\\})(\\s*)(${chineseReg})\``, 'g')
  vueScriptString = vueScriptString.replace(regx8, 'this.$t(\'{0}$3$4\', [$2])')

  // `中文${xxx.xxx}中文`
  const regx9 = new RegExp(`\`(${chineseReg}|${startSignReg})(\\s*)\\$\\{(${expressionReg})\\}(\\s*)(${chineseReg}|${endSignReg})\``, 'g')
  vueScriptString = vueScriptString.replace(regx9, 'this.$t(\'$1$6{0}$8$9\', [$7])')

  return vueStyles ? `${vueScriptString}${vueStyles.map(str => '<style' + str).join('\n')}` : vueScriptString
}

function writeFileToDist (fp, content) {
  const moduleDir = fp.split('\\src').pop()
  const dir = path.join(dist, moduleDir)
  writeFileSync(dir, content)
}

function collectFilesFromModuleDir (moduleDir) {
  const files = []
  loop(moduleDir)
  function loop (prePath) {
    if (blackPaths.includes(prePath)) return false
    const children = readdirSync(prePath)
    children.forEach(child => {
      const p = path.join(prePath, child)
      if (assert.isFile(p)) files.push(p)
      if (assert.isDir(p)) return loop(p)
    })
  }
  return files
}

function isVue (filePath) {
  return /\.(vue)$/.test(filePath)
}

function isJs (filePath) {
  return /\.(js)$/.test(filePath)
}
