<template>
    <div class="list">
        <ResizeContainer
            ref="child"
            v-for="(rect, index) in rects"
            :key="index"
            :currentIndex="index"
            :lastIndex="lastIndex"
            :w="rect.width || eachW"
            :h="rect.height"
            :x="rect.left || posArr[index]"
            :y="rect.top"
            :parentW="listWidth"
            :parentH="listHeight"
            :minw="rect.minw"
            :minh="rect.minh"
            v-on:resizing="changeSize($event, index)"
        >
            <div class="filler" :style="{backgroundColor:rect.color}"></div>
        </ResizeContainer>
    </div>
</template>
<script>
import ResizeContainer from './ResizeContainer'
export default {
    name: 'ResizeGroup',
    components: {
        ResizeContainer
    },
    data(){
        return {
            listWidth: 0,
            listHeight: 0,
            lastIndex: 0, // 一组容器最后一个
            eachW: 200,
            posArr: []
        }
    },
    props: {
        rects: {
            type: Array,
            default: []
        }
    },
    created() {
        this.lastIndex = this.rects.length - 1
    },
    mounted() {
        let listEl = document.querySelector('.list');
        this.listWidth = listEl.clientWidth;
        this.listHeight = listEl.clientHeight;
        this.eachW = Math.floor(this.listWidth/this.rects.length);
        this.rects.forEach((item, i) => {
            this.posArr[i] = i * this.eachW;
        });
        window.addEventListener('resize', ()=>{
            this.listWidth = listEl.clientWidth;
            this.listHeight = listEl.clientHeight;
        })
    },
    methods: {
        changeSize(newRect, index) {
            const $rects = this.$refs.child;
            if (index === this.lastIndex) return;
            for (let i = index + 1; i <= this.lastIndex; i++) {
                $rects[i].changeRightPos(newRect);
            }
        }
    },
}
</script>
<style>
.list {
  position: absolute;
  top: 30px;
  bottom: 30px;
  left: 30px;
  right: 800px;
  box-shadow: 0 0 2px #AAA;
  background-color: white;
}
.filler {
  width: 100%;
  height: 100%;
  display: inline-block;
}
</style>