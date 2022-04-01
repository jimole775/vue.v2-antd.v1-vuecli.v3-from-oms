import utils from '@/utils'
import { mapActions, mapState } from 'vuex'

export default {
  created () {
    if (utils.isNone(this.$store.state.global.menuButtons)) {
      this.loadMenuButtons()
    }
  },
  computed: {
    ...mapState({
      user: state => state.global.user,
      loading: state => state.global.loading,
      userRole: state => state.global.global.userRole
    }),
    // 上传附件时，服务端支持的文件类型
    supportSeries () {
      const dicts = this.$store.getters.getDictByGroupCode('upload_file_suffix_while_list')
      const supports = dicts.map((item) => {
        return '.' + item.itemCode
      })
      return supports.join(',')
    }
  },
  methods: {
    // 加载按钮权限
    ...mapActions(['loadMenuButtons']),
    hasCatalogButton (btnKey) {
      let btnArr = this.$store.state.global.menuButtons
      return btnArr.includes(btnKey)
    }
  }
}
