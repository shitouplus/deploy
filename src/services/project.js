export default $axios => ({
  queryList() {
    return $axios.get('/projects')
  },
  addItem(params) {
    return $axios.post('/projects', params)
  }
})
