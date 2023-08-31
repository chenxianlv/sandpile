<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules, InputInstance } from 'element-plus';
import { QuestionFilled } from '@element-plus/icons-vue';
import { addProjectAPI, updateProjectAPI } from '@/api/note';
import type { UserSummary } from '@/api/user';
import type { NoteProject } from '@/api/note';
import { NoteProjectOpennessEnum } from '@/config/enum/note';
import { useUserStore } from '@/stores/userStore';
import FormDialog from '@/components/FormDialog/FormDialog.vue';
import UserSelect from '@/components/UserSelect/UserSelect.vue';
import { i18n } from '@/lang';

const $t = i18n.global.t;
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
        {
            required: true,
            message: $t('form.requireInput', { prop: $t('note.projectName') }),
            trigger: 'blur',
        },
        { max: 255, message: $t('form.charLengthOverflow', { max: 255 }), trigger: 'change' },
    ],
    owners: [
        {
            required: true,
            type: 'array',
            min: 1,
            message: $t('note.selectAtLeastOneOwner'),
            trigger: 'change',
        },
    ],
    readers: [],
    openness: [
        {
            required: true,
            message: $t('form.requireSelect', { prop: $t('note.openness') }),
            trigger: 'blur',
        },
    ],
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
</script>

<template>
    <FormDialog
        width="520px"
        :title="$t(mode === 'add' ? 'note.addProject' : 'note.editProject')"
        :formRef="formRef"
        :autoFocusRef="autoFocusRef"
        :requestFn="requestFn"
        @open="onOpen"
    >
        <template #default="{ submit }">
            <el-form
                @submit.prevent
                ref="formRef"
                label-width="120px"
                label-position="left"
                :rules="rules"
                :model="formData"
            >
                <el-form-item prop="projectName" :label="$t('note.projectName')">
                    <el-input
                        ref="autoFocusRef"
                        v-model="formData.projectName"
                        @keydown.enter="submit"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="owners" :label="$t('note.owners')">
                    <UserSelect
                        v-model="formData.owners"
                        :default-options="defaultOwnerOptions"
                        ref="ownerSelectRef"
                    ></UserSelect>
                </el-form-item>
                <el-form-item prop="openness" :label="$t('note.openness')">
                    <el-radio-group v-model="formData.openness">
                        <el-radio-button
                            v-for="(num, type) in NoteProjectOpennessEnum"
                            :label="num"
                            :key="num"
                        >
                            {{ $t(`note.${type}`) }}
                        </el-radio-button>
                    </el-radio-group>
                    <el-popover placement="top-end" width="300px">
                        <template #reference>
                            <el-icon class="icon_button">
                                <QuestionFilled />
                            </el-icon>
                        </template>
                        <template #default>
                            <span style="white-space: pre-wrap">
                                {{ $t('note.opennessHelpText') }}
                            </span>
                        </template>
                    </el-popover>
                </el-form-item>
                <el-form-item
                    prop="readers"
                    :label="$t('note.readers')"
                    v-if="formData.openness === NoteProjectOpennessEnum.HALF_PUBLIC"
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
