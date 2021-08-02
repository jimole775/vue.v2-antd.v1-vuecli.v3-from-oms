export default [
  {
    path: '/helper/examples',
    name: 'examples',
    redirect: '/helper/examples/s-table',
    component: () => import('@/helper/examples/index.vue'),
    children: [
      {
        path: '/helper/examples/s-table',
        name: 'STable',
        component: () => import('@/helper/examples/pages/s-table/index.vue')
      },
      {
        path: '/helper/examples/s-line',
        name: 'SLine',
        component: () => import('@/helper/examples/pages/s-line/index.vue')
      },
      {
        path: '/helper/examples/s-lines',
        name: 'SLines',
        component: () => import('@/helper/examples/pages/s-lines/index.vue')
      },
      {
        path: '/helper/examples/form-item-render',
        name: 'FormItemRender',
        component: () => import('@/helper/examples/pages/form-item-render/index.vue')
      },
      {
        path: '/helper/examples/work-place-united-select',
        name: 'WorkPlaceUnitedSelect',
        component: () => import('@/helper/examples/pages/work-place-united-select/index.vue')
      },
      {
        path: '/helper/examples/user-select',
        name: 'UserSelect',
        component: () => import('@/helper/examples/pages/user-select/index.vue')
      },
      {
        path: '/helper/examples/uploader',
        name: 'Uploader',
        component: () => import('@/helper/examples/pages/uploader/index.vue')
      },
      {
        path: '/helper/examples/uploader-multiple',
        name: 'UploaderMultiple',
        component: () => import('@/helper/examples/pages/uploader-multiple/index.vue')
      },
      {
        path: '/helper/examples/s-approvallor',
        name: 'SApprovallor',
        component: () => import('@/helper/examples/pages/s-approvallor/index.vue')
      },
      {
        path: '/helper/examples/export-excel',
        name: 'ExportExcel',
        component: () => import('@/helper/examples/pages/export-excel/index.vue')
      },
      {
        path: '/helper/examples/approval-operation',
        name: 'ApprovalOperation',
        component: () => import('@/helper/examples/pages/approval-operation/index.vue')
      },
      {
        path: '/helper/examples/approval-nodes-map',
        name: 'ApprovalNodesMap',
        component: () => import('@/helper/examples/pages/approval-nodes-map/index.vue')
      },
      {
        path: '/helper/examples/approval-step-bar',
        name: 'ApprovalStepBar',
        component: () => import('@/helper/examples/pages/approval-step-bar/index.vue')
      },
      {
        path: '/helper/examples/down-load-file',
        name: 'DownLoadFile',
        component: () => import('@/helper/examples/pages/down-load-file/index.vue')
      },
      {
        path: '/helper/examples/year-picker',
        name: 'YearPicker',
        component: () => import('@/helper/examples/pages/year-picker/index.vue')
      },
      {
        path: '/helper/examples/datetime-picker',
        name: 'DatetimePicker',
        component: () => import('@/helper/examples/pages/datetime-picker/index.vue')
      },
      {
        path: '/helper/examples/range-month-picker',
        name: 'RangeMonthPicker',
        component: () => import('@/helper/examples/pages/range-month-picker/index.vue')
      },
      {
        path: '/helper/examples/range-picker',
        name: 'RangePicker',
        component: () => import('@/helper/examples/pages/range-picker/index.vue')
      },
      {
        path: '/helper/examples/oms-tabs-plus',
        name: 'OmsTabsPlus',
        component: () => import('@/helper/examples/pages/oms-tabs-plus/index.vue')
      },
      {
        path: '/helper/examples/input-money',
        name: 'InputMoney',
        component: () => import('@/helper/examples/pages/input-money/index.vue')
      },
      {
        path: '/helper/examples/duties-description',
        name: 'DutiesDescription',
        component: () => import('@/helper/examples/pages/duties-description/index.vue')
      },
      {
        path: '/helper/examples/importer',
        name: 'Importer',
        component: () => import('@/helper/examples/pages/importer/index.vue')
      }
    ]
  }
]
