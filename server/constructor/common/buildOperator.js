const { object2file } = require(global.path.utils())
module.exports = function (tabFolder, curTab) {
  let res = []
  res = res.concat(buildOptions(tabFolder, curTab['operator']))
  res = res.concat([buildOptionsLoadFile(tabFolder, curTab['operator'])])
  return res
}

function buildOptions (tabFolder, operator) {
  const res = []
  const exportCode = `export default `
  res.push({
    path: `${tabFolder}/operator/radios/index.js`,
    content: `${exportCode}${object2file(operator.radios)}`
  })
  res.push({
    path: `${tabFolder}/operator/inputs/index.js`,
    content: `${exportCode}${object2file(operator.inputs)}`
  })
  return res
}

function buildOptionsLoadFile (tabFolder, operator) {
  return {
    path: `${tabFolder}/operator/index.js`,
    content: `import radios from './radios'
    import inputs from './inputs'
    export default {
      title: '审批操作',
      component: 'Operator',
      option: {
        radios,
        inputs
      }
    }`
  }
}
