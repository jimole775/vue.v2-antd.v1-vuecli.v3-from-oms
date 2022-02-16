export default [
  {
    label: '申请人',
    key: 'applyName',
    wrapperCustomRender (h, formItem, vm) {
      const data = vm.dataSource || {}
      return data.applyName
    },
    paramTransfer (params, vm) {
      const data = vm.dataSource || {}
      params.applyName = data.applyName
      params.applyAccount = data.applyAccount
      return params
    }
  }
]
