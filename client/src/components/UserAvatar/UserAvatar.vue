<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/userStore';
import { useLoginStore } from '@/views/Base/LoginDialog/store';
import { logoutAPI } from '@/api/user';
import { ref } from 'vue';
import type { PopoverInstance } from 'element-plus';
import { ElMessageBox } from 'element-plus';
import { i18n } from '@/lang';
import { ClickMenu, ClickMenuItem } from '@/components/ClickMenu';

const $t = i18n.global.t;

const userStore = useUserStore();
const loginStore = useLoginStore();

const popoverRef = ref<PopoverInstance>();
const logout = () => {
    popoverRef.value?.hide();
    ElMessageBox({
        message: $t('user.logoutConfirm'),
        title: $t('user.logout'),
        type: 'warning',
        confirmButtonText: $t('user.logout'),
        showCancelButton: true,
        cancelButtonText: $t('form.cancel'),
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
        <el-button @click="loginStore.open()" v-if="userStore.nickname === undefined"
            >{{ $t('user.login') }}
        </el-button>
        <template v-else>
            <el-popover placement="bottom-end" trigger="hover" ref="popoverRef">
                <template #reference>
                    <span class="profile">
                        <span>{{ userStore.nickname }}</span>
                        <el-icon><ArrowDown /></el-icon>
                    </span>
                </template>
                <template #default>
                    <ClickMenu>
                        <ClickMenuItem @click="logout">{{ $t('user.logout') }}</ClickMenuItem>
                    </ClickMenu>
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
