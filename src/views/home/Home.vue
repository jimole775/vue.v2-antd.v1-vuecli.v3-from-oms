<template>
  <Phonevalidate ref="PhonevalidateRef" vtype="clock" />
</template>

<script>
import baseMixins from '@/mixins/baseMixins.js'
import Phonevalidate from '@/components/Phonevalidate.vue'
export default {
  name: 'Home',
  mixins: [baseMixins],
  components: {
    Phonevalidate
  },
  data () {
    return {
      approveList: [],
      applyList: [],
      activeKey: '1',
      exceptionDays: 0
    }
  },
  computed: {
    userRole () {
      return this.$store.state.global.userRole
    },
    user () {
      return this.$store.state.global.user
    },
    userAccount () {
      return this.$store.state.global.user.employeeNumber
    }
  },
  methods: {
    jumpToListPage (item) {
      this.mixin_jumping(item, 'list', this.activeKey === '1' ? 'approve' : 'apply')
    },
    jumpToDetailPage (item) {
      this.mixin_jumping(item, 'detail', this.activeKey === '1' ? 'approve' : 'apply')
    },
    // 获取数据字典项的名称
    getDictName (code) {
      const dictItem = this.$store.getters.getDictItemNameByGroupCode(
        'elastic_type',
        code
      )
      if (dictItem) {
        return dictItem.itemName
      } else {
        return code
      }
    },
    dataCall (data) {
      this.exceptionDays = data
    }
  }
}
</script>
