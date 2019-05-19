<template>
  <div class="about">
    <div v-html="compiledMarkdown"></div>
  </div>
</template>

<script>
  import About from '@/assets/About.md'

  export default {
    name: 'about',
    data() {
      return {
        compiledMarkdown: About
      }
    }
  }
</script>
