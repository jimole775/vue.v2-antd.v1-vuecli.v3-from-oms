const layout24 = {
  span: 24,
  label: 3,
  wrapper: 20
}
export default [
  {
    layout: layout24,
    label: '附件上传',
    key: 'investigateResultGfsFile',
    wrapperCustomRender (h, formItem, vm) {
      const value = vm.dataSource && vm.dataSource['investigateResultGfsFile']
      return (<div><SDownload value={value} /></div>)
    }
  }
]
