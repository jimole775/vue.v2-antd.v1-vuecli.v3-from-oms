import api from '@/api'
import utils from '@/utils'
import { getFingerprint, setFingerprint } from '@/utils/auth'
import mockMenu from '@/mock/menus'

const exportingListStoreKey = '$$EXPORTINGLIST'
export default {
  state: {
    token: '',
    user: '',
    menus: [],
    mockEnv: false,
    loading: false,
    todoParams: null,
    userRole: {},
    currentRole: {},
    menuButtons: [],
    taskingList: [],
    dictionaryList: [],
    supplierList: [],
    supportSeries: []
  },
  getters: {
    getTaskingList: (state) => {
      let list = []
      if (!state.taskingList || !state.taskingList.length) {
        const cache = sessionStorage.getItem(exportingListStoreKey)
        if (cache) {
          list = JSON.parse(cache)
        } else {
          list = []
        }
      } else {
        list = state.taskingList
      }
      return list
    },
    getTodoParams: (state) => {
      return state.todoParams
    },
    getItemList: (state) => (groupCode, itemCode) => { // 根据组编码和项编码获取该项数据
      if (utils.isNone(state.dictionaryList) || utils.isNone(groupCode) || utils.isNone(itemCode)) {
        return []
      }
      let list = state.dictionaryList.filter(item => item.groupCode === groupCode)[0]
      return list.itemList.filter(item => item.itemCode === itemCode)
    },
    getWorkYearsName: (state) => (code) => {
      if (utils.isNone(state.dictionaryList)) {
        return []
      }
      let list = state.dictionaryList.filter(item => item.groupCode === 'dg_industry_experience')[0]
      return list.itemList.filter(item => item.itemCode === code)
    },
    // 返回上传下载域名 字符串
    getCurrentDomain: (state) => () => {
      if (utils.isNone(state.dictionaryList)) {
        return []
      }
      return state.dictionaryList.filter(item => item.groupCode === 'dg_file_domain')[0].itemList[0].itemCode
    },
    getDictByGroupName: (state) => (groupName) => {
      if (utils.isNone(state.dictionaryList)) {
        return []
      }
      return state.dictionaryList.filter(item => item.groupName === groupName)[0].itemList
    },
    // 根据数据字典的groupCode获取item
    // eslint-disable-next-line no-dupe-keys
    getDictByGroupCode: (state) => (groupCode) => {
      if (utils.isNone(state.dictionaryList)) {
        return []
      }
      const dictList = state.dictionaryList.filter(item => item.groupCode === groupCode)[0]
      // const arr = dictList.filter(item => item.itemCode === itemCode)
      return utils.isNone(dictList) ? [] : dictList.itemList
    },
    /**
     * 根据数据字典中的itemCode，查找对应的Name
     * @param {} itemCode
     */
    getDictItemname: (state) => (itemCode) => {
      const dictList = state.dictionaryList
      const arr = dictList.filter(item => item.itemCode === itemCode)[0]
      return utils.isNone(arr) ? '' : arr.itemList[0]
    },
    // 根据数据字典的groupCode和itemCode获取item
    getDictItemNameByGroupCode: (state) => (groupCode, itemCode) => {
      if (utils.isNone(state.dictionaryList)) {
        return []
      }
      if (!groupCode || !itemCode) {
        return []
      }
      const dictList = state.dictionaryList.filter(item => item.groupCode === groupCode)[0]
      const arr = dictList.itemList.filter(item => item.itemCode === itemCode)
      return utils.isNone(arr) ? '' : arr[0]
    },
    getFileTypePermisson: (state) => () => {
      if (utils.isNone(state.dictionaryList)) {
        return ''
      }
      const dictList = state.dictionaryList.filter(item => item.groupCode === 'upload_file_suffix_while_list')[0]
      const dicts = utils.isNone(dictList) ? [] : dictList.itemList
      const supports = dicts.map((item) => {
        return '.' + item.itemCode
      })
      return supports.join(',')
    }
  },
  mutations: {
    setLoading (state, status) {
      state.loading = status
    },
    markFingerprint (state, user) {
      const curSign = getFingerprint()
      if (!curSign) {
        const employeeNumber = user.employeeNumber
        const createSign = employeeNumber + '_' + utils.getUniqueMs()
        setFingerprint(createSign)
      }
    },
    setExportList (state, params) {
      state.taskingList = params
      sessionStorage.setItem(exportingListStoreKey, JSON.stringify(state.taskingList || []))
    },
    setTodoParams (state, params) {
      state.todoParams = params
    },
    setMockEnv (state, env) {
      state.mockEnv = env || false
    },
    setMenus (state, menus) {
      if (state.mockEnv) {
        menus = mockMenu.concat(menus)
      }
      state.menus = menus || []
    },
    setMenuButtons (state, menuButtons) {
      state.menuButtons = menuButtons || []
    },
    dictionaryList (state, dictList) {
      state.dictionaryList = dictList
    },
    supplierList (state, supplierList) {
      state.supplierList = supplierList || []
    },
    setUser (state, user) {
      state.user = user || {}
    },
    currentRole (state, userRole) {
      state.userRole = userRole || {}
    },
    setToken (state, token) {
      state.token = token || ''
    }
  },
  actions: {
    pushTaskingList ({ commit, state }, item) {
      if (!state.taskingList) state.taskingList = []
      state.taskingList.push(item)
      commit('setExportList', state.taskingList)
    },
    spliceTaskingList ({ commit, state }, index) {
      if (!state.taskingList) state.taskingList = []
      state.taskingList.splice(index, 1)
      commit('setExportList', state.taskingList)
    },
    loadTodoParams ({ commit, state }, params) {
      commit('setTodoParams', params)
    },
    async loadMenus ({ commit, state }) {
      try {
        let res = await api.getPermissionMenu()
        if (utils.isArray(res.data)) {
          deleteChildrenNode(res.data)
          const listTemp = res.data.filter(item => {
            // 去掉没有path和子菜单的数据
            if (item.path || item.children) {
              return true
            }
            return false
          })
          commit('setMenus', listTemp)
        }
      } catch (e) {}
      function deleteChildrenNode (arr) {
        arr.forEach(element => {
          if (utils.isEmpty(element.children)) {
            delete element.children
          } else {
            deleteChildrenNode(element.children)
          }
        })
      }
    },
    async loadMenuButtons ({ commit, state }) {
      try {
        let res = await api.catalogButton()
        if (utils.isArray(res.data)) {
          commit('setMenuButtons', res.data)
        }
        return Promise.resolve(res.data)
      } catch (e) {}
    },
    async loadUser ({ commit, state }) {
      try {
        let res = await api.getuser()
        if (res.code === 200) {
          if (utils.isObject(res.data)) {
            commit('setUser', res.data)
            commit('currentRole', res.data.currentRole)
            commit('markFingerprint', res.data)
          }
        } else {
          console.error('用户信息错误，请联系管理员')
          setTimeout(() => {
            // api.logout()
          }, 1500)
        }
      } catch (e) {
        console.error('用户信息错误，请联系管理员')
        setTimeout(() => {
          // api.logout()
        }, 1500)
      }
    },
    async loadDictList ({ commit, state }) {
      try {
        const res = await api.dictionaryList()
        if (res.code === 200) {
          commit('dictionaryList', res.data)
        }
        return Promise.resolve()
      } catch (e) {}
    },
    async loadSuppliers ({ commit, state }) {
      try {
        const res = await api.supplierList()
        if (res.code !== 200) {
          return
        }
        commit('supplierList', res.data)
      } catch (e) {}
    },
    changeToken ({ commit, token }) {
      commit('setToken', token)
    }
  }
}
