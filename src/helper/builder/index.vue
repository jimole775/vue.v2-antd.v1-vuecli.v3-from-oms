<template>
  <Layout>
    <div slot="content">
      <router-view keep-alive />
    </div>
  </Layout>
</template>
<script>
import { mapActions } from 'vuex'
import Layout from './foundation/layout.vue'
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
