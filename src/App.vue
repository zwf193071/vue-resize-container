<template>
  <div id="app">
    <ResizeGroup :rects="rects"></ResizeGroup>
  </div>
</template>

<script>
import ResizeGroup from './components/ResizeGroup'

export default {
  name: 'App',
  components: {
    ResizeGroup
  },
  computed: {
    rects() {
      return this.$store.state.rect.rects
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
