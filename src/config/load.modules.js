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

import Vue from 'vue'
import ExportExcel from '@/components/ExportExcel'
import YearPicker from '@/components/YearPicker'
import RangePicker from '@/components/RangePicker'
import OmsLayout from '@/components/OmsLayout.vue'
import OmsBreadcrumb from '@/components/OmsBreadcrumb'
import DictSelect from '@/components/DictSelect'
import DictGroupRadio from '@/components/DictGroupRadio'
import Uploader from '@/components/Uploader'
import DownLoadFile from '@/components/DownLoadFile'
import CitySelect from '@/components/CitySelect'
import InputMoney from '@/components/InputMoney'
import WorkplaceSelect from '@/components/WorkplaceSelect'
import HandlerTableCell from '@/components/HandlerTableCell'
import RangeMonthPicker from '@/components/RangeMonthPicker'
import FormItemRender from '@/components/FormItemRender'
import SLine from '@/components/SLine'
import SLines from '@/components/SLines'

Vue.use(Button)
Vue.use(Card)
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Pagination)
Vue.use(DatePicker)
Vue.use(RangePicker)
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
Vue.use(InputMoney)
Vue.use(HandlerTableCell)
Vue.use(RangeMonthPicker)
Vue.use(SLine)
Vue.use(SLines)
Vue.use(ExportExcel)
Vue.use(FormItemRender)

Vue.component(InputMoney.name, InputMoney)
Vue.component(ExportExcel.name, ExportExcel)
Vue.component(FormItemRender.name, FormItemRender)
Vue.component(SLine.name, SLine)
Vue.component(SLines.name, SLines)
Vue.component(HandlerTableCell.name, HandlerTableCell)
Vue.component(RangeMonthPicker.name, RangeMonthPicker)
Vue.component(OmsLayout.name, OmsLayout)
Vue.component(RangePicker.name, RangePicker)
Vue.component(YearPicker.name, YearPicker)
Vue.component(OmsBreadcrumb.name, OmsBreadcrumb)
Vue.component(DictSelect.name, DictSelect)
Vue.component(DictGroupRadio.name, DictGroupRadio)
Vue.component(DownLoadFile.name, DownLoadFile)
Vue.component(Uploader.name, Uploader)
Vue.component(CitySelect.name, CitySelect)
Vue.component(WorkplaceSelect.name, WorkplaceSelect)
