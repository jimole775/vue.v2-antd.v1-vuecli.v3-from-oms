import store from '@/store'
const loading = {
  high: 0,
  uprise () {
    this.high++
    console.log('loading uprise:', this.high)
  },
  countdown () {
    this.high--
    console.log('loading countdown:', this.high)
    if (this.high < 1) {
      this.unload()
    }
  },
  reset () {
    this.high = 0
  },
  mounted () {
    store.commit('setLoading', true)
  },
  unload () {
    debugger
    store.commit('setLoading', false)
  }
}

export default loading
