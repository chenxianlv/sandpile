<script setup lang="ts">
import { ref } from 'vue';
import { listUserSummaries } from '@/api/user';
import { useUserStore } from '@/stores/userStore';

type UserSummary = {
    username: string;
    id: number;
};
const props = withDefaults(
    defineProps<{
        modelValue?: number[];
        /**
         * 若已登录，则不输入任何字符的情况下，会添加当前用户至可选项中
         */
        currentUserOption?: boolean;
    }>(),
    {
        modelValue: () => [],
        currentUserOption: false,
    }
);
const emit = defineEmits<{
    (e: 'update:modelValue', value: number[]): void;
}>();

const userStore = useUserStore();
const userList = ref<Array<UserSummary>>([]);

const initUserList = () => {
    const arr = [];
    if (props.currentUserOption && userStore.id !== undefined && userStore.username !== undefined) {
        arr.push({ id: userStore.id, username: userStore.username });
    }
    userList.value = arr;
};
initUserList();

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
    listUserSummaries({ pattern }, abortController.signal)
        .then((res) => {
            userList.value = res?.data?.data?.users ?? [];
        })
        .catch(() => {})
        .finally(() => {
            requesting.value = false;
        });
};
const selectCurrentUser = () => {
    if (typeof userStore.id === 'number') {
        emit('update:modelValue', [...props.modelValue, userStore.id]);
    }
};
defineExpose({ selectCurrentUser });
</script>

<template>
    <el-select
        :model-value="props.modelValue"
        @update:model-value="(val) => emit('update:modelValue', val)"
        class="user_select"
        placeholder="请输入用户ID或用户名"
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
            :label="`${item.username} (${item.id})`"
        >
            <span class="option_item_left">{{ item.username }}</span>
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
