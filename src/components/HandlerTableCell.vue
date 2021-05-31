<script>
export default {
  functional: true,
  name: 'HandlerTableCell',
  render (h, data) {
    const { record, len = 20 } = data.props || {}
    return (
      <EllipsisTableCell len={len} text={spillCurrentHandler(record)} />
    )
  }
}
function spillCurrentHandler (record) {
  const accs = record['currentAccount'] || ''
  const nams = record['currentName'] || ''
  if (!accs || !nams) return ''
  const res = []
  accs.split(',').forEach((_acc, index) => {
    res.push(`${nams.split(',')[index]}(${_acc})`)
  })
  return res.join('，')
}
</script>
