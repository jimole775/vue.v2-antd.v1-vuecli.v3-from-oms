export default [
  {
    path: '/helper/builder',
    name: 'builder',
    redirect: '/helper/builder/factory',
    component: () => import('@/helper/builder/index.vue'),
    children: [
      {
        path: '/helper/builder/factory',
        name: 'factory',
        component: () => import('@/helper/builder/factory/index.vue')
      }
    ]
  }
]
