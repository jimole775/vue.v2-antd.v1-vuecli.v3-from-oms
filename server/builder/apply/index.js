const path = require('path')
const { writeFileSync, object2file, stringMark } = require('../../utils')
const basePath = 'apply'
const mock = require('./mock.json')
buildApply(mock)
function buildApply (tabsTree) {
  const tabIndexs = Object.keys(tabsTree)
  tabIndexs.forEach((tabIndex) => {
    const tabFolder = `${basePath}/tab${(tabIndex * 1 + 1)}`
    const permissionFolder = `${tabFolder}/permission`
    const uniPanels = getUniPanels(tabsTree[tabIndex])
    buildPanels(permissionFolder, uniPanels)
    buildPanelsLoadFile(tabFolder, tabsTree[tabIndex], uniPanels)
  })
  buildTabLoadFile(basePath, tabsTree)
}

// 略过 nodes，把唯一的panel存进一个数组里，过滤重复项
function getUniPanels (tab) {
  const res = []
  tab.panels.forEach((panel) => {
    if (!res.find(i => i.title === panel.title)) {
      res.push(panel)
    }
  })
  return res
}

function buildPanels (prevDir, panels) {
  const exportCode = `export default `
  panels.forEach((panel, index) => {
    let fileName = ''
    fileName = `panel${index + 1}.js`
    writeFileSync(path.join(prevDir, fileName), `${exportCode}${object2file(panel.formItems)}`)
  })
}

function buildPanelsLoadFile (prevPath, tab, uniPanels) {
  const permission = buildLoadsAndModules(uniPanels)
  const exportModule = buildExportsModules(tab, permission.modules)
  const code1 = permission.loads.map(i => i.code).join('\n')
  const code2 = permission.modules.map(i => i.code).join('\n')
  const code3 = exportModule.cmd
  const code4 = object2file(exportModule.data)
  const fileContent = `${code1}\n${code2}\n${code3} ${code4}\n`
  writeFileSync(path.join(prevPath, 'index.js'), fileContent)
}

function buildExportsModules (tab, permissionModules) {
  const exportModule = {
    cmd: `export default `,
    data: {}
  }
  exportModule['data'] = { panels: [] }
  const permission = exportModule['data']['panels']
  const dataPermission = tab['panels']
  dataPermission.forEach((panel) => {
    const module = permissionModules.find(i => i.title === panel.title)
    // “结束节点”不需要【审批操作】模块
    if (module) {
      permission.push(stringMark.noQuotation(module.var))
    }
  })
  return exportModule
}

function buildLoadsAndModules (uniPanels) {
  const permission = {
    loads: [],
    modules: []
  }
  uniPanels.forEach((panel, index) => {
    const pIndex = index + 1
    const load = {
      var: `panel${pIndex}Edit`,
      path: `'./permission/panel${pIndex}'`,
      code: `import panel${pIndex}Edit from './permission/panel${pIndex}'`
    }
    const module = {
      title: panel.title,
      var: `panel${pIndex}EditRender`,
      code: `const panel${pIndex}EditRender = { component: '${panel.component}', title: '${panel.title}', mode: '${panel.mode}', show: ${panel.show}, formItems: ${load.var} }`
    }
    permission.loads.push(load)
    permission.modules.push(module)
  })

  return permission
}

function buildTabLoadFile (prevPath, tabsTree) {
  let importCmd = ''
  let exportCmd = 'export default {\n'

  const tabIndexs = Object.keys(tabsTree)
  tabIndexs.forEach((tabIndex) => {
    const varTab = 'tab' + (tabIndex * 1 + 1)
    importCmd += `import ${varTab} from './${varTab}'\n`
    exportCmd += `  ${tabIndex * 1}: ${varTab}\n`
  })
  exportCmd += '}\n'
  writeFileSync(
    path.join(prevPath, 'index.js'),
    `${importCmd}\n${exportCmd}`
  )
}
