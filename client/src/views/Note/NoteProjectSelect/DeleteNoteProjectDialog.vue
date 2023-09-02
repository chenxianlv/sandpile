<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules, InputInstance } from 'element-plus';
import { deleteProjectAPI } from '@/api/note';
import FormDialog from '@/components/FormDialog/FormDialog.vue';
import { i18n } from '@/lang';
import type { NoteProject } from '@/views/Note/NoteProjectDetail/hooks';

const $t = i18n.global.t;
const props = defineProps<{
    rowData?: NoteProject;
}>();

const formRef = ref<FormInstance>();
const autoFocusRef = ref<InputInstance>();

const formData = reactive<{ text: string }>({ text: '' });
const validateConfirmText = (rule: any, value: any, callback: any) => {
    if ((value ?? '') !== props.rowData?.projectName) {
        callback(new Error($t('note.projectNameError')));
    } else {
        callback();
    }
};
const rules = reactive<FormRules>({
    text: [{ validator: validateConfirmText, trigger: 'blur' }],
});

const requestFn = async () => {
    if (props.rowData?.id !== undefined) {
        return await deleteProjectAPI({ id: props.rowData.id });
    }
};
</script>

<template>
    <FormDialog
        :title="$t('note.confirmToDelete')"
        :formRef="formRef"
        :autoFocusRef="autoFocusRef"
        :requestFn="requestFn"
    >
        <template #default="{ submit }">
            <span>{{
                $t('note.deleteProjectConfirm', { projectName: props.rowData?.projectName ?? '' })
            }}</span>
            <br />
            <br />
            <el-form @submit.prevent ref="formRef" :rules="rules" :model="formData">
                <el-form-item prop="text">
                    <el-input
                        ref="autoFocusRef"
                        v-model="formData.text"
                        @keydown.enter="submit"
                    ></el-input>
                </el-form-item>
            </el-form>
        </template>
    </FormDialog>
</template>

<style lang="less" scoped></style>
