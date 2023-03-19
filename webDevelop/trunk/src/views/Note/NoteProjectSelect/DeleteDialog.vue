<script setup lang="ts">
import { reactive, ref } from 'vue';
import { NoteProject } from '@/views/Note/hooks';
import { FormInstance, FormRules } from 'element-plus';
import { deleteProjectAPI } from '@/api/note';

const props = defineProps<{
    visible: boolean;
    rowData: NoteProject;
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

const deleteProject = () => {
    formRef.value?.validate(async (isValid) => {
        if (!isValid) return;
        await deleteProjectAPI({ id: props.rowData.id });
        emit('submitSuccess');
        emit('update:visible', false);
    });
};

const resetDialog = () => {
    formRef.value?.resetFields();
    deleteConfirmFormData.text = '';
};
</script>

<template>
    <el-dialog
        width="500px"
        title="确定删除吗？"
        :modelValue="props.visible"
        @update:modelValue="(e) => emit('update:visible', e)"
        @closed="resetDialog"
        align-center
        append-to-body
    >
        <template #default>
            <span>{{
                `若确定删除，请输入项目名称“${props.rowData.projectName}”。`
            }}</span>
            <br />
            <br />
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
            <el-button @click="emit('update:visible', false)">取消</el-button>
            <el-button type="danger" @click="deleteProject">删除</el-button>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped></style>
