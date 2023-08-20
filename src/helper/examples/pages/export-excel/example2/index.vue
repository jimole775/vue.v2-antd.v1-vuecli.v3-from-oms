<template>
  <Panel :code="code" title="异步导出">
    <template slot="example">
      <ExportInterface api="postrequirementservicesexportrequire" />
      <div style="position: relative;">
        <ExportManager style="position:absolute;top:-20px;left:60px;" />
      </div>
    </template>
    <template slot="description">
      主要是由 api 接口决定是否进行异步导出，前端部分不用做任何操作
    </template>
  </Panel>
</template>
<script>
import ExportManager from '@/components/ExportManager.vue'
import code from './code.md'
export default {
  title: '异步导出',
  name: 'Example2',
  components: {
    ExportManager
  },
  data () {
    return {
      code
    }
  }
}
</script>
