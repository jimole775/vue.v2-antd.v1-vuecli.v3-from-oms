// import utils from '@/utils'
// import applyViewToBuild from '@builder/utils/view-to-build/apply'
// import approvalViewToBuild from '@builder/utils/view-to-build/approval'
// import { columnsViewToBuild, searchorViewToBuild } from '@builder/utils/view-to-build/list'
// import tabsViewToBuild from '@builder/utils/view-to-build/tabs'
import Vue from 'vue'
import api from '@/api'
// import utils from '@/utils'
import routes from '@/router/routes.js'
import { camel2dash, dash2camel } from '@builder/utils'
export default {
  state: {
    tabType: '0',
    editType: 'new', // new | modify
    currentRank: 0,
    projectName: '',
    nodes: {},
    projects: [],
    menus: [],
    apiBaseProps: {
      url: undefined,
      name: undefined,
      path: undefined,
      method: undefined,
      params: undefined,
      arguments: undefined
    },
    // buildData: {
    //   name: '',
    //   list: {},
    //   tabs: [],
    //   router: {},
    //   apimap: {},
    //   approval: {}
    // },
    viewData: {
      name: '',
      isEmpty: true,
      list: {},
      tabs: [],
      router: {},
      // apimap: {},
      approval: {}
    },
    globalComponentNames: []
  },
  getters: {
    getMenus (state) {
      return state.menus || []
    },
    getCurrentRank (state) {
      return state.currentRank
    },
    getNodes (state) {
      return state.nodes[state.currentRank] || []
    },
    getTabType (state) {
      return state.tabType
    },
    getViewData (state) {
      return state.viewData
    },
    getProjects (state) {
      return state.projects
    },
    getProjectName (state) {
      return state.projectName
    },
    getEditType (state) {
      return state.editType
    }
  },
  mutations: {
    commitNodes (state, nodes = []) {
      Vue.set(state.nodes, state.currentRank, nodes)
    },
    commitTabType (state, type) {
      state.tabType = type
    },
    commitEditType (state, type) {
      state.editType = type
    },
    commitViewData (state, data) {
      state.viewData = data
    },
    commitViewDataByRank (state, { key, rank = state.currentRank, value }) {
      state.viewData.isEmpty = false
      if (!state.viewData[key]) {
        state.viewData[key] = {}
      }
      switch (key) {
        case 'list':
        case 'approval':
          state.viewData[key][rank] = value
          break
        case 'tabs':
        case 'router':
          state.viewData[key] = value
          break
        default:
          state.viewData[key] = value
          break
      }
    },
    commitComponentNames (state, data) {
      state.globalComponentNames = data
    },
    commitBuilderMenus (state, data) {
      state.menus = data
    },
    commitProjects (state, data) {
      state.projects.push(data)
    },
    commitProjectName (state, name) {
      state.projectName = name
    },
    commitCurrentRank (state, rank) {
      state.currentRank = rank
    }
  },
  actions: {
    setCurrentRank ({ commit }, rank) {
      commit('commitCurrentRank', rank)
    },
    setNodes ({ commit }, nodes) {
      commit('commitNodes', nodes)
    },
    setTabType ({ commit }, type) {
      commit('commitTabType', type)
    },
    setViewData ({ commit }, data) {
      commit('commitViewDataByRank', data)
    },
    loadViewData ({ commit }, name) {
      api.getbuilderviewdata(name).then(res => {
        if (res.code === 200) {
          const data = res.data.viewData || {}
          commit('commitViewData', data)
          // const keysOfRank = ['approval', 'list', 'apimap']
          // const data = res.data.viewData || {}
          // Object.keys(data).forEach(key => {
          //   const module = data[key]
          //   if (utils.isValuable(module)) {
          //     if (keysOfRank.includes(key)) {
          //       Object.keys(module).forEach((rank) => {
          //         commit('commitViewDataByRank', { key, rank, value: module[rank] })
          //       })
          //     } else {
          //       commit('commitViewDataByRank', { key, value: module })
          //     }
          //   }
          // })
        }
      })
    },
    resetViewData ({ commit }) {
      commit('commitViewData', {
        name: '',
        isEmpty: true,
        tabs: [],
        list: {},
        router: {},
        approval: {}
      })
    },
    loadRegistedComponentsList ({ commit }) {
      const globalPlugins = Vue._installedPlugins || []
      const names = globalPlugins.map(i => i.name).filter(i => i)
      const dashNames = names.map(i => camel2dash(i))
      const camelNames = names.map(i => dash2camel(i))
      const wholeNames = dashNames.concat(camelNames) // 保持两种命名方式都有
      commit('commitComponentNames', wholeNames)
    },
    loadBuilderMenus ({ commit }, data) {
      const res = []
      const cache = Object.create(null)
      if (!cache['views']) {
        cache['views'] = true
        res.push({
          path: 'views',
          name: '顶层菜单'
        })
      }
      routes.forEach(i => {
        if (i.module) {
          if (!cache[i.module.path]) {
            cache[i.module.path] = true
            res.push(i.module)
          }
        }
      })
      commit('commitBuilderMenus', res)
    },
    setEditType ({ commit }, type) {
      commit('commitEditType', type)
    },
    setProjectName ({ commit, state }, name) {
      if (state.projectName !== name) {
        commit('commitProjectName', name)
      }
    },
    resetProjectName ({ commit }) {
      commit('commitProjectName', '')
    }
  }
}
