export default {
  code: 200,
  message: 'success',
  data: {
    year: 2020, // 预算年度
    org: 'COO系统', // 所属组织
    leftBudget: '@integer(1, 1000000)', // 剩余可分配预算
    downSumBudget: '@integer(1, 1000000)', // 向下分配总预算
    department: 'IT管理部', // 当前组织名称
    sumBudget: '@integer(1, 1000000)', // 分配总预算
    selfBudget: '@integer(1, 1000000)', // 自身占用预算
    downBudget: '@integer(1, 1000000)', // 向下分配预算
    currentLeftBudget: '@integer(1, 1000000)', // 占用预算月度分配
    month1: '@integer(1, 1000000)',
    month2: '@integer(1, 1000000)',
    month3: '@integer(1, 1000000)',
    month4: '@integer(1, 1000000)',
    month5: '@integer(1, 1000000)',
    month6: '@integer(1, 1000000)',
    month7: '@integer(1, 1000000)',
    month8: '@integer(1, 1000000)',
    month9: '@integer(1, 1000000)',
    month10: '@integer(1, 1000000)',
    month11: '@integer(1, 1000000)',
    month12: '@integer(1, 1000000)'
  }
}
