<script setup lang="ts">
import { listProjectsAPI, updateProjectAPI } from '@/api/note';
import { computed, nextTick, ref } from 'vue';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { Search, MoreFilled } from '@element-plus/icons-vue';
import type { NoteProject } from '@/views/Note/NoteProjectDetail/hooks';
import type { NormalResponse } from '@/common/axios';
import vAuth from '@/directives/vAuth';
import DeleteDialog from '@/views/Note/NoteProjectSelect/DeleteNoteProjectDialog.vue';
import AddDialog from '@/views/Note/NoteProjectSelect/AddNoteProjectDialog.vue';
import { useUserStore } from '@/stores/userStore';

const noteProjects = ref<NoteProject[]>([]);
const userStore = useUserStore();

const listProjects = () => {
    listProjectsAPI()
        .then((res: NormalResponse) => {
            const data = res?.data?.data?.noteProjects;
            if (!data) return;
            const timeFormatter = (item: any) => {
                if (item?.createTime) {
                    item.createTime = dayjs(item.createTime).format('YYYY/MM/DD HH:mm:ss');
                }
                return item;
            };
            noteProjects.value = data?.map?.(timeFormatter) ?? [];
        })
        .catch(() => {});
};
listProjects();

const router = useRouter();
const handleCellClick = (row: { id: number }, column: any, cell: any) => {
    // 若正在编辑项目名，则不跳转
    if (row.id === editId.value) return;
    // 若单元格为空，则跳转
    if ((cell.children?.[0]?.children?.length ?? 0) === 0) {
        router.push({ name: 'detail', params: { id: row.id } });
        return;
    }
    if (column.columnKey === 'no-jump') return;
    router.push({ name: 'detail', params: { id: row.id } });
};

const filterString = ref<string>('');
const noteProjectsAfterFilter = computed(() => {
    return noteProjects.value.filter((project) => {
        if (project.projectName?.includes(filterString.value)) return true;
        if (project.createUserName?.includes(filterString.value)) return true;
        if (project.createTime?.includes(filterString.value)) return true;
    });
});

const editId = ref<number>();
const editText = ref<string>('');
const editInputDisabled = ref(false);
const inputFocus = (id: string) => {
    nextTick(() => {
        const inputEl = document.getElementById(id);
        inputEl?.focus();
    });
};
const startEdit = (row: NoteProject) => {
    editId.value = row.id;
    editText.value = row.projectName;
    inputFocus('sp-edit-input-' + row.id);
};
const submitEdit = () => {
    editInputDisabled.value = true;
    updateProjectAPI({ id: editId.value, projectName: editText.value })
        .then(() => {
            listProjects();
        })
        .catch(() => {})
        .finally(() => {
            editId.value = undefined;
            editText.value = '';
            editInputDisabled.value = false;
        });
};

const addDialogVisible = ref<boolean>(false);
const deleteDialogVisible = ref<boolean>(false);
const deleteRowData = ref<NoteProject | undefined>();
const showDeleteDialog = (row: NoteProject) => {
    deleteRowData.value = row;
    deleteDialogVisible.value = true;
};

const getProjectRequiredEditAuthList = (data: NoteProject) => {
    const isOwner = userStore.id !== undefined && data.owners.includes(userStore.id);
    return isOwner ? [1] : [2];
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
            <el-button v-auth="[5]" type="primary" @click="addDialogVisible = true"
                >新建项目
            </el-button>
        </header>
        <div class="table-container">
            <el-table
                :data="noteProjectsAfterFilter"
                :row-style="{ height: '50px' }"
                @cell-click="handleCellClick"
                height="100%"
                row-key="id"
            >
                <el-table-column prop="projectName" label="笔记项目名" :width="350">
                    <template #default="{ row }">
                        <el-input
                            :id="'sp-edit-input-' + row.id"
                            v-if="editId === row.id"
                            v-model="editText"
                            maxlength="50"
                            show-word-limit
                            :disabled="editInputDisabled"
                            @keydown.enter="(e:KeyboardEvent) => e.target?.blur?.()"
                            @blur="submitEdit"
                        />
                        <span v-else>{{ row.projectName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createUserName" label="创建者"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column width="45px" column-key="no-jump">
                    <template #default="{ row }">
                        <div v-auth="getProjectRequiredEditAuthList(row)">
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
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <DeleteDialog
            v-model="deleteDialogVisible"
            :row-data="deleteRowData"
            @submit-success="listProjects"
        />
        <AddDialog v-model="addDialogVisible" @submit-success="listProjects" />
    </div>
</template>

<style lang="less" scoped>
@import url('@/styles/variable.less');
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
}
</style>
