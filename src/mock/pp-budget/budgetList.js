export default {
  code: 200,
  message: 'success',
  'data|1-10': [{
    departName: '@ctitle(5, 10)', // 组织机构名称
    budget: '@integer(0, 500000)', // 总预算
    toSelf: '@integer(0, 500000)', // 分配给自己
    goDown: '@integer(0, 500000)', // 向下组织分配
    unDistribute: '@integer(0, 500000)', // 未分配
    unDistributeToSelf: '@integer(0, 500000)', // 自用未分配
    month1: '@integer(0, 500000)',
    month2: '@integer(0, 500000)',
    month3: '@integer(0, 500000)',
    month4: '@integer(0, 500000)',
    month5: '@integer(0, 500000)',
    month6: '@integer(0, 500000)',
    month7: '@integer(0, 500000)',
    month8: '@integer(0, 500000)',
    month9: '@integer(0, 500000)',
    month10: '@integer(0, 500000)',
    month11: '@integer(0, 500000)',
    month12: '@integer(0, 500000)',
    'children|1-3': [{ // 折叠项
      departName: '@ctitle(5, 10)',
      budget: '@integer(0, 500000)',
      toSelf: '@integer(0, 500000)',
      goDown: '@integer(0, 500000)',
      unDistribute: '@integer(0, 500000)',
      unDistributeToSelf: '@integer(0, 500000)',
      month1: '@integer(0, 500000)',
      month2: '@integer(0, 500000)',
      month3: '@integer(0, 500000)',
      month4: '@integer(0, 500000)',
      month5: '@integer(0, 500000)',
      month6: '@integer(0, 500000)',
      month7: '@integer(0, 500000)',
      month8: '@integer(0, 500000)',
      month9: '@integer(0, 500000)',
      month10: '@integer(0, 500000)',
      month11: '@integer(0, 500000)',
      month12: '@integer(0, 500000)'
    }]
  }]
}
