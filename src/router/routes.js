import builder from '@builder/router'

let context = require.context('./modules', true, /(\.js)$/)
let routes = [
  ...builder,
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue')
  }
]

context.keys().forEach((item) => {
  routes = routes.concat(context(item).default || context(item))
})

export default routes
