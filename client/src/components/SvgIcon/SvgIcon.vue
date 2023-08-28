<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        prefix?: string;
        name: string;
    }>(),
    {
        prefix: 'icon',
    }
);

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>

<template>
    <svg
        class="icon"
        width="200px"
        height="200.00px"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
    >
        <!-- xlink命名空间已弃用，直接用href就行，这里仅用于适配老浏览器 -->
        <use :href="symbolId" :xlink-href="symbolId" />
    </svg>
</template>

<style scoped lang="less"></style>
