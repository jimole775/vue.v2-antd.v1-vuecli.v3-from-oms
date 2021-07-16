<template>
  <Layout>
    <div class="base">
      <router-view keep-alive />
    </div>
  </Layout>
</template>
<script>
import Layout from './common/layout'
export default {
  components: {
    Layout
  }
}
</script>

<style lang="less" scoped>
.base {
  background: #fff;
  padding: 1rem;
}
</style>
