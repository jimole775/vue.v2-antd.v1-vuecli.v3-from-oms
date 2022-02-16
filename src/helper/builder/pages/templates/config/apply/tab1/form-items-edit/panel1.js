const layout16 = {
  span: 16,
  label: 3,
  wrapper: 20
}
export default [
  {
    label: '申请人',
    key: 'applyName',
    wrapperCustomRender (h, formItem, vm) {
      return vm.user.name
    },
    paramTransfer (params, vm) {
      params.applyName = vm.user.name
      params.applyAccount = vm.user.employeeNumber
      return params
    }
  }
]
