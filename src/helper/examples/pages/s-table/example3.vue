<template>
  <Panel>
    <template slot="example">
      <STable
        :columns="columns"
        :searchor="searchor"
        :data-api="'ppprojecttmbankpage'"
        :data-dict="'records'"
      />
    </template>
    <template slot="desc-title">
      查询样例
    </template>
    <template slot="desc">
      "关联1"和"关联2"，属于关联查询<br>
      "关联2"依赖"关联1"的选值
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
  title: '查询样例',
  name: 'Example3',
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
            :searchor="searchor"
            :data-api="'ppprojecttmbankpage'"
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
                  dataIndex: 'name',
                  permission: [0, 1]
                },
                {
                  title: '2',
                  dataIndex: 'duties',
                  permission: [0, 1]
                },
                {
                  title: '3',
                  dataIndex: 'projectName',
                  permission: [0, 1]
                },
                {
                  title: '4',
                  dataIndex: 'cityName',
                  permission: [0, 1]
                },
                {
                  title: '5',
                  dataIndex: 'workPlace',
                  permission: [0, 1]
                },
                {
                  title: '6',
                  dataIndex: 'workDate',
                  permission: [0, 1]
                },
                {
                  title: '7',
                  dataIndex: 'status',
                  permission: [0, 1]
                }
              ],
              searchor: [
                {
                  title: '1',
                  key: 'cityName',
                  component: 'CitySelect',
                  permission: [0, 1]
                },
                {
                  title: '2',
                  dependKey: 'cityName', // 依赖 cityName 的值
                  key: 'workPlaceNo',
                  component: 'WorkplaceSelect',
                  permission: [0, 1]
                },
                {
                  title: '3',
                  keys: ['workStartDate', 'workEndDate'],
                  component: 'RangePicker',
                  permission: [0, 1]
                },
                {
                  title: '4',
                  key: 'status',
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
        <\/script>
      `,
      columns: [
        {
          title: '1',
          dataIndex: 'name',
          permission: [0, 1]
        },
        {
          title: '2',
          dataIndex: 'duties',
          permission: [0, 1]
        },
        {
          title: '3',
          dataIndex: 'projectName',
          permission: [0, 1]
        },
        {
          title: '4',
          dataIndex: 'cityName',
          permission: [0, 1]
        },
        {
          title: '5',
          dataIndex: 'workPlace',
          permission: [0, 1]
        },
        {
          title: '6',
          dataIndex: 'workDate',
          permission: [0, 1]
        },
        {
          title: '7',
          dataIndex: 'status',
          permission: [0, 1]
        }
      ],
      searchor: [
        {
          title: '1',
          key: 'cityName',
          component: 'CitySelect',
          permission: [0, 1]
        },
        {
          title: '2',
          dependKey: 'cityName',
          key: 'workPlaceNo',
          component: 'WorkplaceSelect',
          permission: [0, 1]
        },
        {
          title: '3',
          keys: ['workStartDate', 'workEndDate'],
          component: 'RangePicker',
          permission: [0, 1]
        },
        {
          title: '4',
          key: 'status',
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
