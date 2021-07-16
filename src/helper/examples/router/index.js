export default [
  {
    path: '/helper/examples',
    name: 'examples',
    redirect: '/helper/examples/STable',
    component: () => import('@/helper/examples/index.vue'),
    children: [
      {
        path: '/helper/examples/STable',
        name: 'STable',
        component: () => import('@/helper/examples/pages/s-table/index.vue')
      },
      {
        path: '/helper/examples/Sentence',
        name: 'Sentence',
        component: () => import('@/helper/examples/pages/sentence/index.vue')
      },
      {
        path: '/helper/examples/FormItemRender',
        name: 'FormItemRender',
        component: () => import('@/helper/examples/pages/form-item-render/index.vue')
      },
      {
        path: '/helper/examples/WorkPlaceUnitedSelect',
        name: 'WorkPlaceUnitedSelect',
        component: () => import('@/helper/examples/pages/work-place-united-select/index.vue')
      },
      {
        path: '/helper/examples/WorkPlaceInnerSelect',
        name: 'WorkPlaceInnerSelect',
        component: () => import('@/helper/examples/pages/work-place-inner-select/index.vue')
      },
      {
        path: '/helper/examples/Uploader',
        name: 'Uploader',
        component: () => import('@/helper/examples/pages/uploader/index.vue')
      },
      {
        path: '/helper/examples/UploaderMultiple',
        name: 'UploaderMultiple',
        component: () => import('@/helper/examples/pages/uploader-multiple/index.vue')
      }
    ]
  }
]
