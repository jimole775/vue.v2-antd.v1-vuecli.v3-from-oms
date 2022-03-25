export const getComponents = (context) => {
  // const components = {}
  const components = []
  context.keys().forEach((item) => {
    const component = context(item).default || context(item)
    if (component.name) {
      // components[component.name] = component
      components.push({ tabId: component.name, tabName: component.title, show: true, component })
    }
  })
  return { components }
}

const babel = require('@babel/standalone/babel.min.js')
const jsxPlugin = require('babel-plugin-transform-vue-jsx')
export const jsx2vue = (jsxCode) => {
  const signName = (src) => {
    return src.replace(/function \(/, 'function anonymous (')
  }
  // 过滤 "use strict" 指令的插件逻辑
  const notStrictMode = () => {
    return {
      visitor: {
        Program: {
          exit (path) {
            const list = path.node.directives
            for (let i = list.length - 1, it; i >= 0; i--) {
              it = list[i]
              if (it.value.value === 'use strict') {
                list.splice(i, 1)
              }
            }
          }
        }
      }
    }
  }

  // 注册插件
  babel.registerPlugin('not-strict-mode', notStrictMode)

  // jsx 转 vue
  let vueAst = babel.transform(
    signName(jsxCode),
    {
      presets: [babel.availablePresets['env']],
      plugins: [jsxPlugin]
    }
  )

  // 过滤 use strict
  vueAst = babel.transform(
    vueAst.code,
    {
      plugins: ['not-strict-mode']
    }
  )

  return vueAst.code
}

export const stringMark = {
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
    return string.replace(/((["']_\|)|(\|_["']))/g, '')
  },
  querySingleQuotation (string) {
    return string.replace(/((["']-\|)|(\|-["']))/g, '\'')
  }
}

export const object2file = (json, space = 2) => {
  let string = JSON.stringify(json, null, space)
  string = string.replace(/ {2}"(.*?)": /g, '  $1: ') // 去掉“键”的双引号
  string = string.replace(/: "(.*?)"(,?)/g, ': \'$1\'$2') // 把值的双引号改成单引号
  string = string.replace(/: ['"](function)/g, ': $1') // 去掉function的前面的双引号
  string = string.replace(/}['"](,?)/g, '}$1') // 去掉function的后面的双引号
  string = string.replace(/\\n/g, '\n') // 把 \\n 改成 \n
  string = stringMark.queryNoQuotation(string)
  string = stringMark.querySingleQuotation(string)
  return string
}

/**
 * 把一个数组的横向存储变成纵向存储，势必结果会把一维数组转成二维数组
 * @target Array(one-dimensional)
 * @rowLen Number
 * @return Array(multi-dimensional)
 */
export function rowToCol (target, rowLen) {
  if (!rowLen || typeof rowLen !== 'number' || rowLen === Infinity) {
    console.error('rowToCal() need a total number at the second argument')
    return target
  }
  if (rowLen <= 1) return target
  const result = [
    // [{},{},{}]
    // [{},{}]
  ]

  let x = 0 // 代表列的下表
  let y = 0 // 代表行的下表
  let i = 0 // 代表target元素的下表
  while (i < target.length) {
    let loop = rowLen
    while (loop--) {
      if (y >= target.length) break
      if (!result[y]) result[y] = []
      if (target[i]) result[y][x] = target[i]
      i++
      y++
    }
    y = 0
    x++
  }

  return result
}

/**
 * 只支持二维数组
 * @target
 * @rowLen
 * @colLen
 * @element
 * @return
 *
 */
export function fillArray (target = [], element = '', rowLen = 1, colLen = 0) {
  let result = target
  if (colLen) {
    multiDimonsional(rowLen, colLen)
  } else {
    oneDimonsional(rowLen)
  }

  function multiDimonsional (y) {
    while (y--) {
      if (!result[y]) result[y] = []
      let x = colLen
      while (x--) {
        if (!result[y][x]) result[y][x] = element
      }
    }
  }

  function oneDimonsional (y) {
    while (y--) {
      if (!result[y]) result[y] = element
    }
  }

  return result
}
