<template>
  <Panel>
    <template slot="example">
      <STable
        :columns="columns"
        :data-api="'postworkRuleFlowpage'"
        :data-dict="'records'"
        :is-pagination="false"
        :is-selection="false"
      />
    </template>
    <template slot="desc-title">
      栅格修饰案例
    </template>
    <template slot="desc">
      主要通过赋值回调的形势来修饰栅格<br>
      thead cell => slotsRender(h, vm)<br>
      tbody cell => scopedSlotsRender(h, record, vm)
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
  title: '栅格修饰',
  name: 'Example5',
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
            :is-pagination="false"
            :is-selection="false"
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
                  dataIndex: 'flowNo',
                  slots: { title: 'flowNoTitle' },
                  slotsRender (h, vm) {
                    return (
                      <div>
                        <span>1&nbsp;<\/span>
                        <a-tooltip title="1提示">
                          <a-icon type="question-circle-o" \/>
                        <\/a-tooltip>
                      <\/div>
                    )
                  },
                  scopedSlots: { customRender: 'flowNo' },
                  scopedSlotsRender (h, record, vm) {
                    return <a onClick={ () => alert(record['flowNo']) }>{ record['flowNo'] }<\/a>
                  }
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
          dataIndex: 'flowNo',
          slots: { title: 'flowNoTitle' },
          slotsRender (h, vm) {
            return (
              <div>
                <span>1&nbsp;</span>
                <a-tooltip title="1提示">
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </div>
            )
          },
          scopedSlots: { customRender: 'flowNo' },
          scopedSlotsRender (h, record, vm) {
            return <a onClick={ () => alert(record['flowNo']) }>{ record['flowNo'] }</a>
          }
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
