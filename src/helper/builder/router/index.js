export default [
  {
    path: '/builder',
    name: 'builder',
    redirect: '/builder/factory',
    component: () => import('@/helper/builder/index.vue'),
    children: [
      {
        path: '/builder/factory',
        name: 'builderFactory',
        component: () => import('@/helper/builder/pages/factory/index.vue')
      }
    ]
  }
]
