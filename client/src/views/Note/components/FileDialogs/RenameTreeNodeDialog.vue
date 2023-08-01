<script setup lang="ts">
// todo 重命名时，重复文件名检查
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules, InputInstance } from 'element-plus';
import { updateNoteFileAPI, updateNoteFolderAPI } from '@/api/note';
import FormDialog from '@/components/FormDialog/FormDialog.vue';
import type { TreeNode } from '@/views/Note/components/FileTree/FileTree.vue';

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
            message: props.targetNode?.isFile ? '请输入文件名' : '请输入文件夹名',
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
        title="重命名"
        :formRef="formRef"
        :autoFocusRef="autoFocusRef"
        :requestFn="requestFn"
        @open="handleOpen"
    >
        <template #default="{ submit }">
            <el-form @submit.prevent ref="formRef" :rules="rules" :model="formData">
                <el-form-item prop="name" :label="props.targetNode?.isFile ? '文件名' : '文件夹名'">
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
