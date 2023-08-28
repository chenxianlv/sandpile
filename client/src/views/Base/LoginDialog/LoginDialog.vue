<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules, InputInstance } from 'element-plus';
import { loginAPI } from '@/api/base';
import { useUserStore } from '@/stores/userStore';
import { useLoginStore } from '@/views/Base/LoginDialog/store';
import { encryptPwd } from '@/utils/crypto';
import FormDialog from '@/components/FormDialog/FormDialog.vue';

const loginStore = useLoginStore();
const userStore = useUserStore();

const errorInfo = ref('');
const formRef = ref<FormInstance>();
const autoFocusRef = ref<InputInstance>();

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

const requestFn = async () => {
    const submitForm = new FormData();
    submitForm.append('account', formData.account);
    submitForm.append('password', encryptPwd(formData.password, formData.account));

    try {
        const res = await loginAPI(submitForm);
        const data = res.data?.data ?? {};
        userStore.login({
            username: data.username,
            id: data.id,
            token: data.token,
            authList: data.authList,
        });
        loginStore.close();
        history.go(0);
    } catch (reason: any) {
        errorInfo.value = reason?.response?.data?.errorInfo ?? '登录失败';
        throw reason;
    }
};
</script>

<template>
    <FormDialog
        v-model="loginStore.loginDialogVisible"
        :title="$t('base.login')"
        :formRef="formRef"
        :autoFocusRef="autoFocusRef"
        :requestFn="requestFn"
    >
        <template #default="{ submit }">
            <el-alert
                class="alert"
                v-if="errorInfo"
                :title="errorInfo"
                type="error"
                @close="errorInfo = ''"
            />
            <el-form ref="formRef" :rules="rules" :model="formData">
                <el-form-item prop="account" label="账号">
                    <el-input ref="autoFocusRef" v-model="formData.account"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input
                        show-password
                        v-model="formData.password"
                        @keydown.enter="submit"
                    ></el-input>
                </el-form-item>
            </el-form>
        </template>
    </FormDialog>
</template>

<style lang="less" scoped>
.alert {
    margin-bottom: 15px;
}
</style>
