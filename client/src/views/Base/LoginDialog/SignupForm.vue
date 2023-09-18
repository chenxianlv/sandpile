<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { FormRules, FormInstance, InputInstance } from 'element-plus';
import { i18n } from '@/lang';
import { loginAPI, signupAPI } from '@/api/user';
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

// 防止浏览器自动填充已保存的密码，在挂载时为input添加readonly，等到focus触发时再移除readonly
const readonly = ref(true);

const formData = reactive<{
    username: string;
    nickname: string;
    password: string;
}>({
    username: '',
    nickname: '',
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
    nickname: [
        {
            required: true,
            message: $t('form.requireInput', { prop: $t('user.nickname') }),
            trigger: 'blur',
        },
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
        await signupAPI(formData);
        // todo 注册成功自动登录
        // const data = res.data?.data ?? {};
        //
        // loginStore.close();
        // history.go(0);
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
        <el-form-item prop="nickname" :label="$t('user.nickname')">
            <el-input
                v-model="formData.nickname"
                :readonly="readonly"
                @focus="readonly = false"
            ></el-input>
        </el-form-item>
        <el-form-item prop="password" :label="$t('user.password')">
            <el-input
                type="password"
                show-password
                v-model="formData.password"
                @keydown.enter="props.submit"
                :readonly="readonly"
                @focus="readonly = false"
            ></el-input>
        </el-form-item>
    </el-form>
</template>

<style scoped lang="less">
.alert {
    margin-bottom: 15px;
}
</style>
