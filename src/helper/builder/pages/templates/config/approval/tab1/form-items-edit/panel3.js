export default [
  {
    label: '奖罚分数',
    key: 'rewardPunishmentScore',
    required: true,
    wrapperCustomRender (h, formItem, vm) {
      const dataSource = vm.dataSource
      const type = dataSource.eventsType === 'di_event_positive' ? 'positive' : 'negative'
      const decorator = [formItem.key, { initialValue: formItem.value, rules: [{ required: true, message: `请输入${formItem.label}` }] }]
      return (<a-input vDecorator={ decorator } restrict={ type } />)
    }
  }
]
