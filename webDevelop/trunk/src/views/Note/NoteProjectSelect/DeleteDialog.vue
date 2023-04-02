<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { NoteProject } from '@/views/Note/hooks';
import { FormInstance, FormRules } from 'element-plus';
import { deleteProjectAPI } from '@/api/note';
import { useLoading } from '@/utils/hooks';

const props = defineProps<{
    visible: boolean;
    rowData?: NoteProject;
}>();
const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'submitSuccess'): void;
}>();

const deleteConfirmFormData = reactive<{ text: string }>({ text: '' });
const validateConfirmText = (rule: any, value: any, callback: any) => {
    if ((value ?? '') !== props.rowData?.projectName) {
        callback(new Error('请输入正确的项目名'));
    } else {
        callback();
    }
};
const rules = reactive<FormRules>({
    text: [{ validator: validateConfirmText, trigger: 'blur' }],
});
const formRef = ref<FormInstance>();
const { loading: submitBtnLoading, startLoading, stopLoading } = useLoading();

const deleteProject = () => {
    formRef.value?.validate((isValid) => {
        if (!isValid || !props.rowData) return;

        startLoading();
        deleteProjectAPI({ id: props.rowData.id })
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
        title="确定删除吗？"
        :modelValue="props.visible"
        @update:modelValue="(e:boolean) => emit('update:visible', e)"
        @open="resetDialog"
        align-center
        draggable
        append-to-body
    >
        <template #default>
            <span>{{
                `若确定删除，请输入项目名称“${
                    props.rowData?.projectName ?? ''
                }”。`
            }}</span>
            <br />
            <br />
            <el-form
                @submit.prevent
                ref="formRef"
                :rules="rules"
                :model="deleteConfirmFormData"
            >
                <el-form-item prop="text">
                    <el-input
                        v-model="deleteConfirmFormData.text"
                        @keydown.enter="deleteProject"
                    ></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <el-button @click="emit('update:visible', false)">取消</el-button>
            <el-button
                type="danger"
                @click="deleteProject"
                :loading="submitBtnLoading"
                >删除</el-button
            >
        </template>
    </el-dialog>
</template>

<style lang="less" scoped></style>
