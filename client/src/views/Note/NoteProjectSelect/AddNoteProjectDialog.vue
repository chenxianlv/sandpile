<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules, InputInstance } from 'element-plus';
import { QuestionFilled } from '@element-plus/icons-vue';
import { addProjectAPI, updateProjectAPI } from '@/api/note';
import noteConfig from '@/config/note';
import FormDialog from '@/components/FormDialog/FormDialog.vue';
import UserSelect from '@/components/UserSelect/UserSelect.vue';
import type { UserSummary } from '@/components/UserSelect/UserSelect.vue';
import type { NoteProject } from '@/views/Note/NoteProjectDetail/hooks';
import { useUserStore } from '@/stores/userStore';

const props = defineProps<{
    mode: 'add' | 'edit';
    data?: NoteProject;
}>();

const formRef = ref<FormInstance>();
const autoFocusRef = ref<InputInstance>();
const ownerSelectRef = ref<InstanceType<typeof UserSelect> | null>(null);

const formData = reactive<{
    projectName: string;
    owners: number[];
    openness: number;
    readers: number[];
}>({
    projectName: '',
    owners: [],
    openness: 1,
    readers: [],
});
const rules = reactive<FormRules>({
    projectName: [
        { required: true, message: '请输入项目名称', trigger: 'blur' },
        { max: 255, message: '请输入小于255字符的项目名称', trigger: 'change' },
    ],
    owners: [
        {
            required: true,
            type: 'array',
            min: 1,
            message: '请选择至少一个所有者',
            trigger: 'change',
        },
    ],
    readers: [],
    openness: [{ required: true, message: '请选择开放程度', trigger: 'blur' }],
});

const userStore = useUserStore();
const defaultOwnerOptions = ref<Array<UserSummary>>([]);
const defaultReaderOptions = ref<Array<UserSummary>>([]);

const requestFn = () =>
    props.mode === 'add'
        ? addProjectAPI(formData)
        : updateProjectAPI({ id: props.data!.id, ...formData });
const onOpen = () => {
    if (props.mode === 'add') {
        // 新增项目时，自动选择所有者为当前用户
        if (userStore.id !== undefined && userStore.username !== undefined) {
            defaultOwnerOptions.value = [{ id: userStore.id, username: userStore.username }];
            formData.owners = [userStore.id];
        }
    } else {
        props.data?.projectName !== undefined && (formData.projectName = props.data.projectName);
        props.data?.openness !== undefined && (formData.openness = props.data.openness);
        if (props.data?.owners !== undefined) {
            defaultOwnerOptions.value = props.data.owners;
            formData.owners = props.data.owners.map((item) => item.id);
        }
        if (props.data?.readers !== undefined) {
            defaultReaderOptions.value = props.data.readers;
            formData.readers = props.data.readers.map((item) => item.id);
        }
    }
};
const helpText = `完全开放：所有用户包括匿名用户均可查看
部分开放：仅读者及所有者可以查看
私有：仅所有者可以查看`;
</script>

<template>
    <FormDialog
        width="520px"
        :title="mode === 'add' ? '新建笔记项目' : '编辑笔记项目'"
        :formRef="formRef"
        :autoFocusRef="autoFocusRef"
        :requestFn="requestFn"
        @open="onOpen"
    >
        <template #default="{ submit }">
            <el-form
                @submit.prevent
                ref="formRef"
                label-width="100px"
                label-position="left"
                :rules="rules"
                :model="formData"
            >
                <el-form-item prop="projectName" label="项目名称">
                    <el-input
                        ref="autoFocusRef"
                        v-model="formData.projectName"
                        @keydown.enter="submit"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="owners" label="所有者">
                    <UserSelect
                        v-model="formData.owners"
                        :default-options="defaultOwnerOptions"
                        ref="ownerSelectRef"
                    ></UserSelect>
                </el-form-item>
                <el-form-item prop="openness" label="开放程度">
                    <el-radio-group v-model="formData.openness">
                        <el-radio-button
                            v-for="(num, type) in noteConfig.NOTE_PROJECT_OPENNESS_ENUM"
                            :label="num"
                            :key="num"
                        >
                            {{ type }}
                        </el-radio-button>
                    </el-radio-group>
                    <el-popover placement="top-end" :content="helpText" width="300px">
                        <template #reference>
                            <el-icon class="icon_button">
                                <QuestionFilled />
                            </el-icon>
                        </template>
                    </el-popover>
                </el-form-item>
                <el-form-item
                    prop="readers"
                    label="读者"
                    v-if="formData.openness === noteConfig.NOTE_PROJECT_OPENNESS_ENUM.HALF_PUBLIC"
                >
                    <UserSelect
                        v-model="formData.readers"
                        :default-options="defaultReaderOptions"
                    ></UserSelect>
                </el-form-item>
            </el-form>
        </template>
    </FormDialog>
</template>

<style lang="less" scoped></style>
