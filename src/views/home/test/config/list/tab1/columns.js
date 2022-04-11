export default [
  {
    title: 'name',
    width: 100,
    anchor: true,
    dataIndex: 'name',
    permission: ['0']
  },
  {
    title: '年纪',
    width: 100,
    dataIndex: 'age',
    permission: ['0'],
    scopedSlots: {
      customRender: 'age'
    },
    scopedSlotsRender: (h, record, vm) => {
      return '大事大实打'
    }
  },
  {
    title: '年纪',
    width: 100,
    dataIndex: 'money',
    permission: ['0']
  },
  {
    title: '年纪',
    width: 100,
    dataIndex: 'level',
    permission: ['0']
  },
  {
    width: 100,
    title: 'start',
    dataIndex: 'start'
  },
  {
    width: 100,
    title: 'end',
    dataIndex: 'end'
  },
  {
    title: 'jjjj',
    width: 100,
    dataIndex: 'new',
    permission: ['0'],
    scopedSlots: {
      customRender: 'new'
    },
    scopedSlotsRender: (h, record, vm) => {
      return '样例数据'
    }
  }
]
