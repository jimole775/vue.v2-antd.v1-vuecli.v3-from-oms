import qs from 'qs'
import store from '@/store/index'
import base64 from '@/utils/base64'
import collectWhites from './whites'
import { setToken, getToken, setJumpInfo } from '@/utils/auth'

export default (router) => {
  router.beforeEach((to, from, next) => {
    queryPathPermission(to, from, next)
    handleNativeRedirect(to, from, next)
    handleToken(to, from, next)
  })
  router.afterEach((to, from) => {
    trackPageView(to, from)
  })
  return router
}

function trackPageView (to, from) {
  let user = store.state.global.user
  if (user && window.trackPageView) {
    window.trackPageView(to, from, {
      pageTitle: '', // 页面标题，选填
      userId: user.employeeNumber, // 用户工号,必填
      userName: user.name, // 用户名，必填
      sessionId: getToken() // sessionId，可以是用户登录token，必填
    })
  }
}

function queryPathPermission (to, from, next) {
  const whites = collectWhites()
  if (whites && !whites[to.path]) next('/401')
}

function handleNativeRedirect (to, from, next) {
  if (to.query.omsjump) {
    // 处理并缓存外部链接的跳转信息
    const omsjump = to.query.omsjump
    let url = to.fullPath.split('?')[0]
    let splitParmas = to.fullPath.split('?')[1]
    let parmasObj = qs.parse(splitParmas)
    delete parmasObj.omsjump
    let path = url + '?' + qs.stringify(parmasObj)
    // mo跳转数据需要用base64解码
    setJumpInfo(base64.decode(omsjump))
    next(path)
  }
}

function handleToken (to, from, next) {
  if (to.query.token) {
    // 处理并缓存token
    const token = to.query.token
    let url = to.fullPath.split('?')[0]
    let splitParmas = to.fullPath.split('?')[1]
    let parmasObj = qs.parse(splitParmas)
    delete parmasObj.token
    let path = url + '?' + qs.stringify(parmasObj)
    setToken(token)
    next(path)
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
