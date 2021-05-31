import mock from 'mockjs'
import user from './user'

mock.mock('/mock/user', 'get', user)
mock.setup(500)
