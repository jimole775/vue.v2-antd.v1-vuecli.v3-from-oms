<template>
  <Panel :code="code" title="栅格修饰案例">
    <template slot="example">
      <STable
        :columns="columns"
        :data-api="'postworkRuleFlowpage'"
        :data-dict="'records'"
        :is-pagination="false"
        :is-selection="false"
      />
    </template>
    <template slot="description">
      主要通过赋值回调的形势来修饰栅格<br>
      thead cell => slotsRender(h, vm)<br>
      tbody cell => scopedSlotsRender(h, record, vm)
    </template>
  </Panel>
</template>
<script>
import STable from '@/components/STable'
import code from './code.md'
export default {
  title: '栅格修饰',
  name: 'Example5',
  components: {
    STable
  },
  data () {
    return {
      code,
      columns: [
        {
          dataIndex: 'col1',
          slots: { title: 'col1Title' },
          slotsRender (h, vm) {
            return (
              <div>
                <span>col1&nbsp;</span>
                <a-tooltip title="col1提示">
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </div>
            )
          },
          scopedSlots: { customRender: 'col1' },
          scopedSlotsRender (h, record, vm) {
            return <a onClick={ () => alert(record['col1']) }>{ record['col1'] }</a>
          }
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
