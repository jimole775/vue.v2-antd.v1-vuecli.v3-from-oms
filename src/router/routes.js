
let context = require.context('./modules', true, /(\.js)$/)
let routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/Home.vue')
  }
]

context.keys().forEach((item) => {
  routes = routes.concat(context(item).default || context(item))
})

export default routes
