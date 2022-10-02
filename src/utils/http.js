import qs from 'qs'
import Vue from 'vue'
import axios from 'axios'
import utils from '@/utils'
import unique from '@/config/http.unique'
import disloading from '@/config/http.disloading'
import { setToken, getToken } from '@/utils/auth'

const http = axios.create({
  withCredentials: true,
  timeout: 10000
})

let cancelRequest
http.interceptors.request.use(
  config => {
    config.cancelToken = new axios.CancelToken((c) => {
      cancelRequest = c
    })
    const pass = markUniqueRequestMap(config.url)
    if (pass) {
      handleLoading(config)
      handleToken(config)
      return config
    } else {
      return cancelRequest()
    }
    // let to = qs.parse(location.search.split('?')[1])
    // /** 避免出现两个token的情况 */
    // if (to.token && to.token.length) {
    //   if (utils.isString(to.token)) {
    //     setToken(to.token)
    //   }
    //   if (utils.isArray(to.token)) {
    //     setToken(to.token[0])
    //   }
    // }
    // config.headers['x-token'] = getToken()
    // return config
  },
  error => {
    Vue.prototype.$loading.countdown()
    return Promise.reject(error)
  }
)

// response interceptor
http.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    Vue.prototype.$loading.countdown()
    try {
      const res = 'status' in response ? response.data : response
      if (res.code === 403) return relogin(res.data)
      else return res
    } catch (e) {
      Vue.prototype.$loading.reset()
      Vue.prototype.$loading.unload()
      return response
    }
  },
  error => {
    Vue.prototype.$loading.countdown()
    if (utils.isString(error.data) && /^http/i.test(error.data)) {
      window.location.href = error.data
    }
    return Promise.reject(error)
  }
)

function handleLoading (config) {
  Vue.prototype.$loading.uprise()
  if (disloading.includes(config.url) || (config.data && config.data.$silent) || config.$slient) {
    // 静默访问，不做任何动作
  } else {
    // 否则，挂载遮罩
    Vue.prototype.$loading.mounted()
  }
}

function handleToken (config) {
  let to = qs.parse(location.search.split('?')[1])
  if (to.token && to.token.length) {
    utils.isString(to.token) && setToken(to.token)
    utils.isArray(to.token) && setToken(to.token[0])
  }
  if (process.env.VUE_APP_ENV === 'local' && process.env.VUE_APP_MOCK_TOKEN) {
    setToken(process.env.VUE_APP_MOCK_TOKEN)
  }
  config.headers['x-token'] = getToken()
}

function relogin () {
  location.href = location.origin + '/login'
}

function createUniqueRequestMap (urls) {
  const res = {}
  urls.forEach((url) => {
    res[url] = false
  })
  return res
}

const uniqueRequestMap = createUniqueRequestMap(unique)
function markUniqueRequestMap (url) {
  if (uniqueRequestMap.hasOwnProperty(url)) {
    if (uniqueRequestMap[url] === false) {
      uniqueRequestMap[url] = true
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}

export default http
