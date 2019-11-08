<template>
    <div
        class="resize-wrap"
        :style="style"
    >
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
        parentLimitation: {
            type: Boolean, default: true
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
        },
        minw: {
            type: Number,
            default: 50,
            validator: function (val) {
                return val > 0
            }
        },
        minh: {
            type: Number,
            default: 50,
            validator: function (val) {
                return val > 0
            }
        },
        // 当前索引
        currentIndex: {
            type: Number,
            default: 0
        },
        lastIndex: {
            type: Number,
            default: 0
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
            bottom: null,
            minWidth: this.minw,
            minHeight: this.minh
        }
    },
    created() {
        this.stickDrag = false;
        this.stickStartPos = {mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0};
        this.limits = {
            minLeft: null,
            maxLeft: null,
            minRight: null,
            maxRight: null,
            minTop: null,
            maxTop: null,
            minBottom: null,
            maxBottom: null
        };
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
                top: this.top + 'px',
                left: this.left + 'px',
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
                left: Math.round(this.left),
                top: Math.round(this.top),
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
        },
        stickDown(ev) {
            this.stickDrag = true;
            this.stickStartPos.mouseX = typeof ev.pageX !== 'undefined' ? ev.pageX : ev.touches[0].pageX;
            this.stickStartPos.mouseY = typeof ev.pageY !== 'undefined' ? ev.pageY : ev.touches[0].pageY;
            this.stickStartPos.right = this.right;
            this.stickStartPos.bottom = this.bottom;

            this.limits = this.calcResizeLimitation();
        },
        calcResizeLimitation() {
            let minw = this.minWidth;
            let minh = this.minHeight;
            const width = this.width;
            const height = this.height;
            const bottom = this.bottom;
            const top = this.top;
            const left = this.left;
            const right = this.right;

            const parentLim = this.parentLimitation ? 0 : null;
            

            let limits = {
                minLeft: parentLim,
                maxLeft: left + (width - minw),
                minRight: parentLim,
                maxRight: right + (width - minw),
                minTop: parentLim,
                maxTop: top + (height - minh),
                minBottom: parentLim,
                maxBottom: bottom + (height - minh)
            };
            return limits;
        },
        changeRightPos(rect) {
            this.left = rect.left + rect.width
        }
    },
    watch: {
        x(val) {
            this.left = val
        },
        rawLeft(newLeft) {
            this.left = newLeft;
        },
        rawRight(newRight) {
            const limits = this.limits;
            if (limits.minRight !== null && newRight < limits.minRight) {
                newRight = limits.minRight;
            } else if (limits.maxRight !== null && limits.maxRight < newRight) {
                newRight = limits.maxRight;
            }
            this.right = newRight;
        },
        rawTop(newTop) {
            this.top = newTop;
        },
        rawBottom(newBottom) {
            const limits = this.limits;
            if (limits.minBottom !== null && newBottom < limits.minBottom) {
                newBottom = limits.minBottom;
            } else if (limits.maxBottom !== null && limits.maxBottom < newBottom) {
                newBottom = limits.maxBottom;
            }
            this.bottom = newBottom;
        },
        w() {
            if (this.stickDrag) {
                return
            }
            if (this.parentLimitation) {
                this.limits = this.calcResizeLimitation();
            }
            let delta = this.width - this.w;
            this.rawRight = this.right + delta;
        },
        h() {
            if (this.stickDrag) {
                return
            }
            if (this.parentLimitation) {
                this.limits = this.calcResizeLimitation();
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
        },
        minw(val) {
            if (val > 0 && val <= this.width) {
                this.minWidth = val
            }
        },
        minh(val) {
            if (val > 0 && val <= this.height) {
                this.minHeight = val
            }
        }
    },
}
</script>
<style scoped>
.resize-wrap{
    background-color: #fbfbfb;
    position: absolute;
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
    color: #D8D9DA;
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