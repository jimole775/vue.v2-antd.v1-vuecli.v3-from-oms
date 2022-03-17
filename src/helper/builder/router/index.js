export default [
  {
    path: '/helper/builder',
    name: 'builder',
    redirect: '/helper/builder/factory',
    component: () => import('@builder/index.vue'),
    children: [
      {
        path: '/helper/builder/factory',
        name: 'factory',
        component: () => import('@builder/factory/index.vue')
      }
    ]
  }
]
