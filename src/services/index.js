import axios from 'axios'
import projectApiFactory from './project'

export const $http = axios.create()

$http.projectApi = projectApiFactory($http)

export default {
  install(Vue) {
    Vue.prototype.$http = $http
  }
}

