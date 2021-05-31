### 概述
主要用于查询变更记录，这个表格支持单元格合并，只要上下两个单元格内容相同，就会进行合并
### 样例
``` vue
<template>
  <PPModifyLog :columns="columns" :log-type="'project_adjust'" :id="id" />
</template>
<script>
import PPModifyLog from '@/components/PPModifyLog'
export default {
  components: {
    PPModifyLog
  },
  data () {
    return {
      id: 123,
      columns: [
        {
          title: '啊',
          dataIndex: 'a'
        }
      ]
    }
  }
}
</script>
```
