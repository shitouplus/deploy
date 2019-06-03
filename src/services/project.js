export default $axios => ({
  queryList() {
    return $axios.get('/projects')
  },
  addItem(params) {
    return $axios.post('/projects', params)
  },
  deleteItem(params) {
    return $axios.post('/projects/delete', params)
  },
  queryItem(name) {
    return $axios.get('/projects/config', {
      params: { name }
    })
  },
  configItem(params) {
    return $axios.post('/projects/config', params)
  },
  queryTags(repository) {
    return $axios.get('/projects/tags', {
      params: { repository }
    })
  },
  deployTag(params) {
    return $axios.post('/projects/deploy/tag', params)
  },
  queryPort(port) {
    return $axios.get('/projects/port', {
      params: { port }
    })
  }
})
