<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules, InputInstance } from 'element-plus';
import { addNoteFolderAPI } from '@/api/note';
import FormDialog from '@/components/FormDialog/FormDialog.vue';

const props = defineProps<{
    folderId: number;
    projectId: number;
}>();

const formRef = ref<FormInstance>();
const autoFocusRef = ref<InputInstance>();

const formData = reactive<{
    name: string;
}>({
    name: '',
});
const rules = reactive<FormRules>({
    name: [{ required: true, message: '请输入文件夹名称', trigger: 'blur' }],
});

const requestFn = () =>
    addNoteFolderAPI({ ...formData, folderId: props.folderId, projectId: props.projectId });
</script>

<template>
    <FormDialog
        title="新建文件夹"
        :formRef="formRef"
        :autoFocusRef="autoFocusRef"
        :requestFn="requestFn"
    >
        <template #default="{ submit }">
            <el-form @submit.prevent ref="formRef" :rules="rules" :model="formData">
                <el-form-item prop="name" label="文件夹名">
                    <el-input
                        ref="autoFocusRef"
                        v-model="formData.name"
                        @keydown.enter="submit"
                    ></el-input>
                </el-form-item>
            </el-form>
        </template>
    </FormDialog>
</template>

<style lang="less" scoped></style>
