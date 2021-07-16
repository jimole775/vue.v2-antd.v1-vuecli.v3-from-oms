<template>
  <Panel>
    <template slot="example">
      <div>
        <FormItemRender
          ref="FormItemRenderRef"
          :data-source="dataSource"
          :form-items="formItems"
        />
        <a-button type="primary" @click="submitEvent">提交</a-button>
      </div>
    </template>
    <template slot="desc-title">
      编辑样例
    </template>
    <template slot="desc">
      简单样例
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
import FormItemRender from '@/components/FormItemRender'
import Panel from '@/helper/examples/common/panel.vue'
export default {
  title: '编辑样例',
  name: 'Example1',
  components: {
    FormItemRender,
    Panel
  },
  data () {
    return {
      code: `
        <template>
          <div>
            <FormItemRender
              ref="FormItemRenderRef"
              :data-source="dataSource"
              :form-items="formItems"
            />
            <a-button type="primary" @click="submitEvent">提交</a-button>
          </div>
        <\/template>
        <script>
        import FormItemRender from '@/components/FormItemRender'
        export default {
          components: {
            FormItemRender
          },
          data () {
            return {
              dataSource: {
                code: 112233
              },
              formItems: [
                {
                  label: '查询编号',
                  key: 'code',
                  required: true,
                  component: 'AInput'
                }
              ]
            }
          },
          methods: {
            async submitEvent () {
              const res = await this.$refs.FormItemRenderRef.getFieldsValue()
              this.$modal.success({
                title: '操作结果',
                content: JSON.stringify(res)
              })
            }
          }
        }
        <\/script>
      `,
      dataSource: {
        code: 112233
      },
      formItems: [
        {
          label: '查询编号',
          key: 'code',
          required: true,
          component: 'AInput'
        }
      ]
    }
  },
  methods: {
    async submitEvent () {
      const res = await this.$refs.FormItemRenderRef.getFieldsValue()
      this.$modal.success({
        title: '操作结果',
        content: JSON.stringify(res)
      })
    }
  }
}
</script>
