export default [
  {
    label: '项目名称',
    key: 'projectName',
    required: true,
    show: false,
    mode: 'readonly',
    wrapperCustomRender (h, formItem) {
      const decorator = [
        this.key, {
          initialValue: formItem.value,
          rules: [{ required: false, message: `请输入${this.label}` }]
        }
      ]
      return <a-input ref="projectName" vDecorator={ decorator } />
    }
  }
]
