<script setup lang="ts">
import { useHeaderStore } from '@/stores/base';
import { storeToRefs } from 'pinia';

const headerStore = useHeaderStore();

const { switchCollapse } = headerStore;
const { collapsed, collapseBtnShow } = storeToRefs(headerStore);
</script>

<template>
    <div class="container" :class="{ collapsed: collapsed }">
        <div class="content">
            <el-menu default-active="1" mode="horizontal">
                <el-menu-item index="1">学习笔记</el-menu-item>
            </el-menu>
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
</template>

<style lang="less" scoped>
.container {
    box-sizing: border-box;
    @header-height: 59px;
    position: relative;
    overflow: visible;
    height: @header-height;
    transition: height 0.3s;

    &.collapsed {
        height: 0;
    }

    .content {
        height: @header-height;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
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
