<script setup lang="ts"></script>

<template>
    <slot />
    <li class="divider" />
</template>

<style scoped lang="less">
@import url('@/styles/variable.less');
li.divider {
    height: 0;
    border-top: 1px solid @border-color-light;
    margin: 4px 0;
    cursor: auto;

    &:last-child {
        display: none;
    }
}
</style>
