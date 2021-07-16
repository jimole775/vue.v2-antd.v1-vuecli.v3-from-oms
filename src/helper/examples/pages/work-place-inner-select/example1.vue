<template>
  <Panel>
    <template slot="example">
      <div style="width: 300px">
        <WorkPlaceInnerSelect :data-source="dataSource" v-model="value" />
        <br>
        <br>
        <a-button type="primary" @click="submitEvent">提交</a-button>
      </div>
    </template>
    <template slot="desc-title">
      工作地选择
    </template>
    <template slot="desc">
      下拉列表是根据项目号，动态获取的，<br>
      所以，使用时，需要提供必要参数 { prNo: xxx }
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
import WorkPlaceInnerSelect from '@/components/WorkPlaceInnerSelect'
import Panel from '@/helper/examples/common/panel.vue'
export default {
  title: '工作地选择',
  name: 'Example1',
  components: {
    WorkPlaceInnerSelect,
    Panel
  },
  data () {
    return {
      code: `
        <template>
          <div style="width: 300px">
            <WorkPlaceInnerSelect :data-source="dataSource" v-model="value" />
            <br>
            <br>
            <a-button type="primary" @click="submitEvent">提交</a-button>
          </div>
        <\/template>
        <script>
        import WorkPlaceInnerSelect from '@/components/WorkPlaceInnerSelect'
        export default {
          components: {
            WorkPlaceInnerSelect
          },
          data () {
            return {
              dataSource: {
                prNo: 'PR2009020010'
              },
              value: {}
            }
          },
          methods: {
            async submitEvent () {
              this.$modal.success({
                title: '操作结果',
                content: JSON.stringify(this.value)
              })
            }
          }
        }
        <\/script>
      `,
      dataSource: {
        prNo: 'PR2009020010'
      },
      value: {}
    }
  },
  methods: {
    async submitEvent () {
      this.$modal.success({
        title: '操作结果',
        content: JSON.stringify(this.value)
      })
    }
  }
}
</script>
