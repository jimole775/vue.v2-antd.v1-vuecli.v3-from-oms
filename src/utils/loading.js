import store from '@/store'
const loading = {
  high: 0,
  uprise () {
    this.high++
  },
  countdown () {
    this.high--
    if (this.high < 1) {
      this.unmount()
    }
  },
  reset () {
    this.high = 0
  },
  mounted () {
    store.commit('setLoading', true)
  },
  unmount () {
    store.commit('setLoading', false)
  }
}

export default loading
