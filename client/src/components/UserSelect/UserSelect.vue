<script setup lang="ts">
import { ref, watch } from 'vue';
import { listUserSummariesAPI } from '@/api/user';

type UserSummary = ApiRes.User.UserSummary;
const props = withDefaults(
    defineProps<{
        modelValue?: number[];
        /**
         * 不输入任何字符的情况下，会显示的选项
         */
        defaultOptions?: Array<UserSummary>;
    }>(),
    {
        modelValue: () => [],
        defaultOptions: () => [],
    }
);
const emit = defineEmits<{
    (e: 'update:modelValue', value: number[]): void;
}>();

const userList = ref<Array<UserSummary>>([]);

const initUserList = () => {
    userList.value = [...props.defaultOptions];
};
watch(
    () => props.defaultOptions,
    () => {
        initUserList();
    },
    { immediate: true }
);

const requesting = ref(false);
const abortController = new AbortController();
const requestFn = (pattern: string) => {
    if (requesting.value) {
        abortController.abort();
        return;
    }
    if (pattern === '') {
        initUserList();
        return;
    }
    requesting.value = true;
    listUserSummariesAPI({ pattern }, abortController.signal)
        .then((res) => {
            userList.value = res?.data?.data?.users ?? [];
        })
        .catch(() => {})
        .finally(() => {
            requesting.value = false;
        });
};
// const select = (id: number) => {
//     emit('update:modelValue', [...props.modelValue, id]);
// };
// defineExpose({ select });
</script>

<template>
    <el-select
        :model-value="props.modelValue"
        @update:model-value="(val) => emit('update:modelValue', val)"
        class="user_select"
        :placeholder="$t('user.inputUserIdOrNickname')"
        filterable
        remote
        multiple
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="10"
        :reserve-keyword="false"
        :remote-method="requestFn"
        :loading="requesting"
    >
        <el-option
            v-for="item in userList"
            :key="item.id"
            :value="item.id"
            :label="`${item.nickname} (${item.id})`"
        >
            <span class="option_item_left">{{ item.nickname }}</span>
            <span class="option_item_right">{{ item.id }}</span>
        </el-option>
    </el-select>
</template>

<style lang="less" scoped>
@import url('@/styles/variable.less');

.user_select {
    width: 100%;
}

.option_item_left {
    float: left;
}

.option_item_right {
    float: right;
    color: @font-color-placeholder;
}
</style>
