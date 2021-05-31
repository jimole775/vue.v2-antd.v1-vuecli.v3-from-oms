export default {
  code: 200,
  message: 'success',
  'data|1-10': [{
    projectPR: 'PR130000@integer(100, 199)',
    projectName: '@ctitle(3, 6)',
    orgName: '@ctitle(3, 6)',
    system: '@ctitle(3, 6)',
    projectManager: '@cname(3, 5)',
    applyPerson: '@cname(3, 5)',
    projectType: '@ctitle(4, 5)',
    projectBudget: '@integer(0, 500000)',
    willStartTime: '@date()',
    willEndTime: '@date()',
    applyState: '@ctitle(3, 5)'
  }]
}
