const { object2file } = require(global.path.utils())
module.exports = function (tabFolder, curTab) {
  let res = []
  // const uniOptions = getUniOptions(curTab['operation'])
  res = res.concat(buildOptions(tabFolder, curTab['operation']))
  res = res.concat([buildOptionsLoadFile(tabFolder, curTab['operation'])])
  return res
}

function buildOptions (tabFolder, operation) {
  const res = []
  const exportCode = `export default `
  // operation.radios.forEach((radio, index) => {
  //   const fileName = `radio${index + 1}.js`
  // })
  res.push({
    path: `${tabFolder}/operation/radios/index.js`,
    content: `${exportCode}${object2file(operation.radios)}`
  })
  // operation.inputs.forEach((input, index) => {
  //   const fileName = `input${index + 1}.js`
  // })
  res.push({
    path: `${tabFolder}/operation/inputs/index.js`,
    content: `${exportCode}${object2file(operation.inputs)}`
  })
  return res
}

function buildOptionsLoadFile (tabFolder, operation, uniOptions) {
  // const loadmodule = buildModuleLoads(uniOptions)

  // const exportModule = buildModuleExports(operation, loadmodule)

  // const code1 = loadmodule.radios.loads.map(i => i.code).join('\n')
  // const code2 = loadmodule.inputs.loads.map(i => i.code).join('\n')
  // const code3 = viewer.modules.map(i => i.code).join('\n')
  // const code4 = handler.modules.map(i => i.code).join('\n')

  // const code6 = exportModule.cmd
  // const code7 = object2file(exportModule.data)

  return {
    path: `${tabFolder}/operation/index.js`,
    content: `import radios from './radios'
    import inputs from './inputs'
    export default {
      title: '审批操作',
      component: 'Operation',
      operation: {
        radios,
        inputs
      }
    }`
  }
}

// 去掉 nodes，过滤重复项
// 原来的结构 { node1: { inputs: [], radios: [] }, node2... }
// 返回新的结构 { inputs: [], radios: [] }
// function getUniOptions (operation) {
//   const nodes = Object.keys(operation)
//   const res = { inputs: [], radios: [] }
//   nodes.forEach((node) => {
//     const { inputs, radios } = operation[node]
//     inputs.forEach((input) => {
//       if (!res.inputs.find(i => i.key === input.key)) {
//         res.inputs.push(input)
//       }
//     })
//     radios.forEach((radio) => {
//       if (!res.radios.find(i => i.value === radio.value)) {
//         res.radios.push(radio)
//       }
//     })
//   })
//   return res
// }

// function buildModuleLoads ({ radios = [], inputs = [] }) {
//   const res = {
//     radios: {
//       loads: [] // 模块导入语句
//     },
//     inputs: {
//       loads: [] // 模块导入语句
//     }
//   }

//   radios.forEach((radio, index) => {
//     const pIndex = index + 1
//     const mName = `radio${pIndex}`
//     const mPath = `'./radios/${mName}'`
//     const load = {
//       key: radio.value,
//       path: mPath,
//       var: mName,
//       code: `import ${mName} from ${mPath}\n`
//     }
//     res.radios.loads.push(load)
//   })

//   inputs.forEach((input, index) => {
//     const pIndex = index + 1
//     const mName = `input${pIndex}`
//     const mPath = `'./inputs/${mName}'`
//     const load = {
//       key: input.key,
//       path: mPath,
//       var: mName,
//       code: `import ${mName} from ${mPath}\n`
//     }
//     res.inputs.loads.push(load)
//   })

//   return res
// }

// function buildModuleExports (operation, loadmodule) {
//   const exportModule = {
//     cmd: `export default `,
//     data: {}
//   }
//   Object.keys(operation).forEach((node) => {
//     exportModule['data'][node] = { inputs: [], radios: [] }
//     const viewInputs = operation[node]['inputs'] || []
//     const viewRadios = operation[node]['radios'] || []
//     const buildInputs = exportModule['data'][node]['inputs'] || []
//     const buildRadios = exportModule['data'][node]['radios'] || []
//     viewInputs.forEach((input) => {
//       // 找到对应节点的导入的模块名，然后插入到导出对象
//       const module = loadmodule.inputs.loads.find(i => i.key === input.key)
//       module && buildInputs.push(module.var)
//     })

//     viewRadios.forEach((radio) => {
//       // 找到对应节点的导入的模块名，然后插入到导出对象
//       const module = loadmodule.radios.loads.find(i => i.key === radio.value)
//       module && buildRadios.push(module.var)
//     })

//   })
//   return exportModule
// }
