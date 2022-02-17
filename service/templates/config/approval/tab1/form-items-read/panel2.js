const layout24 = {
  span: 24,
  label: 3,
  wrapper: 20
}
export default [
  {
    layout: layout24,
    label: '附件上传',
    key: 'gfsFiles',
    wrapperCustomRender (h, formItem, vm) {
      const dataSource = vm.dataSource || {}
      const files = dataSource[formItem.key] || []
      return files.map((file) => {
        return (<div><SDownload value={ file } /></div>)
      })
    }
  }
]
