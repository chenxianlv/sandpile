<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormRules, FormInstance, InputInstance } from 'element-plus';
import { i18n } from '@/lang';
import { loginAPI } from '@/api/user';
import { useLoginStore } from '@/views/Base/LoginDialog/store';
import { useUserStore } from '@/stores/userStore';

const $t = i18n.global.t;
const loginStore = useLoginStore();
const userStore = useUserStore();

const props = defineProps<{
    submit: () => void;
}>();

const errorInfo = ref('');
const formRef = ref<FormInstance>();
const autoFocusRef = ref<InputInstance>();

const formData = reactive<{
    username: string;
    password: string;
}>({
    username: '',
    password: '',
});
const rules = reactive<FormRules>({
    username: [
        {
            required: true,
            message: $t('form.requireInput', { prop: $t('user.username') }),
            trigger: 'blur',
        },
        { max: 50, message: $t('form.requireInput', { max: 50 }), trigger: 'change' },
    ],
    password: [
        {
            required: true,
            message: $t('form.requireInput', { prop: $t('user.password') }),
            trigger: 'blur',
        },
    ],
});

const requestFn = async () => {
    try {
        const res = await loginAPI(formData);
        const data = res.data?.data ?? {};
        console.log(data);
        userStore.login({
            nickname: data.nickname,
            id: data.id,
            token: data.token,
            authList: data.authList,
        });
        loginStore.close();
        history.go(0);
    } catch (reason: any) {
        const errorCode = reason?.response?.data?.errorCode || reason?.data?.errorCode;
        errorInfo.value =
            errorCode !== undefined ? $t('errorCode.' + errorCode) : $t('user.loginFailed');
        throw reason;
    }
};

defineExpose({
    requestFn,
    formRef,
    autoFocusRef,
});
</script>

<template>
    <el-alert
        class="alert"
        v-if="errorInfo"
        :title="errorInfo"
        type="error"
        @close="errorInfo = ''"
    />
    <el-form
        ref="formRef"
        :rules="rules"
        :model="formData"
        label-width="100px"
        label-position="left"
    >
        <el-form-item prop="username" :label="$t('user.username')">
            <el-input ref="autoFocusRef" v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" :label="$t('user.password')">
            <el-input
                type="password"
                show-password
                v-model="formData.password"
                @keydown.enter="props.submit"
            ></el-input>
        </el-form-item>
    </el-form>
</template>

<style scoped lang="less">
.alert {
    margin-bottom: 15px;
}
</style>
