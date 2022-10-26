import store from '@/store'
import utils from '@/utils'
import base64 from '@/utils/base64'
import collectWhites from './whites'
import { setToken, setJumpInfo } from '@/utils/auth'

export default (router) => {
  router.beforeEach((to, from, next) => {
    queryPathPermission(to, from, next)
    handleLoginRedirect(to, from, next)
    handleExternalRedirect(to, from, next)
    handleToken(to, from, next)
  })
  router.afterEach((to, from) => {
    trackPageView(to, from)
  })
  return router
}

// 用户访问敏感页面的时候，记录到obus
function trackPageView (to, from) {
}

// 校验是否是白名单地址，如果不是，就跳转到 401 界面
function queryPathPermission (to, from, next) {
  const whites = collectWhites()
  if (whites && !whites[to.path]) next('/401')
}

// 处理登陆后的跳转信息
function handleLoginRedirect (to, from, next) {
  if (to.query.state) {
    const stateString = decodeURIComponent(to.query.state)
    const path = stateString.split('?')[0] || '/'
    const search = stateString.split('?')[1] || ''
    next(path + '?' + search)
  }
}

// 处理外部直连的跳转信息
function handleExternalRedirect (to, from, next) {
  if (to.query.external) {
    // 跳转数据需要用base64解码, 然后缓存到本地
    setJumpInfo(base64.decode(to.query.external))
    delete to.query.external
    next(to.path + utils.toQueryString(to.query))
  }
}

// 从url获取token信息
function handleToken (to, from, next) {
  if (to.query.token) {
    setToken(to.query.token)
    delete to.query.token
    next(to.path + utils.toQueryString(to.query))
  } else {
    // 新增缓存用户信息
    if (!store.state.global.user) {
      store.dispatch('loadUser').then(() => {
        next()
      })
    } else {
      next()
    }
  }
}
