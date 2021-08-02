<template>
  <Panel :code="code" title="常用样例">
    <template slot="example">
      <STable
        :columns="columns"
        :data-api="'postworkRuleFlowpage'"
        :data-dict="'records'"
      />
    </template>
    <template slot="description">
      最简单配置
    </template>
  </Panel>
</template>
<script>
import STable from '@/components/STable'
import code from './code.md'
export default {
  title: '常用样例',
  name: 'Example1',
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
