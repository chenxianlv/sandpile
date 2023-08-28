<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/userStore';
import { useLoginStore } from '@/views/Base/LoginDialog/store';
import { logoutAPI } from '@/api/base';
import { ref } from 'vue';
import type { PopoverInstance } from 'element-plus';
import { ElMessageBox } from 'element-plus';

const userStore = useUserStore();
const loginStore = useLoginStore();

const popoverRef = ref<PopoverInstance>();
const logout = () => {
    popoverRef.value?.hide();
    ElMessageBox({
        message: '确认要退出登录吗？当前未提交的变更可能会丢失',
        title: '退出登录',
        type: 'warning',
        confirmButtonText: '退出登录',
        showCancelButton: true,
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
                logoutAPI().then(() => {
                    userStore.logout();
                    done();
                    location.pathname = '/';
                });
            } else {
                done();
            }
        },
    });
};
</script>

<template>
    <div class="user-avatar">
        <el-button @click="loginStore.open()" v-if="userStore.username === undefined"
            >登录
        </el-button>
        <template v-else>
            <el-popover placement="bottom-end" trigger="hover" ref="popoverRef">
                <template #reference>
                    <span class="profile">
                        <span>{{ userStore.username }}</span>
                        <el-icon><ArrowDown /></el-icon>
                    </span>
                </template>
                <template #default>
                    <ul class="option-menu">
                        <li @click="logout">退出登录</li>
                    </ul>
                </template>
            </el-popover>
        </template>
    </div>
</template>

<style lang="less" scoped>
@import url('@/styles/variable.less');

.user-avatar {
    .profile {
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
        color: @font-color-primary;

        display: flex;
        align-items: center;

        > i {
            margin-left: 7px;
        }
    }
}
</style>
