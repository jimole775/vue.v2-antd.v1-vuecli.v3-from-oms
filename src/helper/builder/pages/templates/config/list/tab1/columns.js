export default [
  {
    title: '流程编号',
    dataIndex: 'flowNo',
    width: 120,
    scopedSlots: { customRender: 'flowNo' },
    scopedSlotsRender (h, record, vm) {
      return <a onClick={() => vm.bridge.projectApproval(record)}>{ record['flowNo'] }</a>
    },
    permission: [0, 1]
  },
  {
    title: '审批状态',
    width: 120,
    dataIndex: 'flowStatusName',
    permission: [0]
  }
]
