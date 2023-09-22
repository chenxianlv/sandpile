<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules, InputInstance } from 'element-plus';
import { QuestionFilled } from '@element-plus/icons-vue';
import { addProjectAPI, updateProjectAPI } from '@/api/note';
import { NoteProjectOpennessEnum } from '@/config/enum/note';
import { useUserStore } from '@/stores/userStore';
import FormDialog from '@/components/FormDialog/FormDialog.vue';
import UserSelect from '@/components/UserSelect/UserSelect.vue';
import { i18n } from '@/lang';
import type { NoteProjectRow } from '@/views/Note/NoteProjectSelect/store';
import { selectFolder, parseFolder, uploadFolder } from '../../utils';

const $t = i18n.global.t;
const props = defineProps<{
    mode: 'add' | 'edit';
    rowData?: NoteProjectRow;
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
type UserSummary = ApiRes.User.UserSummary;
const defaultOwnerOptions = ref<Array<UserSummary>>([]);
const defaultReaderOptions = ref<Array<UserSummary>>([]);

const requestFn = () =>
    props.mode === 'add' ? addProject() : updateProjectAPI({ id: props.rowData!.id, ...formData });
const onOpen = () => {
    initFiles.value = undefined;
    projectNameAutoFillLock.value = false;
    if (props.mode === 'add') {
        // 新增项目时，自动选择所有者为当前用户
        if (userStore.id !== undefined && userStore.nickname !== undefined) {
            defaultOwnerOptions.value = [{ id: userStore.id, nickname: userStore.nickname }];
            formData.owners = [userStore.id];
        }
    } else {
        props.rowData?.projectName !== undefined &&
            (formData.projectName = props.rowData.projectName);
        props.rowData?.openness !== undefined && (formData.openness = props.rowData.openness);
        if (props.rowData?.owners !== undefined) {
            defaultOwnerOptions.value = props.rowData.owners;
            formData.owners = props.rowData.owners.map((item) => item.id);
        }
        if (props.rowData?.readers !== undefined) {
            defaultReaderOptions.value = props.rowData.readers;
            formData.readers = props.rowData.readers.map((item) => item.id);
        }
    }
};

const projectNameAutoFillLock = ref(false);
const onProjectNameInput = () => {
    projectNameAutoFillLock.value = true;
};

const initFiles = ref<Array<File> | undefined>();
const selectInitFolder = async () => {
    initFiles.value = await selectFolder();

    // 若还没填写项目名，自动按照所选文件夹解析
    if (!initFiles.value) return;
    const { name } = parseFolder(initFiles.value);
    if (!projectNameAutoFillLock.value) formData.projectName = name;
};
const addProject = async () => {
    const projectId = (await addProjectAPI(formData)).data.data.id;
    if (!initFiles.value) return;
    await uploadFolder(initFiles.value, projectId, -1, true);
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
                :label-width="$t('note.addProjectLabelWidth')"
                label-position="left"
                :rules="rules"
                :model="formData"
            >
                <el-form-item prop="projectName" :label="$t('note.projectName')">
                    <el-input
                        ref="autoFocusRef"
                        v-model="formData.projectName"
                        @input="onProjectNameInput"
                        @keydown.enter="submit"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="owners">
                    <template #label>
                        {{ $t('note.owners') }}
                        <el-popover placement="top-start" width="300px">
                            <template #reference>
                                <el-icon class="icon_button">
                                    <QuestionFilled />
                                </el-icon>
                            </template>
                            <template #default>
                                <span style="white-space: pre-wrap">
                                    {{ $t('note.ownersHelpText') }}
                                </span>
                            </template>
                        </el-popover>
                    </template>
                    <UserSelect
                        v-model="formData.owners"
                        :default-options="defaultOwnerOptions"
                        ref="ownerSelectRef"
                    ></UserSelect>
                </el-form-item>
                <el-form-item prop="openness">
                    <template #label>
                        {{ $t('note.openness') }}
                        <el-popover placement="top-start" width="300px">
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
                    </template>
                    <el-radio-group v-model="formData.openness">
                        <el-radio-button
                            v-for="(num, type) in NoteProjectOpennessEnum"
                            :label="num"
                            :key="num"
                        >
                            {{ $t(`note.${type}`) }}
                        </el-radio-button>
                    </el-radio-group>
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
                <el-form-item prop="initialFolder" v-if="props.mode === 'add'">
                    <template #label>
                        {{ $t('note.initialFolder') }}
                        <el-popover placement="top-start" width="300px">
                            <template #reference>
                                <el-icon class="icon_button">
                                    <QuestionFilled />
                                </el-icon>
                            </template>
                            <template #default>
                                <span style="white-space: pre-wrap">
                                    {{ $t('note.initialFolderHelpText') }}
                                </span>
                            </template>
                        </el-popover>
                    </template>
                    <el-button @click="selectInitFolder">{{ $t('note.selectFolder') }}</el-button>
                    <span v-if="Object.values(initFiles ?? {}).length" style="margin-left: 10px">{{
                        $t('note.selectedFiles', { num: Object.values(initFiles ?? {}).length })
                    }}</span>
                </el-form-item>
            </el-form>
        </template>
    </FormDialog>
</template>

<style lang="less" scoped>
:deep(.el-form-item__label) {
    align-items: center;
}
</style>
