import panel1Edit from './permission/panel1'
import panel1Read from './dispermission/panel1'

import panel2Edit from './permission/panel2'
import panel2Read from './dispermission/panel2'

import panel3Edit from './permission/panel3'
import panel3Read from './dispermission/panel3'

import panel4Edit from './permission/panel4'
import panel4Read from './dispermission/panel4'

import operation from './permission/operation'

const panel1EditRender = { component: 'FormItemRender', title: '基本信息', mode: 'edit', show: true, formItems: panel1Edit }
const panel1ReadViewer = { component: 'FormItemRender', title: '基本信息', mode: 'readonly', show: true, formItems: panel1Read }

const panel2EditRender = { component: 'FormItemRender', title: '申请信息', mode: 'edit', show: true, formItems: panel2Edit }
const panel2ReadViewer = { component: 'FormItemRender', title: '申请信息', mode: 'readonly', show: true, formItems: panel2Read }

const panel3EditRender = { component: 'FormItemRender', title: '调查结果', mode: 'edit', show: true, formItems: panel4Edit }
const panel3ReadViewer = { component: 'FormItemRender', title: '调查结果', mode: 'readonly', show: true, formItems: panel4Read }

const panel4EditRender = { component: 'FormItemRender', title: '处理结果', mode: 'edit', show: true, formItems: panel3Edit }
const panel4ReadViewer = { component: 'FormItemRender', title: '处理结果', mode: 'readonly', show: true, formItems: panel3Read }

const operationRender = { component: 'ApprovalOperation', title: '审批操作', mode: 'edit', show: true, operationItem: operation }

const approveLogViewer = { component: 'PPApproveLog', title: '操作日志', mode: 'readonly', show: true }

export default {
  start: {
    panels: {
      dispermission: [
        panel1ReadViewer,
        panel2ReadViewer,
        panel3ReadViewer,
        panel4ReadViewer
      ],
      permission: [
        panel1EditRender,
        panel2EditRender,
        panel3EditRender,
        panel4EditRender,
        operationRender,
        approveLogViewer
      ]
    }
  },
  end: {
    panels: {
      dispermission: [
        panel1ReadViewer,
        panel2ReadViewer,
        panel3ReadViewer,
        panel4ReadViewer,
        approveLogViewer
      ],
      permission: [
        panel1ReadViewer,
        panel2ReadViewer,
        panel3ReadViewer,
        panel4ReadViewer,
        approveLogViewer
      ]
    }
  }
}
