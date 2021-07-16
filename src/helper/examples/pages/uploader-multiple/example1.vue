<template>
  <Panel>
    <template slot="example">
      <UploaderMultiple
        v-model="value"
        :text="'上传附件'"
        :default-files="defaultFiles"
        :inject-params="injectParams"
        @change="changeEvent"
      />
      <br>
      <a-button type="primary" @click="submitEvent">提交</a-button>
    </template>
    <template slot="desc-title">
      多文件上传
    </template>
    <template slot="desc">
      多文件上传
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
import UploaderMultiple from '@/components/UploaderMultiple'
import Panel from '@/helper/examples/common/panel.vue'
export default {
  title: '多文件上传',
  name: 'Example1',
  components: {
    UploaderMultiple,
    Panel
  },
  data () {
    return {
      code: `
        <template>
          <UploaderMultiple
            v-model="value"
            :text="'上传附件'"
            :default-files="defaultFiles"
            :inject-params="injectParams"
            @change="changeEvent"
          />
          <br>
          <a-button type="primary" @click="submitEvent">提交</a-button>
        <\/template>
        <script>
        import UploaderMultiple from '@/components/UploaderMultiple'
        export default {
          components: {
            UploaderMultiple
          },
          data () {
            return {
              defaultFiles: ['/xxx/xxx/mario#icon.jpg', '/xxx/xxx/2021-04-20_093933.jpg'],
              injectParams: {},
              value: []
            }
          },
          methods: {
            changeEvent (fileList) {
            },
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
      defaultFiles: ['/xxx/xxx/mario#icon.jpg', '/xxx/xxx/2021-04-20_093933.jpg'],
      injectParams: {},
      value: []
    }
  },
  methods: {
    changeEvent (fileList) {
    },
    async submitEvent () {
      this.$modal.success({
        title: '操作结果',
        content: JSON.stringify(this.value)
      })
    }
  }
}
</script>
