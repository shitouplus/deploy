import Vue from 'vue'
import Vuex from 'vuex'
import { $http } from '@/services/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    operateProjectDialogVisible: false,
    projectList: [],
    project: {}
  },
  mutations: {
    changeOperateProjectDialogVisible(state, visible = false) {
      state.operateProjectDialogVisible = visible
    },
    resetProject(state) {
      state.project = {}
    },
    setProjectList(state, value) {
      state.projectList = value
    }
  },
  actions: {
    queryProjectList(context) {
      return $http.projectApi.queryList().then(res => {
        const { data } = res

        if (!data.success) {
          throw new Error(data.message)
        }

        context.commit('setProjectList', data.result)
      })
    }
  }
})
