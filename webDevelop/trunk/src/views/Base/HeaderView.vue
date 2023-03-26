<script setup lang="ts">
import { useHeaderStore, useUserStore } from '@/stores/base';
import { storeToRefs } from 'pinia';
import LoginDialog from '@/views/Base/LoginDialog.vue';
import { ref } from 'vue';
import imgUrl from '@/assets/img/logo/logo_141x80.png';
import type { PopoverInstance } from 'element-plus';
import { logoutAPI } from '@/api/base';

const headerStore = useHeaderStore();

const { switchCollapse } = headerStore;
const { collapsed, collapseBtnShow } = storeToRefs(headerStore);

const loginDialogVisible = ref(false);
const userStore = useUserStore();

const popoverRef = ref<PopoverInstance>();

const logout = () => {
    logoutAPI()
        .then(() => {
            userStore.logout();
        })
        .catch()
        .finally(() => {
            popoverRef.value?.hide();
        });
};
</script>

<template>
    <div class="container" :class="{ collapsed: collapsed }">
        <div class="logo">
            <img :src="imgUrl" alt="sandpile" />
        </div>
        <el-menu class="menu" default-active="1" mode="horizontal">
            <el-menu-item index="1">学习笔记</el-menu-item>
        </el-menu>
        <div class="user-box">
            <el-button
                @click="loginDialogVisible = true"
                v-if="userStore.username === undefined"
                >登录
            </el-button>
            <template v-else>
                <el-popover
                    placement="bottom-end"
                    trigger="click"
                    ref="popoverRef"
                >
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

        <div
            class="collapse-icon"
            @click="switchCollapse"
            v-if="collapseBtnShow"
        >
            <el-icon>
                <ArrowDown v-if="collapsed" />
                <ArrowUp v-else />
            </el-icon>
        </div>
    </div>
    <LoginDialog v-model:visible="loginDialogVisible" />
</template>

<style lang="less" scoped>
@header-height: 50px;
@logo-box-width: 70px;
@logo-height: 36px;

.container {
    display: flex;
    align-items: center;
    height: @header-height;
    padding: 0 20px;
    background-color: @bg-color-top-layer;
    border-bottom: solid 1px @border-color-light;
    position: relative;
    overflow: visible;
    transition: height 0.3s;

    &.collapsed {
        height: 0;
    }

    .logo {
        margin-right: 20px;
        height: 100%;
        width: @logo-box-width;
        display: flex;

        img {
            margin: auto;
            height: @logo-height;
        }
    }

    .menu {
        --el-menu-item-height: calc(@header-height - 2px);
        flex: auto;
        border: none;
    }

    .user-box {
        margin-left: 20px;

        .profile {
            cursor: pointer;
            font-size: 16px;
            color: @font-color-primary;

            display: flex;
            align-items: center;

            > i {
                margin-top: 2px;
                margin-left: 7px;
            }
        }
    }

    .collapse-icon {
        width: 40px;
        height: 25px;
        position: absolute;
        right: 5px;
        bottom: 0;
        transform: translateY(100%);
        z-index: 100;

        cursor: pointer;
        background-color: #fff;
        border: 1px solid #dcdfe6;
        border-top: none;
        border-radius: 0 0 12px 12px;
        text-align: center;
        font-size: 20px;
    }
}
</style>
