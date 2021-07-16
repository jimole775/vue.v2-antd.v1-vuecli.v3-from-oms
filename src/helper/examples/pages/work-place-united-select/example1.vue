<template>
  <Panel>
    <template slot="example">
      <div>
        <WorkPlaceUnitedSelect
          ref="WorkPlaceUnitedSelectRef"
          :default-list="dataSource.defaultList"
          :org-code="dataSource.orgCode"
        />
        <br>
        <br>
        <a-button type="primary" @click="submitEvent">提交</a-button>
      </div>
    </template>
    <template slot="desc-title">
      工作地联选
    </template>
    <template slot="desc">
      联选组件，横向展示
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
import WorkPlaceUnitedSelect from '@/components/WorkPlaceUnitedSelect'
import Panel from '@/helper/examples/common/panel.vue'
export default {
  title: '工作地选择',
  name: 'Example1',
  components: {
    WorkPlaceUnitedSelect,
    Panel
  },
  data () {
    return {
      code: `
        <template>
          <div>
            <WorkPlaceUnitedSelect
              ref="WorkPlaceUnitedSelectRef"
              :default-list="dataSource.defaultList"
              :org-code="dataSource.orgCode"
            />
            <br>
            <br>
            <a-button type="primary" @click="submitEvent">提交</a-button>
          </div>
        <\/template>
        <script>
        import WorkPlaceUnitedSelect from '@/components/WorkPlaceUnitedSelect'
        export default {
          components: {
            WorkPlaceUnitedSelect
          },
          data () {
            return {
              dataSource: {
                orgCode: 'oppo',
                defaultList: [{
                  region: '',
                  workPlace: '',
                  deliveryType: ''
                }]
              }
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
        orgCode: 'oppo',
        defaultList: [{
          region: '',
          workPlace: '',
          deliveryType: ''
        }]
      }
    }
  },
  methods: {
    async submitEvent () {
      const res = this.$refs.WorkPlaceUnitedSelectRef.getWorkPlaceList()
      this.$modal.success({
        title: '操作结果',
        content: JSON.stringify(res)
      })
    }
  }
}
</script>
