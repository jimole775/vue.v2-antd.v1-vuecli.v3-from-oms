
### 概述
### 样例
``` vue
<template>
  <UploaderMultiple
    :text="'上传附件'"
    :accept="supportSeries"
    :default-value="defaultValue"
    :inject-params="injectParams"
    v-decorator="['workCard']"
    @change="changeEvent"
  />
</template>
<script>
import UploaderMultiple from '@/components/UploaderMultiple.vue'
export default {
  components: {
    UploaderMultiple
  },
  computed: {
    supportSeries () {
      return this.$store.getters.getFileTypePermisson()
    }
  },
  data () {
    return {
      injectParams: {}, /** 每次上传时，可额外插入参数 */
      defaultValue: ['/xxx/xxx.png', '/xxx/xxx.jpg'] /** 默认展示的文件 */
    }
  },
  methods: {
    changeEvent (data, uploadRes) {
      /** data = [{ fileName: 'xxxx', filePath: '/xxxx.png' }] */
    }
  }
}
</script>
```
