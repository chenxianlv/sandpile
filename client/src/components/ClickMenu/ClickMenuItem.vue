<script setup lang="ts">
import { inject } from 'vue';
import { ON_BEFORE_ITEM_CLICK_INJECTION_KEY } from './types';

const emit = defineEmits<{
    (e: 'click'): void;
}>();
const onBeforeItemClick = inject(ON_BEFORE_ITEM_CLICK_INJECTION_KEY);
const onClick = () => {
    onBeforeItemClick?.();
    emit('click');
};
</script>

<template>
    <li @click="onClick">
        <slot />
    </li>
</template>

<style scoped lang="less">
@import url('@/styles/variable.less');
@click-menu-item-indentation: 10px;

li {
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    padding: 0 0 0 @click-menu-item-indentation;
    color: @font-color-primary;
    border-radius: 6px;
    user-select: none;

    &:hover {
        background-color: @bg-color-row-hover;
    }
}
</style>
