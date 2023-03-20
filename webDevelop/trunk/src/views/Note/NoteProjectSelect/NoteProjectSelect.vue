<script setup lang="ts">
// todo 选择完重命名或删除按钮后，自动关闭popover
// todo 删除dialog样式调整
import { listProjectsAPI, updateProjectAPI } from '@/api/note';
import { computed, nextTick, ref } from 'vue';
import dayjs from 'dayjs';
import type { NoteProject } from '@/views/Note/hooks';
import type { NormalResponse } from '@/common/axios';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
import DeleteDialog from '@/views/Note/NoteProjectSelect/DeleteDialog.vue';
import AddDialog from '@/views/Note/NoteProjectSelect/AddDialog.vue';

const noteProjects = ref<NoteProject[]>([]);

const listProjects = async () => {
    const res: NormalResponse = await listProjectsAPI();
    if (res?.data?.data?.noteProjects) {
        noteProjects.value = res?.data?.data?.noteProjects;
    }
};
listProjects();

const router = useRouter();
const handleCellClick = (row: { id: number }, column: any) => {
    if (column.columnKey === 'no-jump') return;
    if (row.id === editId.value) return;
    router.push({ name: 'detail', params: { id: row.id } });
};

const filterString = ref<string>('');
const noteProjectsAfterFilter = computed(() => {
    return noteProjects.value.filter((project) => {
        if (project.projectName.includes(filterString.value)) return true;
        if (project.createUserName?.includes(filterString.value)) return true;
        if (
            project.createTime &&
            dayjs(project.createTime)
                .format('YYYY/MM/DD HH:mm:ss')
                .includes(filterString.value)
        )
            return true;
    });
});

const editId = ref<number>();
const editText = ref<string>('');
const startEdit = (row: NoteProject) => {
    editId.value = row.id;
    editText.value = row.projectName;
    nextTick(() => {
        const inputEl = document.getElementById('sp-edit-input-' + row.id);
        inputEl?.focus();
    });
};
const submitEdit = async () => {
    console.log({ id: editId.value, projectName: editText.value });
    await updateProjectAPI({ id: editId.value, projectName: editText.value });
    editId.value = undefined;
    editText.value = '';
    await listProjects();
};

const addDialogVisible = ref<boolean>(false);
const deleteDialogVisible = ref<boolean>(false);
const deleteRowData = ref<NoteProject>();
const showDeleteDialog = (row: NoteProject) => {
    deleteRowData.value = row;
    deleteDialogVisible.value = true;
};
</script>

<template>
    <div class="container">
        <header>
            <el-input
                class="search-input"
                placeholder="搜索项目"
                :prefix-icon="Search"
                v-model="filterString"
            />
            <el-button type="primary" @click="addDialogVisible = true"
                >新建项目
            </el-button>
        </header>
        <div class="table-container">
            <el-table
                :data="noteProjectsAfterFilter"
                :row-style="{ height: '50px' }"
                @cell-click="handleCellClick"
                height="100%"
            >
                <el-table-column
                    prop="projectName"
                    label="笔记项目名"
                    :width="350"
                >
                    <template #default="{ row }">
                        <el-input
                            :id="'sp-edit-input-' + row.id"
                            v-if="editId === row.id"
                            v-model="editText"
                            maxlength="50"
                            show-word-limit
                            @keydown.enter="(e) => e.target.blur()"
                            @blur="submitEdit"
                        />
                        <span v-else>{{ row.projectName }}</span>
                    </template>
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
                <el-table-column width="45px" column-key="no-jump">
                    <template #default="{ row }">
                        <el-popover placement="bottom-end" trigger="hover">
                            <template #reference>
                                <el-icon>
                                    <MoreFilled />
                                </el-icon>
                            </template>
                            <template #default>
                                <ul class="option-menu">
                                    <li @click="startEdit(row)">重命名</li>
                                    <li @click="showDeleteDialog(row)">删除</li>
                                </ul>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <DeleteDialog
            v-model:visible="deleteDialogVisible"
            :row-data="deleteRowData"
            @submit-success="listProjects"
        />
        <AddDialog
            v-model:visible="addDialogVisible"
            @submit-success="listProjects"
        />
    </div>
</template>

<style lang="less" scoped>
.container {
    box-sizing: border-box;
    width: 100%;
    max-width: 1000px;
    height: 100%;
    margin: 0 auto;
    padding: 20px 20px 0;
    display: flex;
    flex-direction: column;

    background-color: @bg-color-middle-layer;
    box-shadow: @box-shadow-normal-large;

    header {
        width: 100%;
        margin: 0 0 10px;
        flex: none;
        display: flex;
        justify-content: end;

        .search-input {
            width: 430px;
            height: 32px;
            margin-right: 15px;
        }
    }

    .table-container {
        flex-grow: 1;
        overflow: auto;
    }
}

.el-table {
    --el-table-bg-color: @bg-color-middle-layer;
    --el-table-header-bg-color: @bg-color-middle-layer;
    --el-table-tr-bg-color: @bg-color-middle-layer;
    --el-table-row-hover-bg-color: @bg-color-row-hover;

    --el-table-header-text-color: @font-color-regular;
    --el-table-text-color: @font-color-regular;

    :deep(.el-scrollbar) {
        cursor: pointer;
    }
}
</style>
