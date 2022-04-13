export default [
  {
    path: '/401',
    name: '401',
    component: () => import('@/components/401.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/404.vue')
  }
]
