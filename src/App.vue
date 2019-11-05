<template>
  <div id="app">
    <div class="list" id="list">
      <ResizeContainer
        v-for="(rect, index) in rects"
        :key="index"
        :w="rect.width"
        :h="rect.height"
        :x="rect.left"
        :y="rect.top"
        :parentW="listWidth"
        :parentH="listHeight"
        v-on:resizing="changeSize($event, index)"
      >
        <div class="filler" :style="{backgroundColor:rect.color}"></div>
      </ResizeContainer>
    </div>
  </div>
</template>

<script>
import ResizeContainer from './components/ResizeContainer'

export default {
  name: 'App',
  components: {
    ResizeContainer
  },
  data(){
    return {
      listWidth: 0,
      listHeight: 0
    }
  },
  computed: {
    rects() {
      return this.$store.state.rect.rects
    }
  },
  mounted() {
    let listEl = document.getElementById('list');
    this.listWidth = listEl.clientWidth;
    this.listHeight = listEl.clientHeight;

    window.addEventListener('resize', ()=>{
      this.listWidth = listEl.clientWidth;
      this.listHeight = listEl.clientHeight;
    })
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
.list {
  position: absolute;
  top: 30px;
  bottom: 30px;
  left: 30px;
  right: 300px;
  box-shadow: 0 0 2px #AAA;
  background-color: white;
}
.filler {
  width: 100%;
  height: 100%;
  display: inline-block;
}
</style>
