<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search, MoreFilled } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import { listProjectsAPI } from '@/api/note';
import type { NoteProject } from '@/api/note';
import vAuth from '@/directives/vAuth';
import DeleteDialog from '@/views/Note/NoteProjectSelect/DeleteNoteProjectDialog.vue';
import AddDialog from '@/views/Note/NoteProjectSelect/AddNoteProjectDialog.vue';
import { useUserStore } from '@/stores/userStore';

const noteProjects = ref<NoteProject[]>([]);
const userStore = useUserStore();

const listProjects = () => {
    listProjectsAPI()
        .then((res) => {
            const timeFormatter = (item: any) => {
                if (item?.createTime) {
                    item.createTime = dayjs(item.createTime).format('YYYY/MM/DD HH:mm:ss');
                }
                return item;
            };
            noteProjects.value = res.data.data.noteProjects.map(timeFormatter);
        })
        .catch(() => {});
};
listProjects();

const router = useRouter();
const handleCellClick = (row: { id: number }, column: any, cell: any) => {
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
        if (project.createUsername?.includes(filterString.value)) return true;
        if (project.createTime?.includes(filterString.value)) return true;
    });
});

const addDialogVisible = ref<boolean>(false);
const deleteDialogVisible = ref<boolean>(false);
const editDialogVisible = ref<boolean>(false);
const selectedRowData = ref<NoteProject | undefined>();
const showDeleteDialog = (row: NoteProject) => {
    selectedRowData.value = row;
    deleteDialogVisible.value = true;
};
const showEditDialog = (row: NoteProject) => {
    selectedRowData.value = row;
    editDialogVisible.value = true;
};

const getProjectRequiredEditAuthList = (data: NoteProject) => {
    const isOwner = userStore.id !== undefined && data.owners.some(({ id }) => id === userStore.id);
    return isOwner ? [20001] : [20002];
};
</script>

<template>
    <div class="container">
        <header>
            <el-input
                class="search-input"
                :placeholder="$t('note.searchProject')"
                :prefix-icon="Search"
                v-model="filterString"
            />
            <el-button v-auth="[20005]" type="primary" @click="addDialogVisible = true"
                >{{ $t('note.addProject') }}
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
                <el-table-column
                    prop="projectName"
                    :label="$t('note.projectName')"
                    :width="350"
                ></el-table-column>
                <el-table-column
                    prop="createUsername"
                    :label="$t('note.createUsername')"
                ></el-table-column>
                <el-table-column prop="createTime" :label="$t('note.createTime')"></el-table-column>
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
                                        <li @click="showEditDialog(row)">{{ $t('form.edit') }}</li>
                                        <li @click="showDeleteDialog(row)">
                                            {{ $t('form.delete') }}
                                        </li>
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
            :row-data="selectedRowData"
            @submit-success="listProjects"
        />
        <AddDialog mode="add" v-model="addDialogVisible" @submit-success="listProjects" />
        <AddDialog
            mode="edit"
            v-model="editDialogVisible"
            :data="selectedRowData"
            @submit-success="listProjects"
        />
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
