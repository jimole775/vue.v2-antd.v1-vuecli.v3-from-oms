<template>
  <Panel>
    <template slot="example">
      <Uploader
        ref="uploadRef"
        v-model="value"
        :text="'上传附件'"
        :default-value="defaultValue"
        :inject-params="injectParams"
        @change="changeEvent"
      />
      <br>
      <a-button type="primary" @click="submitEvent">提交</a-button>
    </template>
    <template slot="desc-title">
      单文件上传
    </template>
    <template slot="desc">
      单文件上传
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
import Panel from '@/helper/examples/common/panel.vue'
export default {
  title: '单文件上传',
  name: 'Example1',
  components: {
    Panel
  },
  data () {
    return {
      code: `
        <template>
          <Uploader
            ref="uploadRef"
            v-model="value"
            :text="'上传附件'"
            :default-value="defaultValue"
            :inject-params="injectParams"
            @change="changeEvent"
          />
          <br>
          <a-button type="primary" @click="submitEvent">提交</a-button>
        <\/template>
        <script>
        export default {
          data () {
            return {
              defaultValue: '/xxx/xxx/mario#icon.jpg',
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
      defaultValue: '/xxx/xxx/mario#icon.jpg',
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
