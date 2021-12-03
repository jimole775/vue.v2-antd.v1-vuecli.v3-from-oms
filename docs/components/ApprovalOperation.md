### 样例
``` vue
<template>
  <div>
    <ApprovalOperation
      :operation-item="options"
      @submit="submitHandler"
    />
  </div>
</template>
<script>
import ApprovalOperation from '@/components/ApprovalOperation'
export default {
  components: {
    ApprovalOperation
  },
  data () {
    return {
      options: {
        // 提交的选项
        radios: [
          { label: '通过', value: '1', key: 'approvalResult', title: '', component: 'ARadio', onChecked (val, options, vm) {} },
          { label: '不通过', value: '3', key: 'approvalResult', title: '', component: 'ARadio', onChecked (val, options, vm) {} },
          { label: '驳回', value: '2', key: 'approvalResult', title: '', component: 'ARadio', onChecked (val, options, vm) {} },
          { label: '转审', value: '8', key: 'approvalResult', title: '', component: 'ARadio', onChecked (val, options, vm) {} }
        ],
        // 必填项
        inputs: [
          {
            label: '转审人',
            dedfault: () => '',
            key: 'transfer',
            component: 'UserSelect',
            show: ['8'],
            paramTransfer (params) {
              params.transferName = ''
              return params
            },
            onChange (val, options, vm) {},
            required: true
          },
          {
            label: '审批意见',
            dedfault: '',
            key: 'approvalContent',
            component: 'ATextarea',
            show: ['1', '2', '3'],
            onChange (val, options, vm) {},
            required: true
          }
        ]
      }
    }
  },
  methods: {
    submitHandler () {
      // todo sth
    }
  }
}
</script>
```
