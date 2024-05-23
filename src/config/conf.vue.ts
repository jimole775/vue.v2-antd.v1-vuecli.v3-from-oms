import Vue from 'vue'
import utils from '@/utils'
// import http from '@/utils/http'
import jumper from '@/router/jumper'
import loading from '@/utils/loading'
import { Modal, message } from 'ant-design-vue'
Vue.config.productionTip = false
Vue.prototype.$message = message
Vue.prototype.$utils = utils
Vue.prototype.$modal = Modal
Vue.prototype.$jumper = jumper
Vue.prototype.$loading = loading
Vue.prototype.$confirm = Modal.confirm

// 把 $services 改造成一个无访问边界的 map
// 以后可以通过点运算符来判断是否有用户权限
// http.get('/api/catalog/button').then((res: AxiosResponse) => {
//   if (res?.code === 200) {
//     const data = res.data || []
//     let services = Object.create(null)
//     const ignore = '$services.com.oppo.'
//     data.forEach(item => {
//       if (!item) return
//       item = item.replace(ignore, '')
//       const map = utils.createChainMap(item, true)
//       services = utils.merge(services, map)
//     })
//     Vue.prototype.$services = Object.create(null)
//     Vue.prototype.$services.com = Object.create(null)
//     Vue.prototype.$services.com.oppo = Object.create(null)
//     Vue.prototype.$services.com.oppo.oms = utils.createFatGetter(services.oms)
//   }
// })
