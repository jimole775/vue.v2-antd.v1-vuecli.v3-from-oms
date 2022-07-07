import Vue from 'vue'
import utils from '@/utils'
import { Modal, Message } from 'ant-design-vue'

Vue.config.productionTip = false
Vue.prototype.$message = Message
Vue.prototype.$utils = utils
Vue.prototype.$modal = Modal
Vue.prototype.$confirm = Modal.confirm

