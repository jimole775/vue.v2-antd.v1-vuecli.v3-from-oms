export default {
  code: 200,
  message: 'success',
  'data|10': [{
    byTime: '@date', // 预算年度
    byPerson: '@cname', // 所属组织
    content: '@ctitle(5, 100)' // 剩余可分配预算
  }]
}
