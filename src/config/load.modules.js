import Vue from 'vue'
import VueBus from 'vue-bus'
import {
  Card, Button, Layout, Menu,
  Pagination, DatePicker, Upload,
  Icon, Row, Col, Avatar, Badge,
  Table, List, Breadcrumb, Tabs,
  Input, Form, Select, Popconfirm,
  Collapse, Radio, Divider,
  Tree, Spin, TimePicker,
  InputNumber, Steps, Tooltip,
  LocaleProvider, AutoComplete,
  Checkbox, Empty, Carousel,
  Progress, Calendar, Message, Modal,
  Dropdown, Timeline, Popover
} from 'ant-design-vue'

import Confidential from '@/components/Confidential'
import ExportInterface from '@/components/ExportInterface'
import ImportExcel from '@/components/ImportExcel'
import YearPicker from '@/components/YearPicker'
import RangePicker from '@/components/RangePicker'
import DictSelect from '@/components/DictSelect'
import UserSelect from '@/components/UserSelect'
import SUpload from '@/components/SUpload'
import SDownload from '@/components/SDownload'
import CitySelect from '@/components/CitySelect'
import WorkplaceSelect from '@/components/WorkplaceSelect'
import HandlerTableCell from '@/components/HandlerTableCell'
import RangeMonthPicker from '@/components/RangeMonthPicker'
import SLine from '@/components/SLine'
import SLines from '@/components/SLines'
import FormItemRender from '@/components/FormItemRender'
import SOperator from '@/components/SApprovallor/operator'
import ApprovalStepBar from '@/components/ApprovalStepBar'
import SOperatorFlow from '@/components/SOperatorFlow'
Vue.use(VueBus)
Vue.use(Button)
Vue.use(Card)
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Pagination)
Vue.use(DatePicker)
Vue.use(RangePicker)
Vue.use(TimePicker)
Vue.use(Upload)
Vue.use(Popover)
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
Vue.use(Collapse)
Vue.use(Radio)
Vue.use(Divider)
Vue.use(Tree)
Vue.use(Spin)
Vue.use(Steps)
Vue.use(Tooltip)
Vue.use(LocaleProvider)
Vue.use(AutoComplete)
Vue.use(Checkbox)
Vue.use(Empty)
Vue.use(Timeline)
Vue.use(Carousel).use(Progress)
Vue.use(Calendar)
Vue.use(HandlerTableCell)
Vue.use(RangeMonthPicker)
Vue.use(SLine)
Vue.use(SLines)
Vue.use(ExportInterface)
Vue.use(ImportExcel)
Vue.use(Modal)
Vue.use(Message)
Vue.use(SUpload)
Vue.use(SDownload)
Vue.use(FormItemRender)
Vue.use(ApprovalStepBar)
Vue.use(SOperator)
Vue.use(SOperatorFlow)
Vue.use(Confidential)

Vue.component(Confidential.name, Confidential)
Vue.component(Dropdown.name, Dropdown)
Vue.component(ApprovalStepBar.name, ApprovalStepBar)
Vue.component(SOperator.name, SOperator)
Vue.component(SOperatorFlow.name, SOperatorFlow)
Vue.component(FormItemRender.name, FormItemRender)
Vue.component(ExportInterface.name, ExportInterface)
Vue.component(ImportExcel.name, ImportExcel)
Vue.component(SLine.name, SLine)
Vue.component(SLines.name, SLines)
Vue.component(HandlerTableCell.name, HandlerTableCell)
Vue.component(RangeMonthPicker.name, RangeMonthPicker)
Vue.component(RangePicker.name, RangePicker)
Vue.component(YearPicker.name, YearPicker)
Vue.component(DictSelect.name, DictSelect)
Vue.component(UserSelect.name, UserSelect)
// Vue.component(InterviewsDemand.name, InterviewsDemand)
Vue.component(CitySelect.name, CitySelect)
Vue.component(WorkplaceSelect.name, WorkplaceSelect)
Vue.component(SUpload.name, SUpload)
Vue.component(SDownload.name, SDownload)
