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
