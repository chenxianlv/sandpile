<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { $bus } from '@/common/eventBus';

const props = defineProps<{
    targetDOM: HTMLElement;
}>();

const left = ref(0);

const rePosition = () => {
    left.value = props.targetDOM.offsetLeft + props.targetDOM.offsetWidth;
};
const ro = new ResizeObserver(rePosition);
ro.observe(props.targetDOM);

$bus.on('sashRePosition', rePosition);
onUnmounted(() => {
    $bus.off('sashRePosition', rePosition);
});

let isDragging = ref(false);
let offset: number = 0;
const sashRef = ref<HTMLElement>();

const onMouseDown = () => {
    /**
     * 拖动sash条：
     * 拖动后left - 拖动前left = 拖动后sash据页面左侧距离 - 拖动前sash距页面左侧的距离
     * 拖动后left = 拖动后sash据页面左侧距离 + 拖动前left - 拖动前sash距页面左侧的距离
     * offset = 拖动前left - 拖动前sash距页面左侧的距离 = -(sash父定位元素距页面左侧的距离)
     */
    offset = left.value - (sashRef.value?.getBoundingClientRect().x ?? 0);
    isDragging.value = true;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
};
const onMouseUp = (e: MouseEvent) => {
    if (!isDragging.value) return;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    const width =
        e.pageX -
        props.targetDOM.getBoundingClientRect().x -
        Math.floor((sashRef.value?.getBoundingClientRect().width ?? 0) * 0.5);
    const style = props.targetDOM.style;
    // 额外设置 minWidth 和 maxWidth 用于防止flex布局对宽度造成影响
    style.width = width + 'px';
    style.minWidth = width + 'px';
    style.maxWidth = width + 'px';

    $bus.emit('sashRePosition');
    isDragging.value = false;
};
const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    if (!isDragging.value) return;
    // 减去一半宽度是为了使指针定位在sash的中央
    left.value =
        e.pageX +
        offset -
        Math.floor((sashRef.value?.getBoundingClientRect().width ?? 0) * 0.5);
};
</script>

<template>
    <div
        ref="sashRef"
        :class="['size-sash', 'vertical', { isDragging }]"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        @mousemove="onMouseMove"
    ></div>
</template>

<style lang="less" scoped>
.size-sash {
    position: absolute;
    z-index: 30;
    cursor: w-resize;
    border: none;

    &.vertical {
        @width: 4px;
        width: @width;
        height: 100%;
        left: v-bind("left + 'px'");

        &::after {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            border-left: @width dashed transparent;
            transition: border-left-color 0.2s ease-out;
        }

        &.isDragging::after {
            border-left-color: #007fd4;
        }
    }
}
</style>
