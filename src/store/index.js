import Vue from 'vue'
import Vuex from 'vuex'
import global from './global'
import passer from './passer'
import builder from '@builder/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    builder,
    global,
    passer
  }
})
