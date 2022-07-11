const { object2file } = require(global.path.utils())
module.exports = function (tabFolder, curTab) {
  // const unipanelmap = getUniPanels(curTab['panels'])
  const panelsFiles = buildPanels(tabFolder, curTab['panels'])
  // const loadFile = buildPanelsLoadFile(tabFolder, curTab['panels'])
  return panelsFiles
}

// 去掉 nodes，过滤重复项
// 原来的结构 { node1: { handler: [], viewer: [] }, node2... }
// 返回新的结构 { handler: [], viewer: [] }
// function getUniPanels (panelmap) {
//   const nodes = Object.keys(panelmap)
//   const res = { handler: [], viewer: [] }
//   nodes.forEach((node) => {
//     const { handler = [], viewer = [] } = panelmap[node]
//     handler.forEach((panel) => {
//       if (!res.handler.find(i => i.title === panel.title)) {
//         res.handler.push(panel)
//       }
//     })
//     viewer.forEach((panel) => {
//       if (!res.viewer.find(i => i.title === panel.title)) {
//         res.viewer.push(panel)
//       }
//     })
//   })
//   return res
// }

function buildPanels (tabFolder, panels) {
  const res = []
  const exportCode = `export default `
  panels.forEach((panel, index) => {
    const fileName = `panel${index + 1}.js`
    res.push({
      path: `${tabFolder}/panels/${fileName}`,
      content: `${exportCode}${object2file(panel)}`
    })
  })
  // handler.forEach((panel, index) => {
  //   const fileName = `panel${index + 1}.js`
  //   res.push({
  //     path: `${tabFolder}/panelmap/handler/${fileName}`,
  //     content: `${exportCode}${object2file(panel.formItems)}`
  //   })
  // })
  return res
}

// function buildPanelsLoadFile (tabFolder, panels) {
//   // const { handler = [], viewer = [] } = buildPanelsLoadsAndModules(panels)

//   const exportModule = buildExportsModules(panels, handler.modules, viewer.modules)

//   const code1 = viewer.loads.map(i => i.code).join('\n')
//   const code2 = handler.loads.map(i => i.code).join('\n')
//   const code3 = viewer.modules.map(i => i.code).join('\n')
//   const code4 = handler.modules.map(i => i.code).join('\n')

//   const code6 = exportModule.cmd
//   const code7 = object2file(exportModule.data)

//   const fileContent = (`${code1}\n${code2}\n${code3}\n${code4}\n${code6}\n${code7}\n`)
//   return {
//     path: `${tabFolder}/panelmap/index.js`,
//     content: fileContent
//   }
// }

// function buildExportsModules (panelmap, handlerCodeModules, viewerCodeModules) {
//   const exportModule = {
//     cmd: `export default `,
//     data: {}
//   }
//   Object.keys(panelmap).forEach((node) => {
//     exportModule['data'][node] = { viewer: [], handler: [] }
//     const viewer = panelmap[node]['viewer'] || []
//     const handler = panelmap[node]['handler'] || []
//     viewer.forEach((panel) => {
//       // 找到对应节点的导入的模块名，然后插入到导出对象
//       const module = viewerCodeModules.find(i => i.title === panel.title)
//       module && exportModule['data'][node]['viewer'].push(stringMark.noQuotation(module.var))
//     })

//     handler.forEach((panel) => {
//       // 找到对应节点的导入的模块名，然后插入到导出对象
//       const module = handlerCodeModules.find(i => i.title === panel.title)
//       module && exportModule['data'][node]['handler'].push(stringMark.noQuotation(module.var))
//     })
//   })
//   return exportModule
// }

// function buildPanelsLoadsAndModules (panels) {
//   const map = {
//     loads: [], // 模块导入语句
//     modules: [] // 组件结构语句
//   }
//   // const viewer = {
//   //   loads: [], // 模块导入语句
//   //   modules: [] // 组件结构语句
//   // }
//   uniPanels.handler.forEach((panel, index) => {
//     const pIndex = index + 1
//     const load = {
//       path: `'./panel${pIndex}'`,
//       var: `panel${pIndex}Edit`,
//       code: `import panel${pIndex}Edit from './panel${pIndex}'\n`
//     }
//     const module = {
//       title: panel.title,
//       var: `panel${pIndex}EditRender`,
//       code: `const panel${pIndex}EditRender = { component: '${panel.component}', title: '${panel.title}', mode: '${panel.mode}', show: ${panel.show}, formItems: ${load.var} }\n`
//     }
//     handler.loads.push(load)
//     handler.modules.push(module)
//   })

//   // uniPanels.viewer.forEach((panel, index) => {
//   //   const pIndex = index + 1
//   //   const load = {
//   //     path: `'./handler/panel${pIndex}'`,
//   //     var: `panel${pIndex}Read`,
//   //     code: `import panel${pIndex}Read from './viewer/panel${pIndex}'\n`
//   //   }
//   //   const module = {
//   //     title: panel.title,
//   //     var: `panel${pIndex}ReadRender`,
//   //     code: `const panel${pIndex}ReadRender = { component: '${panel.component}', title: '${panel.title}', mode: '${panel.mode}', show: ${panel.show}, formItems: ${load.var} }\n`
//   //   }
//   //   viewer.loads.push(load)
//   //   viewer.modules.push(module)
//   // })

//   return {
//     handler,
//     viewer
//   }
// }
