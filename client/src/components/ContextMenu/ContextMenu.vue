<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps<{
    visible: boolean;
    clickEvent?: MouseEvent;
}>();
const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
}>();
const containerRef = ref<HTMLElement | null>(null);

// 菜单与页面边界的最小距离，单位为像素
const PAGE_MARGIN = 10;
const left = computed(() => {
    if (!props.clickEvent || !containerRef.value) return 'auto';
    const { width } = containerRef.value.getBoundingClientRect();
    const { offsetWidth: pageWidth } = document.documentElement;

    return Math.min(props.clickEvent.pageX, pageWidth - PAGE_MARGIN - width) + 'px';
});
const top = computed(() => {
    if (!props.clickEvent || !containerRef.value) return 'auto';
    const { height } = containerRef.value.getBoundingClientRect();
    const { offsetHeight: pageHeight } = document.documentElement;
    return Math.min(props.clickEvent.pageY, pageHeight - PAGE_MARGIN - height) + 'px';
});

const hide = () => {
    emit('update:visible', false);
};
const outsideClickDetect = (e: any) => {
    if (!props.visible || !containerRef.value || !e.target) return;
    if (!containerRef.value.contains(e.target)) hide();
};
onMounted(() => {
    // document.addEventListener('wheel', hide);
    document.addEventListener('click', outsideClickDetect, { capture: true });
});
onUnmounted(() => {
    // document.removeEventListener('wheel', hide);
    document.removeEventListener('click', outsideClickDetect);
});
defineExpose({
    hide,
});
</script>

<template>
    <Teleport to="body">
        <div
            ref="containerRef"
            :class="['el-popper is-light el-popover', 'context-menu', { visible: props.visible }]"
            @contextmenu="(e) => e.preventDefault()"
        >
            <slot name="default" />
        </div>
    </Teleport>
</template>

<style lang="less">
.context-menu {
    position: absolute;
    background-color: #ffffff;
    display: none;
    left: v-bind(left);
    top: v-bind(top);

    &.visible {
        display: block;
    }
}
</style>
