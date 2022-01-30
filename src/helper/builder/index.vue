<template>
  <Layout>
    <div>
      <router-view keep-alive />
    </div>
  </Layout>
</template>
<script>
import { mapActions } from 'vuex'
import Layout from './common/layout'
export default {
  components: {
    Layout
  },
  created () {
    this.loadUser()
    this.loadDictList()
  },
  methods: {
    ...mapActions(['loadDictList', 'loadUser'])
  }
}
</script>

<style lang="less" scoped>
.base {
  background: #fff;
  padding: 1rem;
}
</style>
