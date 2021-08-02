<template>
  <Panel :code="code" title="多文件上传">
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
    <template slot="description">
      多文件上传
    </template>
  </Panel>
</template>
<script>
import UploaderMultiple from '@/components/UploaderMultiple'
import code from './code.md'
export default {
  title: '多文件上传',
  name: 'Example1',
  components: {
    UploaderMultiple
  },
  data () {
    return {
      code,
      defaultFiles: ['/group1/oms/20210709/16/16/7/mario#icon.jpg', '/group1/oms/20210709/16/03/7/2021-04-20_093933.jpg'],
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
