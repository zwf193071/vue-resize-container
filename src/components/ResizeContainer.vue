<template>
    <div class="wrap" :style="style">
        <span class="resize-panel-handle icon-gf icon-gf-grabber"
            @mousedown.stop.prevent="stickDown($event)"
            @touchstart.stop.prevent="stickDown($event)"
        >
        </span>
        <slot></slot>
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
        x: {
            type: Number,
            default: 0,
            validator: function (val) {
                return typeof val === 'number'
            }
        },
        y: {
            type: Number,
            default: 0,
            validator: function (val) {
                return typeof val === 'number'
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
            rawWidth: this.w,
            rawHeight: this.h,
            rawLeft: this.x,
            rawTop: this.y,
            rawRight: null,
            rawBottom: null,
            parentWidth: null,
            parentHeight: null,
            left: this.x,
            top: this.y,
            right: null,
            bottom: null
        }
    },
    created() {
        this.stickDrag = false;
        this.stickStartPos = {mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0};
    },
    mounted() {
        this.parentElement = this.$el.parentNode;
        this.parentWidth = this.parentW ? this.parentW : this.parentElement.clientWidth;
        this.parentHeight = this.parentH ? this.parentH : this.parentElement.clientHeight;

        this.rawRight = this.parentWidth - this.rawWidth - this.rawLeft;
        this.rawBottom = this.parentHeight - this.rawHeight - this.rawTop;

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
        style() {
            return {
                width: this.width + 'px',
                height: this.height + 'px'
            }
        },
        width() {
            return this.parentWidth - this.left - this.right;
        },
        height() {
            return this.parentHeight - this.top - this.bottom;
        },
        rect() {
            return {
                width: Math.round(this.width),
                height: Math.round(this.height)
            }
        }
    },
    methods: {
        move(ev) {
            if (!this.stickDrag) {
                return
            }
            ev.stopPropagation();
            this.stickMove(ev);
        },
        up(ev) {
            if (this.stickDrag) {
                this.stickUp(ev);
            }
        },
        stickMove(ev) {
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
        stickUp() {
            this.stickDrag = false;
            this.stickStartPos = {
                mouseX: 0,
                mouseY: 0,
                x: 0,
                y: 0,
                w: 0,
                h: 0
            };
            this.rawTop = this.top;
            this.rawBottom = this.bottom;
            this.rawLeft = this.left;
            this.rawRight = this.right;

            this.$emit('resizing', this.rect);
        },
        stickDown(ev) {
            this.stickDrag = true;
            this.stickStartPos.mouseX = typeof ev.pageX !== 'undefined' ? ev.pageX : ev.touches[0].pageX;
            this.stickStartPos.mouseY = typeof ev.pageY !== 'undefined' ? ev.pageY : ev.touches[0].pageY;
            this.stickStartPos.right = this.right;
            this.stickStartPos.bottom = this.bottom;
        }
    },
    watch: {
        rawLeft(newLeft) {
            this.left = newLeft;
        },
        rawRight(newRight) {
            this.right = newRight;
        },
        rawTop(newTop) {
            this.top = newTop;
        },
        rawBottom(newBottom) {
            this.bottom = newBottom;
        },
        w() {
            if (this.stickDrag) {
                return
            }
            let delta = this.width - this.w;
            this.rawRight = this.right + delta;
        },
        h() {
            if (this.stickDrag) {
                return
            }
            let delta = this.height - this.h;
            this.rawBottom = this.bottom + delta;
        },
        parentW(val) {
            this.right = val - this.width - this.left;
            this.parentWidth = val;
        },
        parentH(val) {
            this.bottom = val - this.height - this.top;
            this.parentHeight = val;
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