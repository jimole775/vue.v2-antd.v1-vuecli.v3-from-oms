import http from '@/utils/http'
const host = 'http://localhost:8888'
export default {
  // 把数据交给后端去构建结构
  postbuilderbuilded (data) {
    return http.post(`${host}/builder/builded`, data)
  },
  // 暂存数据
  postbuilderstage (data) {
    return http.post(`${host}/builder/stage`, data)
  },
  // 新增数据
  postbuilderadd (data) {
    return http.post(`${host}/builder/add`, data)
  },
  // 删除数据
  postbuilderdelete (data) {
    return http.post(`${host}/builder/delete`, data)
  },
  // 获取视图缓存
  getbuilderviewdata (name) {
    return http.get(`${host}/builder/view-data`, { params: { name } })
  },
  // 获取所有项目名
  getbuilderprojects () {
    return http.get(`${host}/builder/projects`)
  },
  // 获取所有分支名
  getbuilderbranchs () {
    return http.get(`${host}/builder/branchs`)
  }
}
