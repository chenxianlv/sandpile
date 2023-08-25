<script setup lang="ts">
// 重要提醒：使用该组件必须保证其父元素为定位元素
import { onMounted, onUnmounted, ref } from 'vue';
import $bus from '@/common/eventBus';

const props = withDefaults(
    defineProps<{
        targetDOM: HTMLElement;
        // width设为百分比，这样可以在页面宽度改变时调整元素宽度
        percentageMode?: boolean;
        minWidth?: number;
        maxWidth?: number;
        minDistanceToParentRight?: number;
    }>(),
    {
        percentageMode: false,
        minWidth: 100,
        maxWidth: 9999,
        minDistanceToParentRight: 10,
    }
);

onMounted(() => {
    if (
        props.targetDOM.parentElement &&
        props.targetDOM.parentElement !== props.targetDOM.offsetParent
    ) {
        console.error('VerticalSizeSash的父元素必须为定位元素');
    }
});

const left = ref(0);

const rePosition = () => {
    left.value = props.targetDOM.offsetLeft + props.targetDOM.offsetWidth;
};
const ro = new ResizeObserver(rePosition);
ro.observe(props.targetDOM);

$bus.on('manualResize', rePosition);
onUnmounted(() => {
    $bus.off('manualResize', rePosition);
});

let isDragging = ref(false);
// 目标DOM左侧至页面左侧的距离
let targetDomToPageLeft: number = 0;
const sashRef = ref<HTMLElement>();

const onMouseDown = () => {
    targetDomToPageLeft = props.targetDOM?.getBoundingClientRect().x ?? 0;
    isDragging.value = true;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
};
const onMouseUp = (e: MouseEvent) => {
    if (!isDragging.value) return;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    const mouseToPageLeft = e.pageX;
    const sashWidth = Math.floor(sashRef.value?.getBoundingClientRect().width ?? 0);

    // 减去一半sash宽度是为了使指针定位在sash的中央
    let width: number | string = mouseToPageLeft - targetDomToPageLeft - sashWidth / 2;
    const maxWidth = Math.min(
        props.maxWidth,
        document.documentElement.offsetWidth - props.minDistanceToParentRight
    );
    width = Math.min(maxWidth, Math.max(width, props.minWidth));

    const widthStr =
        props.percentageMode && props.targetDOM.parentElement
            ? (width / props.targetDOM.parentElement.getBoundingClientRect().width) * 100 + '%'
            : width + 'px';

    const style = props.targetDOM.style;
    // 额外设置 minWidth 和 maxWidth 用于防止flex布局对宽度造成影响
    style.width = widthStr;
    style.minWidth = widthStr;
    style.maxWidth = widthStr;

    $bus.emit('manualResize');
    isDragging.value = false;
};
const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    if (!isDragging.value) return;

    const mouseToPageLeft = e.pageX;
    const sashWidth = Math.floor(sashRef.value?.getBoundingClientRect().width ?? 0);

    // 减去一半sash宽度是为了使指针定位在sash的中央
    const tempLeft = mouseToPageLeft - targetDomToPageLeft - sashWidth / 2;

    const maxWidth = Math.min(
        props.maxWidth,
        document.documentElement.offsetWidth - props.minDistanceToParentRight
    );
    left.value = Math.min(maxWidth, Math.max(tempLeft, props.minWidth));
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
