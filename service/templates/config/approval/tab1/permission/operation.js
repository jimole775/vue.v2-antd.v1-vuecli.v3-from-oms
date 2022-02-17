export const approvalOperationItem = {
  radios: [
    {
      label: '通过',
      value: '1',
      key: 'approvalResult',
      title: '',
      component: 'ARadio',
      onChecked (val, operationItem, vm) {
        setShowItem(vm, true)
      }
    },
    {
      label: '驳回',
      value: '2',
      key: 'approvalResult',
      title: '',
      component: 'ARadio',
      onChecked (val, operationItem, vm) {
        setShowItem(vm, true)
      }
    },
    {
      label: '转审',
      value: '8',
      key: 'approvalResult',
      title: '',
      component: 'ARadio',
      onChecked (val, operationItem, vm) {
        setShowItem(vm, false)
      }
    }
  ],
  inputs: [
    {
      label: '转审人',
      key: 'transfer',
      component: 'UserSelect',
      // paramKeys: ['transferAccount', 'transferName'],
      show: ['8'],
      paramTransfer: (params, vm) => {
        if (params.transfer) {
          const user = vm.$utils.splitUser(params.transfer)
          params.transferAccount = user[0]
          params.transferName = user[1]
        }
        return params
      },
      required: true
    },
    {
      label: '审批意见',
      key: 'approvalContent',
      component: 'ATextarea',
      show: ['1', '2'],
      required: true
    }
  ]
}
