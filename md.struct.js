const fs = require('fs')
const path = require('path')
const blackDir = ['.git', '.github', '.idea', '.vscode', 'node_modules', 'project.md', 'README.md']
const baseBranch = `│`
const crossBranch = `├─`
const endBranch = `└─`
const branchLimit = 2
const readme = 'project.md'
main()
function main () {
  const content = mkDirStruct()
  fs.writeFileSync(readme, `${content.join('\n')}`, 'utf8')
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
  return Array.from(Array(time)).fill('   ').join('')
}

function isDirectory (target) {
  const stat = fs.statSync(path.resolve(target))
  return stat.isDirectory()
}
