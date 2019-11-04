<template>
    <div class="wrap">
        <span class="resize-panel-handle icon-gf icon-gf-grabber"
            @touchstart.stop.prevent="stickDown($event)"
        >
        </span>
    </div>
</template>
<script>
export default {
    name: 'ResizeContainer',
    props: {
        w: {
            type: Number,
            default: 200,
            validator: function (val) {
                return val > 0
            }
        },
        h: {
            type: Number,
            default: 200,
            validator: function (val) {
                return val > 0
            }
        },
        parentW: {
            type: Number,
            default: 0,
            validator: function (val) {
                return val >= 0
            }
        },
        parentH: {
            type: Number,
            default: 0,
            validator: function (val) {
                return val >= 0
            }
        }
    },
    data () {
        return {
            parentWidth: null,
            parentHeight: null,
            left: this.x,
            top: this.y,
            right: null,
            bottom: null
        }
    },
    created() {
        this.stickStartPos = {mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0};
    },
    mounted() {
        document.documentElement.addEventListener('mousemove', this.move);
        document.documentElement.addEventListener('mouseup', this.up);
        document.documentElement.addEventListener('mouseleave', this.up);
    },
    beforeDestroy: function () {
        document.documentElement.removeEventListener('mousemove', this.move);
        document.documentElement.removeEventListener('mouseup', this.up);
        document.documentElement.removeEventListener('mouseleave', this.up);
    },
    computed: {
        rect() {
            return {
                width: Math.round(this.width),
                height: Math.round(this.height)
            }
        }
    },
    methods: {
        move(ev) {
            ev.stopPropagation();
            const stickStartPos = this.stickStartPos;
            const pageX = typeof ev.pageX !== 'undefined' ? ev.pageX : ev.touches[0].pageX;
            const pageY = typeof ev.pageY !== 'undefined' ? ev.pageY : ev.touches[0].pageY;
            const delta = {
                x: stickStartPos.mouseX - pageX,
                y: stickStartPos.mouseY - pageY
            };
            let newBottom = stickStartPos.bottom + delta.y;
            let newRight = stickStartPos.right + delta.x;
            this.rawBottom = newBottom;
            this.rawRight = newRight;
            this.$emit('resizing', this.rect);
        },
        stickDown() {
            this.stickStartPos.mouseX = typeof ev.pageX !== 'undefined' ? ev.pageX : ev.touches[0].pageX;
            this.stickStartPos.mouseY = typeof ev.pageY !== 'undefined' ? ev.pageY : ev.touches[0].pageY;
            this.stickStartPos.right = this.right;
            this.stickStartPos.bottom = this.bottom;
        }
    },
}
</script>
<style scoped>
.wrap{
    width: 200px;
    height: 200px;
    background-color: #fbfbfb;
    position: relative;
    border: 1px solid #f4f5f8;
}
.resize-panel-handle {
    cursor: nwse-resize;
    position: absolute;
    font-size: 10px;
    bottom: 0;
    right: 0;
    width: 15px;
    height: 15px;
    display: block;
    color: #D8D9DA
}
@font-face {
    font-family: grafana-icons;
    src: url(grafana-icons.ttf?okx5td) format("truetype");
    font-weight: 400;
    font-style: normal
}
.icon-gf {
    font-family: grafana-icons!important;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale
}
.resize-panel-handle:before {
    left: initial;
    right: -1px;
    bottom: 0;
    position: absolute
}
.icon-gf-grabber:before {
    content: "\e90b"
}
</style>