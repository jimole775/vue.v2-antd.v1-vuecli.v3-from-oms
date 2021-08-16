import Vue from 'vue'
import VueBus from 'vue-bus'
import { Modal, Message } from 'ant-design-vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.config.productionTip = false
Vue.use(VueBus)

Vue.prototype.$message = Message
Vue.prototype.$modal = Modal
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$initDate = date => moment(date).format('YYYY-MM-DD HH:mm')
