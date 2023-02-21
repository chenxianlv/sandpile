<script setup lang="ts">
import { listProjectsAPI } from '@/api/note';
import { onMounted, ref } from 'vue';
import type { NoteProject } from '@/views/Note/hooks';
import type { NormalResponse } from '@/common/axios';
import { useRouter } from 'vue-router';

const noteProjects = ref<NoteProject[]>([]);
const router = useRouter();

onMounted(() => {
    listProjectsAPI().then((res: NormalResponse) => {
        noteProjects.value = res?.data?.data?.noteProjects;
    });
});
const showDetail = (id: number) => {
    router.push({ name: 'detail', params: { id } });
};
</script>

<template>
    <el-table :data="noteProjects">
        <el-table-column
            type="index"
            lable="序号"
            width="100px"
        ></el-table-column>
        <el-table-column prop="projectName" label="笔记项目名">
            <template #default="{ row }">
                <el-button link type="primary" @click="showDetail(row.id)"
                    >{{ row.projectName }}
                </el-button>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
            <template #default></template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>
