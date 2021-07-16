<template>
  <Panel>
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
    <template slot="desc-title">
      头部集成案例
    </template>
    <template slot="desc">
      当前样例展示“导出”“撤回”“关闭”，剩下的按钮可查询 <b>STable.md</b> 文档
    </template>
    <template slot="code">
      <pre>
        <code>
          {{ code }}
        </code>
      </pre>
    </template>
  </Panel>
</template>
<script>
import STable from '@/components/STable'
import Panel from '@/helper/examples/common/panel.vue'
export default {
  title: '头部集成',
  name: 'Example4',
  components: {
    STable,
    Panel
  },
  data () {
    return {
      code: `
        <template>
          <STable
            :columns="columns"
            :data-api="'postworkRuleFlowpage'"
            :data-dict="'records'"
            :export-api="'postworkRuleFlowexport'"
            :close-api="'postworkRuleFlowcloseFlow'"
            :revoke-api="'postworkRuleFlowwithdrawFlow'"
          \/>
        <\/template>
        <script>
        import STable from '@\/components\/STable'
        export default {
          components: {
            STable
          },
          data () {
            return {
              columns: [
                {
                  title: '1',
                  dataIndex: 'flowNo'
                },
                {
                  title: '2',
                  dataIndex: 'applyName'
                },
                {
                  title: '3',
                  dataIndex: 'applyOrganizationName'
                },
                {
                  title: '4',
                  dataIndex: 'organizationName'
                },
                {
                  title: '5',
                  dataIndex: 'createdDate'
                },
                {
                  title: '6',
                  dataIndex: 'applyReason'
                }
              ]
            }
          }
        }
        <\/script>
      `,
      columns: [
        {
          title: '1',
          dataIndex: 'flowNo'
        },
        {
          title: '2',
          dataIndex: 'applyName'
        },
        {
          title: '3',
          dataIndex: 'applyOrganizationName'
        },
        {
          title: '4',
          dataIndex: 'organizationName'
        },
        {
          title: '5',
          dataIndex: 'createdDate'
        },
        {
          title: '6',
          dataIndex: 'applyReason'
        }
      ]
    }
  }
}
</script>
