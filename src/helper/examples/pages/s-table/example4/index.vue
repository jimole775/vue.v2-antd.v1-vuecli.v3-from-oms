<template>
  <Panel :code="code" title="审批集成案例">
    <template slot="example">
      <STable
        :columns="columns"
        :data-api="'postworkRuleFlowpage'"
        :data-dict="'records'"
        :export-api="'postworkRuleFlowexport'"
        :close-api="'postworkRuleFlowcloseFlow'"
        :revoke-api="'postworkRuleFlowwithdrawFlow'"
      />
    </template>
    <template slot="description">
      当前样例展示“导出”“撤回”“关闭”，剩下的按钮可查询 <b>STable.md</b> 文档
    </template>
  </Panel>
</template>
<script>
import STable from '@/components/STable'
import code from './code.md'
export default {
  title: '审批集成',
  name: 'Example4',
  components: {
    STable
  },
  data () {
    return {
      code,
      columns: [
        {
          title: 'col1',
          dataIndex: 'col1'
        },
        {
          title: 'col2',
          dataIndex: 'col2'
        },
        {
          title: 'col3',
          dataIndex: 'col3'
        },
        {
          title: 'col4',
          dataIndex: 'col4'
        },
        {
          title: 'col5',
          dataIndex: 'col5'
        },
        {
          title: 'col6',
          dataIndex: 'col6'
        }
      ]
    }
  }
}
</script>
