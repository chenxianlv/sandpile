<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { loginAPI } from '@/api/base';
import type { NormalResponse } from '@/common/axios';
import { useUserStore } from '@/stores/userStore';
import { useLoginStore } from '@/views/Base/LoginDialog/store';
import { useLoading } from '@/utils/hooks';
import { encryptPwd } from '@/utils/crypto';

const loginStore = useLoginStore();
const formRef = ref<FormInstance>();
const formData = reactive<{
    account: string;
    password: string;
}>({
    account: '',
    password: '',
});
const rules = reactive<FormRules>({
    account: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { max: 50, message: '请输入50个以内的字符', trigger: 'change' },
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});

const errorInfo = ref('');
const userStore = useUserStore();
const { loading: loginBtnLoading, startLoading, stopLoading } = useLoading();
const login = () => {
    formRef.value?.validate((isValid) => {
        if (!isValid) return;
        startLoading();

        const submitForm = new FormData();
        submitForm.append('account', formData.account);
        submitForm.append('password', encryptPwd(formData.password, formData.account));

        loginAPI(submitForm)
            .then((res: NormalResponse) => {
                const data = res.data?.data ?? {};
                userStore.login({
                    username: data.userName,
                    id: data.id,
                    token: data.token,
                });
                loginStore.close();
            })
            .catch((reason) => {
                errorInfo.value = reason?.response?.data?.errorInfo ?? '登录失败';
            })
            .finally(() => {
                stopLoading();
            });
    });
};

const resetDialog = () => {
    formRef.value?.clearValidate();
};
</script>

<template>
    <el-dialog
        width="500px"
        title="用户登录"
        :modelValue="loginStore.loginDialogVisible"
        @update:modelValue="(e:boolean) => loginStore.loginDialogVisible = e"
        @open="resetDialog"
        align-center
        draggable
        append-to-body
    >
        <template #default>
            <el-alert
                class="alert"
                v-if="errorInfo"
                :title="errorInfo"
                type="error"
                @close="errorInfo = ''"
            />
            <el-form ref="formRef" :rules="rules" :model="formData">
                <el-form-item prop="account" label="账号">
                    <el-input v-model="formData.account"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input
                        show-password
                        v-model="formData.password"
                        @keydown.enter="login"
                    ></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <el-button @click="loginStore.close()">取消</el-button>
            <el-button type="primary" @click="login" :loading="loginBtnLoading">登录</el-button>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped>
.alert {
    margin-bottom: 15px;
}
</style>
