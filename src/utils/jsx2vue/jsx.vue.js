import tokenizer from './jsx.tokenizer.js'
import parser from './jsx.parser.js'
import utils from '../index.js'
const transfer = (input) => {
  const funcAsts = parser(tokenizer(input))
  // 需要确保 input 是一个函数字符串
  const h = getCreateElementChar(funcAsts[0])
  let vueString = ''
  // // {String | Array}
  // // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成，
  // // 也可以使用字符串来生成“文本虚拟节点”。可选。
  // [
  //   '先写一些文字',
  //   createElement('h1', '一则头条'),
  //   createElement(MyComponent, {
  //     props: {
  //       someProp: 'foobar'
  //     }
  //   })
  // ]
  funcAsts.forEach((ast) => {
    if (utils.isObject(ast)) {
      const childrenAst = {
        code: hasChildren(ast) ? '[\n' : '',
        level: 1
      }

      transferChildren(h, ast.children, childrenAst)

      childrenAst.code += hasChildren(ast) ? `\n${makeSpace(childrenAst.level)}]` : ''

      vueString +=
        `${h}(` +
        `'${ast.type}',\n` +
        `${utils.object2file(parseProps(ast.props), makeSpace(1))}${childrenAst.code ? ',' : ''}\n` +
        `${childrenAst.code}\n` +
        `)\n`
    } else {
      vueString += transferJSXCall(ast)
    }
  })

  return vueString
}

function transferChildren (h, children, childrenAst) {
  children.forEach((codeFragment) => {
    const jsxAst = parser(tokenizer(codeFragment))
    if (utils.isObject(jsxAst)) {
      anlizeAstObject(h, jsxAst, childrenAst)
    }
    if (utils.isString(jsxAst)) {
      childrenAst.code += transferJSXCall(`${makeSpace(childrenAst.level)}${jsxAst}`)
    }
    if (utils.isArray(jsxAst)) {
      jsxAst.forEach((ast) => {
        if (utils.isObject(ast)) {
          anlizeAstObject(h, ast, childrenAst)
        }
        if (utils.isString(ast)) {
          childrenAst.code += transferJSXCall(`${makeSpace(childrenAst.level)}${ast}`)
        }
      })
    }
  })
}

function anlizeAstObject (h, ast, childrenAst) {
  // const space0 = makeSpace(childrenAst.level - 1)
  const space1 = makeSpace(childrenAst.level)
  const space2 = makeSpace(childrenAst.level + 1)
  childrenAst.code +=
    `${space1}${h}(\n` +
    `${space2}${ast.type},\n` +
    `${space2}${utils.object2file(parseProps(ast.props))},\n`

  if (hasChildren(ast)) {
    childrenAst.level += 1
    childrenAst.code += `${space2}[\n`
    transferChildren(h, ast.children, childrenAst)
    childrenAst.level -= 1
    childrenAst.code += `${space1}]\n`
  }
  childrenAst.code += `${space1})\n`
}

// 获取函数的第一个参数名，默认渲染函数的第一个参数是 vm.$createElement
function getCreateElementChar (funcHead) {
  if (!funcHead || !isFuncStr(funcHead)) throw new Error('当前的字符串没有函数体:' + funcHead)
  const params = utils.getFuncParamNames(funcHead)
  return params && params[0] ? params[0] : 'this.$createElement'
}

function isFuncStr (string) {
  if (!string) return false
  if (/=>/.test(string) || /function\s?\(/.test(string)) {
    return true
  } else {
    return false
  }
}

function hasChildren (item) {
  if (item && item.children && item.children.length) {
    return true
  }
  return false
}

function makeSpace (level) {
  let res = ''
  for (let i = 0; i < level; i++) {
    res += '  '
  }
  return res
}

// { xxx.xxx } 这种调用语法，转成js语法
function transferJSXCall (string) {
  const reg = /\{\s?\n?(.+)\s?\n?\}/i
  const matched = string.match(reg)
  return matched ? matched[1] : string
}

// 把jsx的props转成createElement的props
function parseProps (props) {
  const onEvents = {}
  Object.keys(props).forEach(key => {
    const matched = key.match(/^on([A-Z][a-zA-Z]+)/)
    if (matched && matched[1]) {
      const event = matched[1].toLocaleLowerCase()
      onEvents[event] = props[key]
      delete props[key]
    }
  })
  return {
    ...props,
    props: { ...props },
    on: onEvents
  }
}

export default transfer
