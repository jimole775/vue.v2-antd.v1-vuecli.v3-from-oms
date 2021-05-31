export default {
  code: 200,
  message: 'success',
  'data|1-10': [{
    departName: '@ctitle(5, 10)', // 组织结构名称
    budget: '@integer(0, 500000)', // 总预算
    distributed: '@integer(0, 500000)', // 已发生
    performRate: '@integer(0, 100)', // 执行率
    month1: '@integer(0, 500000),@integer(0, 99)',
    month2: '@integer(0, 500000),@integer(0, 99)',
    month3: '@integer(0, 500000),@integer(0, 99)',
    month4: '@integer(0, 500000),@integer(0, 99)',
    month5: '@integer(0, 500000),@integer(0, 99)',
    month6: '@integer(0, 500000),@integer(0, 99)',
    month7: '@integer(0, 500000),@integer(0, 99)',
    month8: '@integer(0, 500000),@integer(0, 99)',
    month9: '@integer(0, 500000),@integer(0, 99)',
    month10: '@integer(0, 500000),@integer(0, 99)',
    month11: '@integer(0, 500000),@integer(0, 99)',
    month12: '@integer(0, 500000),@integer(0, 99)',
    children: []
  }]
}
