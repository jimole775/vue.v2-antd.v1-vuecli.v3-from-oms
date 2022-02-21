import http from '@/utils/http'
const host = 'http://localhost:8888'
export default {
  postbuild (data) {
    return http.post(`${host}/build`, data)
  }
}
