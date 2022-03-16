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
