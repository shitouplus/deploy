import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:project',
      name: 'home',
      component: Home
    },
    {
      path: '/',
      name: 'about',
      component: About
    },
    {
      path: '*',
      name: 'not-found',
      component: NotFound
    }
  ]
})
