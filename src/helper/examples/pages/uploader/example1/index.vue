<template>
  <Panel :code="code" title="单文件上传">
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
    <template slot="description">
      单文件上传
    </template>
  </Panel>
</template>
<script>
import code from './code.md'
export default {
  title: '单文件上传',
  name: 'Example1',
  data () {
    return {
      code,
      defaultValue: '/group1/oms/20210709/16/16/7/mario#icon.jpg',
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
