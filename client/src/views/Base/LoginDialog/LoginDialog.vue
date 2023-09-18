<script setup lang="ts">
import { ref, watch } from 'vue';
import type { FormInstance, InputInstance } from 'element-plus';
import { i18n } from '@/lang';
import { useLoginStore } from '@/views/Base/LoginDialog/store';
import FormDialog from '@/components/FormDialog/FormDialog.vue';
import LoginForm from '@/views/Base/LoginDialog/LoginForm.vue';
import SignupForm from '@/views/Base/LoginDialog/SignupForm.vue';

const $t = i18n.global.t;
const loginStore = useLoginStore();

const mode = ref<'login' | 'signup'>('login');
const loginFormRef = ref<InstanceType<typeof LoginForm>>();
const signupFormRef = ref<InstanceType<typeof SignupForm>>();

const requestFn = ref<() => Promise<any>>();
const formRef = ref<FormInstance>();
const autoFocusRef = ref<InputInstance>();

watch(loginFormRef, (value) => {
    if (value && mode.value === 'login') {
        formRef.value = value.formRef;
        autoFocusRef.value = value.autoFocusRef;
        requestFn.value = value.requestFn;
    }
});

watch(signupFormRef, (value) => {
    if (value && mode.value === 'signup') {
        formRef.value = value.formRef;
        autoFocusRef.value = value.autoFocusRef;
        requestFn.value = value.requestFn;
    }
});
</script>

<template>
    <FormDialog
        v-model="loginStore.loginDialogVisible"
        :title="mode === 'login' ? $t('user.login') : mode === 'signup' ? $t('user.signup') : ''"
        :formRef="formRef"
        :autoFocusRef="autoFocusRef"
        :requestFn="requestFn"
        @open="mode = 'login'"
    >
        <template #default="{ submit }">
            <LoginForm v-if="mode === 'login'" ref="loginFormRef" :submit="submit" />
            <SignupForm v-if="mode === 'signup'" ref="signupFormRef" :submit="submit" />
            <el-link
                type="primary"
                @click="
                    () => {
                        if (mode === 'login') return (mode = 'signup');
                        if (mode === 'signup') return (mode = 'login');
                    }
                "
            >
                {{
                    mode === 'login'
                        ? $t('user.goToSignup')
                        : mode === 'signup'
                        ? $t('user.goToLogin')
                        : ''
                }}
            </el-link>
        </template>
    </FormDialog>
</template>

<style lang="less" scoped></style>
