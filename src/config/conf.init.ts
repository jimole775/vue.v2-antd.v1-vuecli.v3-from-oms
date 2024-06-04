/**
 * @ Author: @rongxis
 * @ Create Time: 2023-08-16 00:02:57
 * @ Modified by: @rongxis
 * @ Modified time: 2024-06-04 23:44:28
 * @ Description:
 */

import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
// import http from '@/utils/http'

// http.get('/api/ping').then(async res => {
// if (res.code === 200) {
// 实例化前，加载菜单权限，否则判断无权限，会被重定向到 401
(async () => {
  await store.dispatch('loadMenus')
  await store.dispatch('loadDictList')
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})()
// }
// })
