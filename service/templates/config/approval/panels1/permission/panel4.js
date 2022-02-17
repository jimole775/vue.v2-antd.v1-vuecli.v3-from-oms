export default [
  {
    label: '调查结果',
    key: 'investigateResultType',
    props: {
      'group-code': 'key_events_investigate_result_type',
      'value-field': 'itemCode'
    },
    required: true,
    component: 'DictSelect',
    onChange (val, vm) {
      const activeComponents = vm.bridge.activeComponents || []
      activeComponents.forEach((component) => {
        if (component.title === '处理结果') {
          component.show = val !== 'investigated_not_verified'
        }
      })
    }
  }
]
