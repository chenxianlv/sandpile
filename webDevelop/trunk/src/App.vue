<script setup lang="ts">
import HeaderView from '@/components/Base/HeaderView.vue';
// todo VerticalSizeSash 添加属性minWidth;
// todo 收起目录
// todo tab页
</script>

<template>
    <el-container>
        <el-header>
            <HeaderView />
        </el-header>
        <el-main>
            <RouterView />
        </el-main>
    </el-container>
</template>

<style scoped lang="less">
.el-container {
    height: 100%;
}
.el-header,
.el-main {
    padding: 0;
}
</style>
