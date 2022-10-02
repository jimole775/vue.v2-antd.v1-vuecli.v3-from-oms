const fs = require('fs')
const path = require('path')
const blackDir = ['.git', '.github', '.idea', '.vscode', 'node_modules', 'README.md']
const baseBranch = `│`
const crossBranch = `├──`
const endBranch = `└──`
const branchLimit = 2
const readme = 'README.md'
const levelSpace = '   '
const structStartLine = '## 目录结构'
const titleRegx = /^#+ /

main()
function main () {
  const struct = mkDirStruct()
  const newContent = updateReadme(struct)
  fs.writeFileSync(readme, `${format(newContent)}`, 'utf8')
}

function mkDirStruct () {
  const content = []
  loop(path.join(__dirname), 1)
  function loop (parent, level) {
    const dirs = arrangeDir(fs.readdirSync(parent), parent)
    dirs.forEach((dir, index) => {
      if (blackDir.includes(dir)) return false
      const resolveDir = path.resolve(parent, dir)
      let line = ''
      if (level > 1) {
        line += baseBranch
        line += injectTabChar(level - 1)
      }

      if (index === dirs.length - 1) {
        line += endBranch
      } else {
        line += crossBranch
      }
      content.push(line + ' ' + dir + (isDirectory(resolveDir) ? '/' : ''))

      if (isDirectory(resolveDir) && level < branchLimit) loop(resolveDir, level + 1)
    })
  }

  return content
}

function updateReadme (newStructContents) {
  const oldContent = fs.existsSync(readme) ? fs.readFileSync(readme, { encoding: 'utf-8' }) : ''
  const oldContentLines = splitLines(oldContent)

  const oldBeforeContents = []
  const oldStructContents = []
  const oldBehindContents = []

  let startIndex = -1
  let endIndex = -1
  if (oldContentLines && oldContentLines.length) {
    oldContentLines.forEach((line, index) => {
      if (startIndex > -1 && titleRegx.test(line)) {
        endIndex = index
      }
      if (line.match(structStartLine)) {
        startIndex = index
      }
      if (startIndex === -1) {
        oldBeforeContents.push(line)
      }
      if (endIndex > -1) {
        oldBehindContents.push(line)
      }
      if (startIndex > -1 && endIndex === -1) {
        oldStructContents.push(line)
      }
    })
  }

  const structPrev = [structStartLine, '```']
  oldStructContents.forEach(oldStructLine => {
    for (let i = 0; i < newStructContents.length; i++) {
      const element = newStructContents[i]
      const dirName = qureLines(element)
      const regx = new RegExp(`${dirName}\\s`)
      if (regx.test(oldStructLine)) {
        const desc = oldStructLine.split(dirName)[1]
        newStructContents[i] += desc
        break
      }
    }
  })

  const structSuffix = ['```']
  return [
    ...oldBeforeContents,
    ...structPrev,
    ...newStructContents,
    ...structSuffix,
    ...oldBehindContents
  ]
}

function format (array) {
  const newArray = []
  array.forEach((line, index) => {
    if (index === 0) {
      newArray.push(line + '\n')
    } else {
      if (titleRegx.test(line)) {
        newArray.push('\n')
        newArray.push(line + '\n')
        newArray.push('\n')
      } else {
        newArray.push(line + '\n')
      }
    }
  })
  return newArray.join('')
}

function qureLines (dirtyLine) {
  const regs = new RegExp(`(${baseBranch}|${endBranch}|${crossBranch})`, 'g')
  return dirtyLine.replace(regs, '').trim()
}

function splitLines (src = '') {
  src = src.replace(/[\r\n]+/g, '|')
  return src.trim().split('|')
}

function arrangeDir (src, commonPath = '') {
  const files = []
  const dirs = []
  src.forEach((item) => {
    const dir = path.resolve(commonPath, item)
    if (isDirectory(dir)) {
      dirs.push(item)
    } else {
      files.push(item)
    }
  })
  return [ ...dirs, ...files ]
}

function injectTabChar (time) {
  return Array.from(Array(time)).fill(levelSpace).join('')
}

function isDirectory (target) {
  const stat = fs.statSync(path.resolve(target))
  return stat.isDirectory()
}
