<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const X_OFFSET = 0;
const Y_OFFSET = 0;

const props = defineProps<{
    visible: boolean;
    clickEvent?: MouseEvent;
}>();
const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
}>();
const containerRef = ref<HTMLElement | null>(null);
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
            :style="{
                left: props.clickEvent ? props.clickEvent.pageX + X_OFFSET + 'px' : undefined,
                top: props.clickEvent ? props.clickEvent.pageY + Y_OFFSET + 'px' : undefined,
            }"
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

    &.visible {
        display: block;
    }
}
</style>
