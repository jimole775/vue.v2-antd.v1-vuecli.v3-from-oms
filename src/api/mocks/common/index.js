import http from '@/utils/http'
// const base = '/api'
const base = '/mock'
export default {
  getprocessnodes (instanceId) {
    return http.get(`${base}/common/process-nodes?id=${instanceId}`)
  }
}
