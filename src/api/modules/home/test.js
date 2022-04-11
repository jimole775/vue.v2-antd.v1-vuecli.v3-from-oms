import http from '@/utils/http'
export default {
  getmockexamplesstable3: function (params) {
    return http.get('/mock/examples/s-table/3', params)
  },
  gettestapproval8: function (params) {
    return http.get('/test/approval/8', params)
  },
  gettestapply: function (params) {
    return http.get('/test/apply', params)
  }
}
