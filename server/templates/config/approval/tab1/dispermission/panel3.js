const layout24 = {
  span: 24,
  label: 3,
  wrapper: 20
}
export default [
  {
    layout: layout24,
    label: '附件上传',
    key: 'handleResultGfsFile',
    wrapperCustomRender (h, formItem, vm) {
      const value = vm.dataSource && vm.dataSource['handleResultGfsFile']
      return (<div><SDownload value={value} /></div>)
    }
  }
]
