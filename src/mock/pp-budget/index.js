import mock from 'mockjs'
import budgetList from './budgetList'
import budgetPreform from './budgetPreform'
import budgetConfigureCommit from './budgetConfigure/commit'
import budgetConfigureQuery from './budgetConfigure/query'

mock.mock('/mock/pp-budget/budgetList', 'post', budgetList)
mock.mock('/mock/pp-budget/budgetPreform', 'post', budgetPreform)
mock.mock('/mock/pp-budget/budgetConfigure/query', 'post', budgetConfigureCommit)
mock.mock('/mock/pp-budget/budgetConfigure/commit', 'post', budgetConfigureQuery)
mock.setup(500)
