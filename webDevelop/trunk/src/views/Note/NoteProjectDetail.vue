<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useNoteDetail } from '@/views/Note/hooks';

let projectId = useRoute().params.id;
if (projectId instanceof Array) {
    projectId = projectId[0];
}
const [noteTreeData, getNoteText] = useNoteDetail(projectId);
</script>

<template>
    <div v-if="projectId === ''">404</div>
    <el-container v-else
        >{{ noteTreeData }}
        <el-aside></el-aside>
        <el-main></el-main>
    </el-container>
</template>

<style scoped></style>
