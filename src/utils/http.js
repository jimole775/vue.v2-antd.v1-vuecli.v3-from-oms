import axios from 'axios'
import store from '@/store'
import { setToken, getToken } from '@/utils/auth'
import utils from '@/utils'
import qs from 'qs'

// create an axios instance
const http = axios.create({
  // baseURL: '/api/', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

http.interceptors.request.use(
  config => {
    takeToken(config)
    store.commit('setLoading', true)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
http.interceptors.response.use(
  response => {
    try {
      store.commit('setLoading', false)
      const res = 'status' in response ? response.data : response
      handlePermission(res)
      return res
    } catch (e) {
      return response
    }
  },
  error => {
    return Promise.reject(error)
  }
)

// 处理token数据
function takeToken (config) {
  const to = qs.parse(location.search.split('?')[1])
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

function handlePermission (res) {
  if (res.code === 403) {
    let goUrl = document.location.href
    if (goUrl.charAt(goUrl.length - 1) === '/') {
      goUrl.substring(0, goUrl.length - 1)
    }
    let url = res.data + goUrl
    location.href = url
  }
}

export default http
