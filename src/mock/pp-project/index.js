import mock from 'mockjs'
import list from './projectApplyList'
mock.mock('mock/pp-project/projectApplyList', 'post', list)
mock.setup(500)
