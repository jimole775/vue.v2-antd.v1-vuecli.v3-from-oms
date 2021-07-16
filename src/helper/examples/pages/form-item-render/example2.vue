<template>
  <Panel>
    <template slot="example">
      <div>
        <FormItemRender
          :mode="'readonly'"
          :data-source="dataSource"
          :form-items="formItems"
        />
      </div>
    </template>
    <template slot="desc-title">
      只读样例
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
  title: '只读样例',
  name: 'Example2',
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
              :mode="'readonly'"
              :data-source="dataSource"
              :form-items="formItems"
            />
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
                  key: 'code'
                }
              ]
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
          key: 'code'
        }
      ]
    }
  }
}
</script>
