<script setup lang="ts">
import { listProjectsAPI } from '@/api/note';
import { computed, onActivated, ref } from 'vue';
import dayjs from 'dayjs';
import type { NoteProject } from '@/views/Note/hooks';
import type { NormalResponse } from '@/common/axios';
import { useRouter } from 'vue-router';
import $bus from '@/common/eventBus';
import { Search } from '@element-plus/icons-vue';

const noteProjects = ref<NoteProject[]>([]);
const router = useRouter();

onActivated(() => {
    $bus.emit('headerCollapse', false);
});

listProjectsAPI().then((res: NormalResponse) => {
    noteProjects.value = res?.data?.data?.noteProjects;
});

const handleRowClick = ({ id }: { id: number }) => {
    router.push({ name: 'detail', params: { id } });
};

const filterString = ref<string>('');
const noteProjectsAfterFilter = computed(() => {
    return noteProjects.value.filter((project) => {
        if (project.projectName.includes(filterString.value)) return true;
        if (project.createUserName.includes(filterString.value)) return true;
    });
});
</script>

<template>
    <div class="container">
        <el-input
            class="search-input"
            placeholder="搜索项目"
            :prefix-icon="Search"
            v-model="filterString"
        />
        <el-table :data="noteProjectsAfterFilter" @row-click="handleRowClick">
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
    box-sizing: border-box;
    width: 100%;
    max-width: 1000px;
    height: 100%;
    margin: 0 auto;
    padding: 0 20px;

    background-color: @bg-color-top-layer;
    box-shadow: @normal-box-shadow;
}
.search-input {
    --el-input-border-radius: 8px;
    --el-input-hover-border-color: @base-border-color;

    float: right;
    width: 430px;
    height: 32px;
    margin: 10px 0;
}
.el-table {
    --el-table-bg-color: @bg-color-top-layer;
    --el-table-header-bg-color: @bg-color-top-layer;
    --el-table-tr-bg-color: @bg-color-top-layer;
    --el-table-row-hover-bg-color: @bg-color-table-row-hover;

    --el-table-header-text-color: @regular-font-color;
    --el-table-text-color: @regular-font-color;

    :deep(.el-scrollbar) {
        cursor: pointer;
    }
}
</style>
