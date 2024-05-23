import store from '@/store'
const loading = {
  lv: 0,
  show: false,
  uprise () {
    this.lv++
  },
  countdown () {
    this.lv--
    if (this.lv < 1) {
      this.unmount()
    }
  },
  reset () {
    this.lv = 0
  },
  mounted () {
    if (this.show === false) {
      this.show = true
      store.commit('setLoading', true)
    }
  },
  unmount () {
    this.show = false
    store.commit('setLoading', false)
  }
}

export default loading
