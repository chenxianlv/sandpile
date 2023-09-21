<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules, InputInstance } from 'element-plus';
import { addNoteFileAPI } from '@/api/note';
import { i18n } from '@/lang';
import FormDialog from '@/components/FormDialog/FormDialog.vue';

const $t = i18n.global.t;
const props = defineProps<{
    folderId: number;
    projectId?: number;
}>();

const formRef = ref<FormInstance>();
const autoFocusRef = ref<InputInstance>();

const formData = reactive<{
    name: string;
}>({
    name: '',
});
const rules = reactive<FormRules>({
    name: [
        {
            required: true,
            message: $t('form.requireInput', { prop: $t('note.fileName') }),
            trigger: 'blur',
        },
    ],
});

const requestFn = () =>
    props.projectId !== undefined &&
    addNoteFileAPI({ ...formData, folderId: props.folderId, projectId: props.projectId });
</script>

<template>
    <FormDialog
        :title="$t('note.addFile')"
        :formRef="formRef"
        :autoFocusRef="autoFocusRef"
        :requestFn="requestFn"
    >
        <template #default="{ submit }">
            <el-form @submit.prevent ref="formRef" :rules="rules" :model="formData">
                <el-form-item prop="name" :label="$t('note.fileName')">
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
