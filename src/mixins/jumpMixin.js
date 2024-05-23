/**
 * @ Author: Your name
 * @ Create Time: 2024-04-28 00:52:27
 * @ Modified by: Your name
 * @ Modified time: 2024-04-28 01:08:58
 * @ Description:
 */

import utils from '@/utils'
import jumper from '@/utils/jumper'
import { mapActions } from 'vuex'
export default {
  computed: {
    $RouterQuery () {
      return this.$store.getters.getRouterQuery
    }
  },
  watch: {
    $RouterQuery: {
      handler (params) {
        if (params) {
          setTimeout(async () => {
            await this.searchorTransform()
            await this.reactingTabActive()
            this.clearRouterQuery()
          }, 45)
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['loadRouterQuery']),
    // 给查询组件赋默认值
    async searchorTransform () {
      const { __todoType__, __tabType__, __query__, handler } = utils.clone(this.$RouterQuery || {})
      const vm = await utils.findVm(this, 'STable') || {}
      vm.searchor && vm.searchor.forEach(() => {
        // 自动填充 申请人 审批人
        if ([this.$t('申请人'), '申请人'].includes(searchItem.title) && __todoType__ === 'apply') {
          searchItem.default = searchItem.value = handler
        }
        if ([this.$t('当前处理人'), '当前处理人'].includes(searchItem.title) && (__todoType__ === 'approve' || __tabType__ === 'list')) {
          searchItem.default = searchItem.value = handler
        }
        if (__query__) {
          Object.entries(__query__).forEach(([key, value]) => {
            if (searchItem.key === key || (searchItem.keys || []).includes(key)) {
              vm.$set(searchItem, 'default', value)
              vm.$set(searchItem, 'value', value)
              vm.$set(vm.queryParams, key, value)
            }
          })
        }
      })
      vm.search && vm.search()
    },
    async reactingTabActive () {
      const vm = await utils.findVm(this, 'STabs') || {}
      const query = utils.clone(this.$RouterQuery || {})
      if (query.__tabType__ !== 'list') {
        if (!query.id) query.id = await jumper.loadIdFromServerApi(query)
        const tabType = query.__tabType__ || 'detail'
        vm.$increaseTab && vm.$increaseTab(tabType, query)
      }
    },
    clearRouterQuery () {
      this.loadRouterQuery(null)
    }
  }
}
