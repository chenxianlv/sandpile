<script setup lang="ts">
import { reactive, ref } from 'vue';
import { FormInstance, FormRules } from 'element-plus';
import { useLoading } from '@/utils/hooks';
import { addNoteFileAPI } from '@/api/note';

const props = defineProps<{
    visible: boolean;
}>();
const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'submitSuccess'): void;
}>();

const formRef = ref<FormInstance>();
const formData = reactive<{
    fileName: string;
}>({
    fileName: '',
});
const rules = reactive<FormRules>({
    fileName: [{ required: true, message: '请输入文件名称', trigger: 'blur' }],
});
const { loading: submitBtnLoading, startLoading, stopLoading } = useLoading();

const resetDialog = () => {
    console.log(1);
    formRef.value?.resetFields();
};

const submit = () => {
    formRef.value?.validate((isValid) => {
        if (!isValid) return;
        startLoading();
        addNoteFileAPI(formData)
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
        title="新建文件"
        :modelValue="props.visible"
        @update:modelValue="(e:boolean) => emit('update:visible', e)"
        @open="resetDialog"
        align-center
        draggable
        append-to-body
    >
        <template #default>
            <el-form @submit.prevent ref="formRef" :rules="rules" :model="formData">
                <el-form-item prop="fileName" label="文件名">
                    <el-input v-model="formData.fileName" @keydown.enter="submit"></el-input>
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
