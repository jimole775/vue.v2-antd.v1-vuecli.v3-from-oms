// 由于JSON对象输出的数组类型的数据
// 比如:["a", "b", "c"]，这样的数据，很难把【双引号】精准去除
// 所以使用一下方案：
// 在【双引号】的旁边，加上特殊符号 “_|” “|_”
// 形成这种字符 ["_|a|_", "_|b|_", "_|c|_"]
// 最后输出的时候，再使用正则过滤掉
module.exports = {
  stringMark: {
    /**
     * 如果一个字符串需要在写入文件的时候【去掉双引号】，那么使用这个方法进行标记
     * @param {String} string 
     * @returns {String}
     * @template noQuotation('测试') => '_|测试|_'
     */
    noQuotation (string) {
      return `_|${string}|_`
    },
    /**
     * 如果一个字符串需要在写入文件的时候，把【双引号改成单引号】，那么使用这个方法进行标记
     * @param {String} string 
     * @returns {String}
     * @template noQuotation('测试') => '-|测试|-'
     */
    singleQuotation (string) {
      return `-|${string}$|-`
    },
    queryNoQuotation (string) {
      return string.replace(/(("_\|)|(\|_"))/g, '')
    },
    querySingleQuotation (string) {
      return string.replace(/(("-\|)|(\|-"))/g, '\'')
    }
  }
}
