<script setup lang="ts">
// todo VerticalSizeSash 添加属性minWidth;
// todo 收起目录
// todo tab页
import HeaderView from '@/components/Base/HeaderView.vue';
</script>

<template>
    <div class="main-container">
        <HeaderView />
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </div>
</template>

<style scoped lang="less">
.main-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: @bg-color-bottom-layer;
}
</style>
