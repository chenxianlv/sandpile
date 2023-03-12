<script setup lang="ts">
// todo 选择完重命名或删除按钮后，自动关闭popover
// todo 删除dialog样式调整
import { listProjectsAPI } from '@/api/note';
import { computed, nextTick, reactive, ref } from 'vue';
import dayjs from 'dayjs';
import type { NoteProject } from '@/views/Note/hooks';
import type { NormalResponse } from '@/common/axios';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
import type { FormRules, FormInstance } from 'element-plus';

const noteProjects = ref<NoteProject[]>([]);

listProjectsAPI().then((res: NormalResponse) => {
    if (res?.data?.data?.noteProjects) {
        noteProjects.value = res?.data?.data?.noteProjects;
    }
});

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
        if (project.createUserName.includes(filterString.value)) return true;
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
const submitEdit = () => {
    console.log({ id: editId.value, projectName: editText.value });
    editId.value = undefined;
    editText.value = '';
};

const deleteDialogVisible = ref<boolean>(false);
const deleteRowData = ref<NoteProject>();
const deleteConfirmFormData = reactive<{ text: string }>({
    text: '',
});
const validateConfirmText = (rule: any, value: any, callback: any) => {
    if (deleteRowData.value === undefined) {
        callback(new Error('未知错误，请刷新页面'));
    } else if ((value ?? '') !== deleteRowData.value?.projectName) {
        callback(new Error('请输入正确的项目名'));
    } else {
        callback();
    }
};
const rules = reactive<FormRules>({
    text: [{ validator: validateConfirmText, trigger: 'blur' }],
});
const formRef = ref<FormInstance>();
const showDeleteDialog = (row: NoteProject) => {
    deleteRowData.value = row;
    deleteDialogVisible.value = true;
};
const deleteProject = () => {
    formRef.value?.validate((isValid) => {
        if (!isValid || deleteRowData.value === undefined) return;
        const { id } = deleteRowData.value;
        console.log({ id });
    });
};
</script>

<template>
    <div class="container">
        <el-input
            class="search-input"
            placeholder="搜索项目"
            :prefix-icon="Search"
            v-model="filterString"
        />
        <el-table
            :data="noteProjectsAfterFilter"
            :row-style="{ height: '50px' }"
            @cell-click="handleCellClick"
        >
            <el-table-column prop="projectName" label="笔记项目名" :width="350">
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
            <el-table-column width="40px" column-key="no-jump">
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
    <el-dialog v-model="deleteDialogVisible" title="确定删除吗？">
        <template #default>
            <span>{{
                `若确定删除，请输入项目名称“${deleteRowData.projectName}”。`
            }}</span>
            <el-form
                ref="formRef"
                :rules="rules"
                :model="deleteConfirmFormData"
            >
                <el-form-item prop="text">
                    <el-input v-model="deleteConfirmFormData.text"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <el-button @click="() => (deleteDialogVisible = false)"
                >取消
            </el-button>
            <el-button type="danger" @click="deleteProject">删除</el-button>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped>
.container {
    box-sizing: border-box;
    width: 100%;
    max-width: 1000px;
    height: 100%;
    margin: 0 auto;
    padding: 0 20px;

    background-color: @bg-color-middle-layer;
    box-shadow: @box-shadow-normal-large;
}

.search-input {
    float: right;
    width: 430px;
    height: 32px;
    margin: 10px 0;
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
