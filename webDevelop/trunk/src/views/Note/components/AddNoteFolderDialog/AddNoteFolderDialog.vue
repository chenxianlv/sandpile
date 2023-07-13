<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import type { FormInstance, FormRules, InputInstance } from 'element-plus';
import { useLoading } from '@/utils/hooks';
import { addNoteFolderAPI } from '@/api/note';

const props = defineProps<{
    visible: boolean;
    folderId: number;
    projectId: number;
}>();
const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'submitSuccess'): void;
}>();

const formRef = ref<FormInstance>();
const defaultInputRef = ref<InputInstance>();
const formData = reactive<{
    name: string;
}>({
    name: '',
});
const rules = reactive<FormRules>({
    name: [{ required: true, message: '请输入文件夹名称', trigger: 'blur' }],
});
const { loading: submitBtnLoading, startLoading, stopLoading } = useLoading();

const resetDialog = () => {
    nextTick(() => {
        formRef.value?.resetFields();
        defaultInputRef.value?.focus();
    });
};

const submit = () => {
    formRef.value?.validate((isValid) => {
        if (!isValid) return;
        startLoading();
        addNoteFolderAPI({ ...formData, folderId: props.folderId, projectId: props.projectId })
            .then(() => {
                emit('submitSuccess');
                emit('update:visible', false);
            })
            .catch(() => {})
            .finally(() => {
                stopLoading();
            });
    });
};
</script>

<template>
    <el-dialog
        width="500px"
        title="新建文件夹"
        :modelValue="props.visible"
        @update:modelValue="(e:boolean) => emit('update:visible', e)"
        @open="resetDialog"
        align-center
        draggable
        append-to-body
    >
        <template #default>
            <el-form @submit.prevent ref="formRef" :rules="rules" :model="formData">
                <el-form-item prop="name" label="文件夹名">
                    <el-input
                        ref="defaultInputRef"
                        v-model="formData.name"
                        @keydown.enter="submit"
                    ></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <el-button @click="emit('update:visible', false)">取消</el-button>
            <el-button type="primary" @click="submit" :loading="submitBtnLoading">新建</el-button>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped></style>
