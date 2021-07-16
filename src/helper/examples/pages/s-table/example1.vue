<template>
  <Panel>
    <template slot="example">
      <STable
        :columns="columns"
        :data-api="'postworkRuleFlowpage'"
        :data-dict="'records'"
      />
    </template>
    <template slot="desc-title">
      常用样例
    </template>
    <template slot="desc">
      最简单配置
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
  title: '常用样例',
  name: 'Example1',
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
