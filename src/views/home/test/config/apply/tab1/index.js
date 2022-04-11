import panel1Edit from './permission/panel1'

import panel2Edit from './permission/panel2'

const panel1EditRender = {
  component: 'FormItemRender',
  title: '基本信息',
  mode: 'edit',
  show: true,
  formItems: panel1Edit
}

const panel2EditRender = {
  component: 'FormItemRender',
  title: '测试申请',
  mode: 'edit',
  show: true,
  formItems: panel2Edit
}

export default {
  panels: [panel1EditRender, panel2EditRender]
}
