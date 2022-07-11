// 转 驼峰 写法
module.exports = function toCamelCase (src, sign) {
  if (!sign) return src
  const wordReg = new RegExp(`${sign}\\w`, 'g')
  const signReg = new RegExp(`${sign}`, 'g')
  return src.replace(wordReg, m => m.toUpperCase().replace(signReg, ''))
}
