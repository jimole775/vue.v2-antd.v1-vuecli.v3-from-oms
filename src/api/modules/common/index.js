import http from '@/utils/http'
// const base = '/api'
const base = '/mock'
export default {
  postDictList () {
    return http.get(`${base}/examples/s-table/1`)
  },
  getprocessnodes (instanceId) {
    return http.get(`${base}/common/process-nodes?id=${instanceId}`)
  }
}
