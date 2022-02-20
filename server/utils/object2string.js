/**
 * Object直接存到文件
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
module.exports = function object2string (json, space = 2) {
  let string = JSON.stringify(json, null, space)
  string = string.replace(/ {2}"(.*?)": /g, '  $1: ') // 去掉“键”的双引号
  string = string.replace(/: "(.*?)"(,?)\n/g, ': \'$1\'$2\n') // 去掉值得双引号
  string = string.replace(/: '(function)/g, ': $1') // 去掉function的前面的双引号
  string = string.replace(/}'(,?)/g, '}$1') // 去掉function的后面的双引号
  return string
}
