<template>
  <div>
    <p v-for="(sentence, index) in sentences" :key="index">{{ sentence }}</p>
  </div>
</template>
<script>
export default {
  name: 'Sentence',
  props: {
    content: {
      type: String,
      default: ''
    },
    splitType: {
      type: String,
      default: '\n'
    }
  },
  computed: {
    sentences (val) {
      let res = []
      if (this.content) {
        res = this.content.split(this.splitType)
      }
      return res
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-row {
  padding: 0.3rem 0;
}
</style>
