import Vue from 'vue'
import VueBus from 'vue-bus'
import utils from '@/utils'
import { Modal, Message } from 'ant-design-vue'
Vue.use(VueBus)
Vue.config.productionTip = false
Vue.prototype.$message = Message
Vue.prototype.$modal = Modal
Vue.prototype.$utils = utils
