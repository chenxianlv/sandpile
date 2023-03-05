<script setup lang="ts">
import { listProjectsAPI } from '@/api/note';
import { onActivated, ref } from 'vue';
import dayjs from 'dayjs';
import type { NoteProject } from '@/views/Note/hooks';
import type { NormalResponse } from '@/common/axios';
import { useRouter } from 'vue-router';
import $bus from '@/common/eventBus';

const noteProjects = ref<NoteProject[]>([]);
const router = useRouter();

const handleRowClick = ({ id }: { id: number }) => {
    router.push({ name: 'detail', params: { id } });
};

onActivated(() => {
    $bus.emit('headerCollapse', false);
});

listProjectsAPI().then((res: NormalResponse) => {
    noteProjects.value = res?.data?.data?.noteProjects;
});
</script>

<template>
    <div class="container">
        <!-- todo 搜索框-->
        <el-table :data="noteProjects" @row-click="handleRowClick">
            <el-table-column prop="projectName" label="笔记项目名">
            </el-table-column>
            <el-table-column
                prop="createUserName"
                label="创建者"
            ></el-table-column>
            <el-table-column label="创建时间">
                <template #default="{ row }">
                    <span>{{
                        dayjs(row.createTime).format('YYYY/MM/DD HH:mm:ss')
                    }}</span>
                </template>
            </el-table-column>
            <!--            <el-table-column width="100px">-->
            <!--                <template #default="{ row }">-->
            <!--                    <span></span>-->
            <!--                </template>-->
            <!--            </el-table-column>-->
        </el-table>
    </div>
</template>

<style lang="less" scoped>
.container {
    width: 100%;
    max-width: 1000px;
    height: 100%;
    margin: 0 auto;
    padding: 0 20px;

    background-color: @bg-color-top-layer;
    box-shadow: @normal-box-shadow;
}
.el-table {
    --el-table-bg-color: @bg-color-top-layer;
    --el-table-header-bg-color: @bg-color-top-layer;
    --el-table-tr-bg-color: @bg-color-top-layer;
    --el-table-row-hover-bg-color: @bg-color-table-row-hover;

    :deep(.el-scrollbar) {
        cursor: pointer;
    }
}
</style>
