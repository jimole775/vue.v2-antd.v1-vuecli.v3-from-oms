<template>
  <div>
    <a-button>完成配置</a-button>
    <div class="pull-right">
      <a-avatar icon="user" class="mr5" :src="user.image" />
      <span class="black" v-text="user.name" />
      (<span style="margin: 0 0.2rem;font-size: 12px;" v-text="user.employeeNumber" />)
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    user () {
      return this.$store.state.global.user
    }
  }
}
</script>
