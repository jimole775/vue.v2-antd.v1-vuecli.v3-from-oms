/**
 * Object => JSON => 文本
 * 整个流程中，需要解决JSON转出的文本和JS文件的规范的吻合
 */
// const mock = [
//   {
//     'key': 'dadw',
//     'title': 'dddddddd',
//     'layout': {
//       'span': 6,
//       'label': 6,
//       'wrapper': 16
//     },
//     'component': 'function (a, b) { return a }',
//     'props': {
//       'len': 22
//     }
//   }
// ]
const { stringMark } = require('./string-mark')
module.exports = function object2file (json, space = 2) {
  let string = JSON.stringify(json, null, space)
  string = string.replace(/ {2}"(.*?)": /g, '  $1: ') // 去掉“键”的双引号
  string = string.replace(/: *"(.*?)"(,?)/g, ': \'$1\'$2') // 把值的双引号改成单引号
  string = string.replace(/: *['"](function)/g, ': $1') // 去掉function的前面的双引号
  string = string.replace(/: *['"](\(.*?\)) *=>/g, ': $1 =>') // 去掉function的前面的双引号
  string = string.replace(/}['"](,?)/g, '}$1') // 去掉function的后面的双引号
  string = string.replace(/\\n/g, '\n') // 把 \\n 改成 \n
  string = stringMark.queryNoQuotation(string)
  string = stringMark.querySingleQuotation(string)
  return string
}
