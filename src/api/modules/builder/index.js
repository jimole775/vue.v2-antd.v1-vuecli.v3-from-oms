import http from '@/utils/http'
export default {
  postbuild (data) {
    return http.post(`/build`, data)
  }
}
