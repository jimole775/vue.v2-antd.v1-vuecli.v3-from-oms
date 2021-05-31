export default [
  // {
  //   flag: null,
  //   icon: 'fas fa-file-chart-line',
  //   id: 10001,
  //   order: 12,
  //   parentId: -1,
  //   title: '预算',
  //   children: [
  //     {
  //       flag: null,
  //       icon: 'fas fa-file-chart-line',
  //       id: 100001,
  //       order: 1,
  //       parentId: 10001,
  //       path: '/pp-budget/budgetList',
  //       title: '预算列表'
  //     },
  //     {
  //       flag: null,
  //       icon: 'fas fa-file-chart-line',
  //       id: 100002,
  //       order: 2,
  //       parentId: 10001,
  //       path: '/pp-budget/budgetPreform',
  //       title: '预算执行列表'
  //     }
  //   ]
  // },
  {
    flag: null,
    icon: 'fas fa-file-chart-line',
    id: 10002,
    order: 13,
    parentId: -1,
    title: '项目管理',
    children: [
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100004,
        order: 1,
        parentId: 10002,
        path: '/pp-project/apply',
        title: '立项申请'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100005,
        order: 2,
        parentId: 10002,
        path: '/pp-project/purchase',
        title: '项目采购'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 1000051,
        order: 3,
        parentId: 10002,
        path: '/pp-project/purchase-supplier',
        title: '项目采购(供应商)'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100006,
        order: 3,
        parentId: 10002,
        path: '/project/progress',
        title: '项目进展'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100007,
        order: 4,
        parentId: 10002,
        path: '/project/requirement-modify',
        title: '需求变更'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100008,
        order: 5,
        parentId: 10002,
        path: '',
        title: '提前终止审批'
      }
    ]
  },
  {
    flag: null,
    icon: 'fas fa-file-chart-line',
    id: 10003,
    order: 14,
    parentId: -1,
    title: '招聘入场',
    children: [
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100009,
        order: 1,
        parentId: 10003,
        path: '',
        title: '用人需求'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100010,
        order: 2,
        parentId: 10003,
        path: '',
        title: '招聘流程'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100011,
        order: 3,
        parentId: 10003,
        path: '/recruit_enter/enter',
        // path: '/pp-recruitment/entrance',
        title: '入场流程'
      }
    ]
  },
  {
    flag: null,
    icon: 'fas fa-file-chart-line',
    id: 10004,
    order: 15,
    parentId: -1,
    title: '项目付款结算',
    children: [
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100012,
        order: 1,
        parentId: 10004,
        path: '',
        title: 'FP付款单'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100013,
        order: 2,
        parentId: 10004,
        path: '',
        title: 'TM付款单'
      }
    ]
  },
  {
    flag: null,
    icon: 'fas fa-file-chart-line',
    id: 10005,
    order: 16,
    parentId: -1,
    title: '资源池管理',
    children: [
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100014,
        order: 1,
        parentId: 10005,
        path: '/member/cooper',
        title: '人力合作'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100015,
        order: 2,
        parentId: 10005,
        path: '/member/transfer',
        title: '项目调动'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100016,
        order: 3,
        parentId: 10005,
        path: '/member/departure',
        title: '离场流程'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100017,
        order: 4,
        parentId: 10006,
        path: '/resource-pool/inner-recruit',
        title: '转内'
      }
    ]
  },
  {
    flag: null,
    icon: 'fas fa-file-chart-line',
    id: 10006,
    order: 17,
    parentId: -1,
    title: '基础配置',
    children: [
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100017,
        order: 1,
        parentId: 10006,
        path: '/fp-contract',
        title: 'FP框架合同'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100027,
        order: 2,
        parentId: 10006,
        path: '/suppliers/group',
        title: '供应商分组维护'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100037,
        order: 3,
        parentId: 10006,
        path: '/gui_manager',
        title: '指引管理'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100047,
        order: 4,
        parentId: 10006,
        path: '/supplier-check',
        title: '供应商审核'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100048,
        order: 5,
        parentId: 10006,
        path: '/new_data_modification',
        title: '数据变更（新）'
      },
      {
        flag: null,
        icon: 'fas fa-file-chart-line',
        id: 100049,
        order: 6,
        parentId: 10006,
        path: '/key-events',
        title: '关键事件（新）'
      }
    ]
  }
]
