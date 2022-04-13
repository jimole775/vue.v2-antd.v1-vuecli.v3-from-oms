import store from '@/store/index'
import white from '@/config/white.router.js'
import examples from './modules/examples'
import builder from './modules/builder'

/**
 * 白名单的获取
 * 白名单主要由两部分构成：
 * 1. @/config/white.router.js 里面手动配置
 * 2. store.state.global.menus 由后端服务器返回
 * @returns { Function }
 */
function collectWhites () {
  let existPaths
  return () => {
    let menus = getValiableMenus()
    if (menus && menus.length) {
      if (!existPaths) {
        existPaths = Object.create(null)
        flattenPaths(menus, existPaths)
        white.forEach((p) => {
          existPaths[p] = true
        })
      }
    }
    return existPaths
  }
}

function getValiableMenus () {
  let menus = store.state.global.menus || []
  // 把 组件样例 都加入白名单
  menus = menus.concat(examples)
  menus = menus.concat(builder)
  return menus
}

function flattenPaths (items, existPaths) {
  items.forEach((item) => {
    if (item.path) {
      existPaths[item.path] = true
    }
    if (item.children && item.children.length) {
      flattenPaths(item.children, existPaths)
    }
  })
}

export default collectWhites()
