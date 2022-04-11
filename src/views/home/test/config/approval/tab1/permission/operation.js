export default {
  radios: [
    {
      key: 'approvalResult',
      value: '1',
      label: '通过'
    },
    {
      key: 'approvalResult',
      value: '2',
      label: '驳回'
    },
    {
      key: 'approvalResult',
      value: '3',
      label: '不通过'
    },
    {
      key: 'approvalResult',
      value: '7',
      label: '关闭'
    },
    {
      key: 'approvalResult',
      value: '8',
      label: '转审'
    },
    {
      key: 'approvalResult',
      value: '10',
      label: '放弃'
    },
    {
      key: 'approvalResult',
      value: '11',
      label: '删除'
    }
  ],
  inputs: [
    {
      title: '审批人',
      key: 'handler',
      component: 'ASelect',
      layout: {
        span: 24,
        label: 2,
        wrapper: 16
      },
      required: true,
      show: ['8']
    },
    {
      key: 'approvalContent',
      title: '审批意见',
      layout: {
        span: 24,
        label: 2,
        wrapper: 16
      },
      component: 'ATextarea',
      required: true,
      show: ['1', '2', '3', '7', '10', '11']
    },
    {
      key: 'test111',
      title: 'dfsdfdf',
      layout: {
        span: 24,
        label: 2,
        wrapper: 16
      },
      required: true,
      show: ['1', '2', '3', '7', '10', '11']
    }
  ]
}
