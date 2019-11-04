<template>
  <div id="app">
    <ResizeContainer
      v-for="(rect, index) in rects"
      :key="index"
      :w="rect.width"
      :h="rect.height"
      v-on:resizing="changeSize($event, index)"
    >
      <div class="filler" :style="{backgroundColor:rect.color}"></div>
    </ResizeContainer>
  </div>
</template>

<script>
import ResizeContainer from './components/ResizeContainer'

export default {
  name: 'App',
  components: {
    ResizeContainer
  },
  computed: {
    rects() {
      return this.$store.state.rect.rects
    }
  },
  methods: {
    changeSize(newRect, index) {
      this.$store.dispatch('rect/setWidth', {id: index, width: newRect.width});
      this.$store.dispatch('rect/setHeight', {id: index, height: newRect.height});
    },
  },
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
.filler {
  width: 100%;
  height: 100%;
  display: inline-block;
  position: absolute;
}
</style>
