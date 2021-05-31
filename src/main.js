import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueBus from 'vue-bus'
import {
  Card, Button, Layout, Menu,
  Pagination, DatePicker, Upload,
  Icon, Row, Col, Avatar, Badge,
  Table, List, Breadcrumb, Tabs,
  Input, Form, Select, Popconfirm,
  Modal, Collapse, Radio, Divider,
  Message, Tree, Spin, TimePicker,
  InputNumber, Steps, Tooltip,
  LocaleProvider, AutoComplete,
  Checkbox, Empty, Carousel,
  Progress, Calendar
} from 'ant-design-vue'

import 'ant-design-vue/dist/antd.less'
import '@/styles/antd_reset.less'
import '@/styles/common.less'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
Vue.use(VueBus)

Vue.use(Button)
Vue.use(Card)
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Pagination)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Upload)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Avatar)
Vue.use(Badge)
Vue.use(Table)
Vue.use(List)
Vue.use(Breadcrumb)
Vue.use(Tabs)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Form)
Vue.use(Select)
Vue.use(Popconfirm)
Vue.use(Modal)
Vue.use(Collapse)
Vue.use(Radio)
Vue.use(Divider)
Vue.use(Message)
Vue.use(Tree)
Vue.use(Spin)
Vue.use(Steps)
Vue.use(Tooltip)
Vue.use(LocaleProvider)
Vue.use(AutoComplete)
Vue.use(Checkbox)
Vue.use(Empty)
Vue.use(Carousel).use(Progress)
Vue.use(Calendar)

Vue.config.productionTip = false
Vue.prototype.$message = Message
Vue.prototype.$modal = Modal
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$initDate = date => moment(date).format('YYYY-MM-DD HH:mm')

// mock data开关
process.env.NODE_ENV === 'development' && require('@/mock')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
