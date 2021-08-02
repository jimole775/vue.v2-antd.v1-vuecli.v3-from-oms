/**
 * 基础模块
 */
import http from '@/utils/http'
// const base = '/api'
const base = '/mock'
export default {
  getuser () {
    return http.get(`${base}/user`)
  },
  getPermissionMenu () {
    return http.get(`${base}/menu`)
  },
  getuserpool () {
    return http.get(`${base}/user-pool`)
  }
}
