<template>
  <div class="home">
    <div>{{project.name}}</div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'home',
    data () {
      return {
      }
    },
    computed: {
      ...mapState(['project'])
    }
  }
</script>
