<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules, InputInstance } from 'element-plus';
import { addProjectAPI } from '@/api/note';
import FormDialog from '@/components/FormDialog/FormDialog.vue';

const formRef = ref<FormInstance>();
const autoFocusRef = ref<InputInstance>();

const formData = reactive<{
    projectName: string;
}>({
    projectName: '',
});
const rules = reactive<FormRules>({
    projectName: [
        { required: true, message: '请输入项目名称', trigger: 'blur' },
        { max: 255, message: '请输入小于255字符的项目名称', trigger: 'change' },
    ],
});

const requestFn = () => addProjectAPI(formData);
</script>

<template>
    <FormDialog
        title="新建笔记项目"
        :formRef="formRef"
        :autoFocusRef="autoFocusRef"
        :requestFn="requestFn"
    >
        <template #default="{ submit }">
            <el-form @submit.prevent ref="formRef" :rules="rules" :model="formData">
                <el-form-item prop="projectName" label="项目名称">
                    <el-input
                        ref="autoFocusRef"
                        v-model="formData.projectName"
                        @keydown.enter="submit"
                    ></el-input>
                </el-form-item>
            </el-form>
        </template>
    </FormDialog>
</template>

<style lang="less" scoped></style>
