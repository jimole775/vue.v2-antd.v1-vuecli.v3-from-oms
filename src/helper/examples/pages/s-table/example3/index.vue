<template>
  <Panel :code="code" title="查询样例">
    <template slot="example">
      <STable
        :columns="columns"
        :searchor="searchor"
        :data-api="'ppprojecttmbankpage'"
        :data-dict="'records'"
      />
    </template>
    <template slot="description">
      "城市"和"工作地点"，属于关联查询<br>
      "工作地点"依赖"城市"的选值
    </template>
  </Panel>
</template>
<script>
import STable from '@/components/STable'
import code from './code.md'
export default {
  title: '查询样例',
  name: 'Example3',
  components: {
    STable
  },
  data () {
    return {
      code,
      columns: [
        {
          title: 'col1',
          dataIndex: 'col1',
          permission: [0, 1]
        },
        {
          title: 'col2',
          dataIndex: 'col2',
          permission: [0, 1]
        },
        {
          title: 'col3',
          dataIndex: 'col3',
          permission: [0, 1]
        },
        {
          title: 'col4',
          dataIndex: 'col4',
          permission: [0, 1]
        },
        {
          title: 'col5',
          dataIndex: 'col5',
          permission: [0, 1]
        },
        {
          title: 'col6',
          dataIndex: 'col6',
          permission: [0, 1]
        },
        {
          title: 'col7',
          dataIndex: 'col7',
          permission: [0, 1]
        }
      ],
      searchor: [
        {
          key: 'col1',
          title: 'col1',
          component: 'CitySelect',
          permission: [0, 1]
        },
        {
          key: 'col2',
          title: 'col2',
          dependKey: 'col1', // 依赖 col1 的值
          component: 'WorkplaceSelect',
          permission: [0, 1]
        },
        {
          title: 'col3',
          keys: ['col31', 'col32'],
          component: 'RangePicker',
          permission: [0, 1]
        },
        {
          title: 'col4',
          key: 'col4',
          props: {
            'group-code': 'dg_tm',
            'value-field': 'itemName'
          },
          component: 'DictSelect',
          permission: [0, 1]
        }
      ]
    }
  }
}
</script>
