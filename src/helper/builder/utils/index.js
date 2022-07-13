// import store from '@builder/store'

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
const jsxPlugin = require('@vue/babel-plugin-transform-vue-jsx')
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

  if (!babel.availablePlugins['not-strict-mode']) {
    // 注册插件
    babel.registerPlugin('not-strict-mode', notStrictMode)
  }

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

/**
 * 可以理解为把 JSON 内容存为 js 文件内容
 * @param {JSON} json
 * @param {Number} space
 * @returns {String}
 * @template object2file({"s": "1"}) => `{s: '1'}`
 * @template object2file({"s": "() => {}"}) => `{s: () => {}}`
 */
export const object2file = (json, space = 2) => {
  let string = JSON.stringify(json, null, space)
  string = string.replace(/ {2}"(.*?)": /g, '  $1: ') // 去掉“键”的双引号
  string = string.replace(/: *"(.*?)"(,?)/g, ': \'$1\'$2') // 把值的双引号改成单引号
  string = string.replace(/: *['"](function)/g, ': $1') // 去掉function的前面的双引号
  string = string.replace(/: *['"](\(.*?\)) *=>/g, ': $1 =>') // 去掉() => {}的前面的双引号
  string = string.replace(/}['"](,?)/g, '}$1') // 去掉function的后面的双引号
  string = string.replace(/\\n/g, '\n') // 把 \\n 改成 \n
  string = stringMark.queryNoQuotation(string)
  string = stringMark.querySingleQuotation(string)
  return string
}

/**
 * 可以理解为把 js 文件内容转为 JSON 内容
 * @param {String} string
 * @returns {Object}
 * @template file2object(`{s: '1'}`) => {"s": "1"}
 * @template file2object(`{s: () => {}}`) => {"s": "() => {}"}
 */
export function file2object (string) {
  const kvs = cutJsonSide(string).split(',')
  const res = {}
  kvs.forEach((kv) => {
    let [key, value] = kv.split(':')
    key = key ? key.trim() : key
    value = value ? value.trim() : value
    res[key] = value
  })
  return res
}

export const cutJsonSide = (src) => {
  let res = ''
  if (isJSONString(src)) {
    src = src.trim()
    res = src.substring(1, src.length - 1)
  }
  return res
}

export const isJSONString = (src) => {
  if (Object.prototype.toString.call(src) === '[object String]') {
    const firstChar = src[0]
    const lastChar = src[src.length - 1]
    if ((firstChar === '[' && lastChar === ']') || (firstChar === '{' && lastChar === '}')) {
      return true
    }
  }
  return false
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

/**
 * 获取函数的参数名
 * @param {Function | String} src
 * @returns Array
 * @template getFunctionArguments('(a, b) =>') => ['a', 'b']
 * @template getFunctionArguments('function (a, b)') => ['a', 'b']
 * @template getFunctionArguments((a, b) => {}) => ['a', 'b']
 */
export function getFunctionArguments (src) {
  if (typeof src === 'function') {
    src = src.toString()
  }
  if (typeof src !== 'string') {
    return []
  }
  let res = []
  const funcReg = /function\s?.*?\s?\((.+)\)/
  const arrowReg = /\((.+)\)\s?=>/
  const funcMatched = src.match(funcReg)
  const arrowMatched = src.match(arrowReg)
  if (funcMatched && funcMatched[1]) {
    res = funcMatched[1].split(',')
  }
  if (arrowMatched && arrowMatched[1]) {
    res = arrowMatched[1].split(',')
  }
  return res
}

/**
 * 函数转字符串
 * @param {Function} func
 * @returns String
 * @template func2string(function(){}) => 'function(){}'
 */
export function func2string (func) {
  if (!func) return ''
  return func.toString()
}

/**
 * 字符串转函数，并且结构头，身，尾，赋值到函数的属性上
 * @param {String} string
 * @returns Function
 * @template string2func('function(){}') => function anonymous (){}
 * @template string2func('() => {}') => () => {}
 * @template string2func('') => () => {}
 */
export function string2func (string) {
  if (!string) return () => {}
  let head = ''
  let body = ''
  let tail = ''
  let func = null
  let regTail = /\n?\s*?\}$/
  let regHead = /=>/.test(string)
    ? /^(async\s)?([\w\$][\w\d\$]*?)*\s?\([(\r\n)\R\N\t\T]?([\w\d\$]*?,?\s?)*\)\s?=>\s?{/ // 箭头函数
    : /^(async\s)?function\s?([\w\$][\w\d\$]*?)*\s?\([(\r\n)\R\N\t\T]?([\w\d\$]*?,?\s?)*\)\s?{/ // 普通函数
  head = string.match(regHead)
  tail = string.match(regTail)
  body = string.replace(regHead, '').replace(regTail, '')

  // function () {} 这种类型的转换，需要增加一个函数名
  if (/function \(/.test(string)) {
    string = string.replace(/function \(/, 'function anonymous \(')
  }

  // 如果函数中有写组件，就给它加上单引号，使其去访问全局组件
  const componentReg = /\sh\((\w|([a-z](-[a-z])*))+/g
  if (componentReg.test(string)) {
    string = string.replace(componentReg, m => (' h(\'' + m.replace(' h\(', '') + '\''))
  }

  if (/^\(/.test(string)) {
    func = eval(string)
  } else {
    func = eval(`(${string})`)
  }
  func.head = head ? head[0] : ''
  func.tail = tail ? tail[0] : ''
  func.body = body || ''
  func.args = getFunctionArguments(string)
  return func
}

// a-table => ATable
export function dash2camel (src) {
  return src.replace(/-\w/g, m => m.toUpperCase().replace('-', ''))
}

// ATable => a-table
export function camel2dash (src) {
  return src.replace(/([A-Z]{2}|[a-z][A-Z])/g, m => m.split('').join('-')).toLowerCase()
}
