import http from '@/utils/http'
const host = 'http://localhost:8888'
export default {
  // 把数据交给后端去构建结构
  postbuild (data) {
    return http.post(`${host}/build`, data)
  }
}
