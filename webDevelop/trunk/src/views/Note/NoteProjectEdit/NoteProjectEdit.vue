<script setup lang="ts">
import MarkdownTextarea from '@/components/Markdown/MdTextarea.vue';
import { ref } from 'vue';

const text = ref('');
</script>

<template>
    <MarkdownTextarea :input-debounce="200" v-model="text" />
</template>

<style scoped></style>
