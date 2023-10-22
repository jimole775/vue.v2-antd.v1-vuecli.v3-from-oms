import Vue from 'vue'
import axios from 'axios'
import utils from '@/utils'
import base64 from '@/utils/base64'
import unique from '@/config/http.unique'
import slient from '@/config/http.slient'
import hacker from '../../hacker.json'
import { setToken, getToken, getFingerprint } from '@/utils/auth'

const http = axios.create({
  withCredentials: true,
  timeout: 10000
})

let xClient
// let cancelRequest
http.interceptors.request.use(
  config => {
    // config.cancelToken = new axios.CancelToken((c) => {
    //   cancelRequest = c
    // })
    // const pass = markUniqueRequestMap(config.url)
    // if (pass) {
    handleLoading(config)
    handleToken(config)
    handleClient(config)
    return config
    // } else {
    //   return cancelRequest()
    // }
  },
  error => {
    Vue.prototype.$loading.countdown()
    return Promise.reject(error)
  }
)

// response interceptor
http.interceptors.response.use(
  response => {
    Vue.prototype.$loading.countdown()
    try {
      const res = 'status' in response ? response.data : response
      if (res.code === 403) return relogin(res.data)
      else return res
    } catch (e) {
      Vue.prototype.$loading.reset()
      Vue.prototype.$loading.unmount()
      return response
    }
  },
  e => {
    Vue.prototype.$loading.countdown()
    if (utils.isString(e.data) && /^http/i.test(e.data)) {
      window.location.href = e.data
    }
    return Promise.reject(e)
  }
)

function handleClient(config) {
  if (config.headers && !config.headers['x-client']) {
    const fingerprint = getFingerprint()
    if (!xClient && fingerprint) {
      xClient = base64.encode(`${fingerprint}`)
      xClient = xClient.replace(/([\d\w]+)(=*)$/ig, '$1VUE$2')
    }
    // 如果没有xClient可以不提交
    if (xClient) {
      config.headers['x-client'] = xClient
    }
  }
}

function handleLoading (config) {
  Vue.prototype.$loading.uprise()
  if (slient.includes(config.url) || (config.data && config.data.$slient) || config.$slient) {
    // 静默访问，不做任何动作
  } else {
    // 否则，挂载遮罩
    Vue.prototype.$loading.mounted()
  }
}

function handleToken (config) {
  let to = utils.fromQueryString(location.search.split('?')[1])
  if (to.token && to.token.length) {
    utils.isString(to.token) && setToken(to.token)
    utils.isArray(to.token) && setToken(to.token[0])
  }
  if (process.env.VUE_APP_SERVER_ENV === 'native') {
    setToken(hacker.token)
  }
  config.headers['x-token'] = getToken()
}

function relogin () {
  location.href = location.origin + '/login'
}

// function createUniqueRequestMap (urls) {
//   const res = {}
//   urls.forEach((url) => {
//     res[url] = false
//   })
//   return res
// }

// const uniqueRequestMap = createUniqueRequestMap(unique)
// function markUniqueRequestMap (url) {
//   if (uniqueRequestMap.hasOwnProperty(url)) {
//     if (uniqueRequestMap[url] === false) {
//       uniqueRequestMap[url] = true
//       return true
//     } else {
//       return false
//     }
//   } else {
//     return true
//   }
// }

const dataCache = Object.create(null)
const cached = (method, params) => {
  const url = params[0]
  if (unique.includes(url)) {
    if (!dataCache[url]) {
      dataCache[url] = method.apply(http, [...params])
    }
    return dataCache[url]
  } else {
    return method.apply(http, [...params])
  }
}

// 当前只支持两个方法
// 以后有其他类型的业务，再做扩展
const methods = ['get', 'post']
methods.forEach((method) => {
  const originMethod = http[method]
  http[method] = function () {
    return cached(originMethod, arguments)
  }
})

export default http
