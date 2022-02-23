import panel1Edit from './panels/panel1'
import panel2Edit from './panels/panel2'
const panel1EditRender = { component: 'FormItemRender', title: '基本信息', mode: 'edit', formItems: panel1Edit }
const panel2EditRender = { component: 'FormItemRender', title: '关键事件信息', mode: 'edit', formItems: panel2Edit }

export default {
  panels: [
    panel1EditRender,
    panel2EditRender
  ]
}
