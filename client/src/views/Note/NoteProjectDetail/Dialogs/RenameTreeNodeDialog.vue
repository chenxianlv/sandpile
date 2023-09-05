<script setup lang="ts">
// todo 重命名时，重复文件名检查
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules, InputInstance } from 'element-plus';
import { updateNoteFileAPI, updateNoteFolderAPI } from '@/api/note';
import { i18n } from '@/lang';
import FormDialog from '@/components/FormDialog/FormDialog.vue';
import type { TreeNode } from '@/views/Note/NoteProjectDetail/FileTree/FileTree.vue';

const $t = i18n.global.t;
const props = defineProps<{
    targetNode?: TreeNode;
}>();

const formRef = ref<FormInstance>();
const autoFocusRef = ref<InputInstance>();

const formData = reactive<{
    name: string;
}>({
    name: '',
});

const handleOpen = () => {
    formData.name = props.targetNode?.name ?? '';
};

const rules = reactive<FormRules>({
    name: [
        {
            required: true,
            message: $t('form.requireInput', {
                prop: $t(props.targetNode?.isFile ? 'note.fileName' : 'note.folderName'),
            }),
            trigger: 'blur',
        },
    ],
});

const requestFn = () => {
    return props.targetNode?.isFile
        ? updateNoteFileAPI({ id: props.targetNode?.id, name: formData.name })
        : updateNoteFolderAPI({
              id: props.targetNode?.id,
              name: formData.name,
          });
};
</script>

<template>
    <FormDialog
        :title="$t('form.rename')"
        :formRef="formRef"
        :autoFocusRef="autoFocusRef"
        :requestFn="requestFn"
        @open="handleOpen"
    >
        <template #default="{ submit }">
            <el-form @submit.prevent ref="formRef" :rules="rules" :model="formData">
                <el-form-item
                    prop="name"
                    :label="$t(props.targetNode?.isFile ? 'note.fileName' : 'note.folderName')"
                >
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
