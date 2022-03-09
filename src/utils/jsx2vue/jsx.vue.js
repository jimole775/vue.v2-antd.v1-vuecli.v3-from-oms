import tokenizer from './jsx.tokenizer.js'
import parser from './jsx.parser.js'
import utils from '../index.js'
const transfer = (input) => {
  const funcAsts = parser(tokenizer(input))
  // 需要确保 input 是一个函数字符串
  const h = getCreateElementChar(funcAsts[0])
  let vueString = ''
  // {
  //   // (详情见下一节)
  // },

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
  funcAsts.forEach((ast)=> {
    if (utils.isObject(ast)) {
      const childrenAst = {
        code: hasChildren(ast) ? '[\n' : '',
        level: 1
      }
      transferChildren(h, ast.children, childrenAst)
      vueString +=
        `${h}(` +
        `  ${ast.tagType},` +
        `  ${ast.props},` +
        `  ${childrenAst.code}` +
        `)`
    } else {
      vueString += ast
    }
  })

  return vueString
}

function transferChildren (h, children, childrenAst) {
  children.forEach((codeFragment) => {
    const jsxAsts = parser(tokenizer(codeFragment))
    jsxAsts.forEach((ast) => {
      if (utils.isObject(ast)) {
        const space = makeSpace(childrenAst.level)
        childrenAst.code +=
          `${makeSpace(childrenAst.level)}${h}(\n` +
          `${makeSpace(childrenAst.level + 1)}${ast.tagType},\n` +
          `${makeSpace(childrenAst.level + 1)}${ast.props},\n` +
          `${makeSpace(childrenAst.level + 1)}${transferChildren(h, ast.children, childrenAst)}\n` +
          `${makeSpace(childrenAst.level)})\n`
        if (hasChildren(ast)) {
          childrenAst.level += 1
          return transferChildren(h, children, childrenAst)
        }
      } else {
        if ('{}') {

        }
      }
    })
  })
  childrenAst.level = childrenAst.level - 1
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

export default transfer
