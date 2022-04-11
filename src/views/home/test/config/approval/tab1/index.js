import panel1Read from './dispermission/panel1'

import panel1Edit from './permission/panel1'

import operation from './permission/operation'

const panel1ReadRender = {
  component: 'FormItemRender',
  title: '基本信息',
  mode: 'readonly',
  show: true,
  formItems: panel1Read
}

const panel1EditRender = {
  component: 'FormItemRender',
  title: '基本信息',
  mode: 'edit',
  show: true,
  formItems: panel1Edit
}

const operationRender = {
  component: 'ApprovalOperation',
  title: '审批操作',
  mode: 'edit',
  show: true,
  operationItem: operation
}

const approveLogViewer = {
  component: 'PPApproveLog',
  title: '操作日志',
  mode: 'readonly',
  show: true
}

export default {
  start: {
    panels: {
      dispermission: [panel1ReadRender, approveLogViewer],
      permission: [panel1EditRender, operationRender, approveLogViewer]
    }
  },
  end: {
    panels: {
      dispermission: [panel1ReadRender, approveLogViewer],
      permission: [panel1EditRender, approveLogViewer]
    }
  }
}
