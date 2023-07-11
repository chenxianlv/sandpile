<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { addProjectAPI } from '@/api/note';
import { useLoading } from '@/utils/hooks';

const props = defineProps<{
    visible: boolean;
}>();
const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'submitSuccess'): void;
}>();

const formRef = ref<FormInstance>();
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
const { loading: submitBtnLoading, startLoading, stopLoading } = useLoading();

const submitAdd = () => {
    formRef.value?.validate((isValid) => {
        if (!isValid) return;
        startLoading();
        addProjectAPI(formData)
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

const resetDialog = () => {
    formRef.value?.resetFields();
};
</script>

<template>
    <el-dialog
        width="500px"
        title="新建笔记项目"
        :modelValue="props.visible"
        @update:modelValue="(e:boolean) => emit('update:visible', e)"
        @open="resetDialog"
        align-center
        draggable
        append-to-body
    >
        <template #default>
            <el-form
                @submit.prevent
                ref="formRef"
                :rules="rules"
                :model="formData"
            >
                <el-form-item prop="projectName" label="项目名称">
                    <el-input
                        v-model="formData.projectName"
                        @keydown.enter="submitAdd"
                    ></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <el-button @click="emit('update:visible', false)">取消</el-button>
            <el-button
                type="primary"
                @click="submitAdd"
                :loading="submitBtnLoading"
                >新建</el-button
            >
        </template>
    </el-dialog>
</template>

<style lang="less" scoped></style>
