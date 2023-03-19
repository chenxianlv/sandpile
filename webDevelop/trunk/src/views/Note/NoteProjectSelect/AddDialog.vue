<script setup lang="ts">
import { reactive, ref } from 'vue';
import { FormInstance, FormRules } from 'element-plus';
import { addProjectAPI } from '@/api/note';

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

const submitAdd = async () => {
    formRef.value?.validate(async (isValid) => {
        if (!isValid) return;
        await addProjectAPI(formData);
        emit('submitSuccess');
        emit('update:visible', false);
    });
};

const resetDialog = () => {
    formRef.value?.resetFields();
    formData.projectName = '';
};
</script>

<template>
    <el-dialog
        width="500px"
        title="新建笔记项目"
        :modelValue="props.visible"
        @update:modelValue="(e) => emit('update:visible', e)"
        @closed="resetDialog"
        align-center
        append-to-body
    >
        <template #default>
            <el-form ref="formRef" :rules="rules" :model="formData">
                <el-form-item prop="projectName" label="项目名称">
                    <el-input v-model="formData.projectName"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <el-button @click="emit('update:visible', false)">取消</el-button>
            <el-button type="primary" @click="submitAdd">新建</el-button>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped></style>
