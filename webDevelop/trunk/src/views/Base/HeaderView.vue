<script setup lang="ts">
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';
import { useHeaderStore } from '@/views/Base/store';
import { storeToRefs } from 'pinia';
import imgUrl from '@/assets/img/logo/logo_141x80.png';
import UserAvatar from '@/components/UserAvatar/UserAvatar.vue';

const headerStore = useHeaderStore();
const route = useRoute();
const getRoutePath = () => {
    return route.path.match(/^\/\w*(?=\/|$)/)?.[0];
};

const { switchCollapse } = headerStore;
const { collapsed, collapseBtnShow } = storeToRefs(headerStore);
</script>

<template>
    <div class="container" :class="{ collapsed: collapsed }">
        <div class="logo">
            <img :src="imgUrl" alt="sandpile" />
        </div>
        <el-menu class="menu" :default-active="getRoutePath()" mode="horizontal" router>
            <el-menu-item index="/note">学习笔记</el-menu-item>
            <el-menu-item index="/3d">3d</el-menu-item>
        </el-menu>
        <UserAvatar />
        <div class="collapse-icon" @click="switchCollapse" v-if="collapseBtnShow">
            <el-icon>
                <ArrowDown v-if="collapsed" />
                <ArrowUp v-else />
            </el-icon>
        </div>
    </div>
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
        border: none;
        overflow: hidden;
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
