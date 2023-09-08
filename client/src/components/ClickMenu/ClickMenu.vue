<script setup lang="ts">
import { provide } from 'vue';
import { ON_BEFORE_ITEM_CLICK_INJECTION_KEY } from './types';

const emit = defineEmits<{
    (e: 'beforeItemClick'): void;
}>();
provide(ON_BEFORE_ITEM_CLICK_INJECTION_KEY, () => {
    emit('beforeItemClick');
});
</script>

<template>
    <ul>
        <slot />
    </ul>
</template>

<style scoped lang="less">
ul {
    margin: 0;
    padding: 0;
    list-style: none;
}
</style>
