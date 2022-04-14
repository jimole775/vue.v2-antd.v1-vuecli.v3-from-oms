import qs from 'qs'
import axios from 'axios'
import utils from '@/utils'
import loading from '@/utils/loading'
import whites from '@/config/loading.white.js'
import { setToken, getToken } from '@/utils/auth'

const http = axios.create({
  withCredentials: true,
  timeout: 60000
})

http.interceptors.request.use(
  config => {
    handleLoading(config)
    handleToken(config)
    return config
  },
  error => {
    loading.countdown()
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  response => {
    loading.countdown()
    try {
      const res = 'status' in response ? response.data : response
      if (res.code === 403) return relogin(res.data)
      else return res
    } catch (e) {
      loading.reset()
      loading.unload()
      return response
    }
  },
  error => {
    loading.countdown()
    if (utils.isString(error.data) && /^http/i.test(error.data)) {
      window.location.href = error.data
    }
    return Promise.reject(error)
  }
)

function handleLoading (config) {
  loading.uprise()
  if (whites.includes(config.url) || (config.data && config.data.$slient) || config.$slient) {
    // 静默访问，不做任何动作
  } else {
    // 否则，挂载遮罩
    loading.mounted()
  }
}

function handleToken (config) {
  let to = qs.parse(location.search.split('?')[1])
  /** 避免出现两个token的情况 */
  if (to.token && to.token.length) {
    if (utils.isString(to.token)) {
      setToken(to.token)
    }
    if (utils.isArray(to.token)) {
      setToken(to.token[0])
    }
  }
  config.headers['x-token'] = getToken()
}

function relogin (data = {}) {
  // const origin = fixProtocal(location.origin)
  let query = {}
  if (data.type) {
    if (data.type === 'login') {
      query = {
        type: 'login'
      }
    }
    if (data.type === 'logout') {
      query = {
        type: 'logout'
      }
    }
  }
  location.href = data.url + utils.toQueryString(query)
}

// 强制 http 协议 到 https
// function fixProtocal (url) {
//   if (/^(http:\/\/)oms\./ig.test(url)) {
//     return url.replace(/^(http:)(.+)$/ig, 'https:$2')
//   } else {
//     return url
//   }
// }

export default http
