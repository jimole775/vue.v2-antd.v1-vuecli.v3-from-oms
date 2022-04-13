import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import bindGuard from './guard'
Vue.use(Router)
const router = {
  mode: 'history',
  base: process.env.BASE_URL,
  routes
}
export default bindGuard(new Router(router))
