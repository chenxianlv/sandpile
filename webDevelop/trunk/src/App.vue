<script setup lang="ts">
// todo VerticalSizeSash 添加属性minWidth;
// todo 收起目录
// todo tab页
// fixme 部署后显示时区的问题
import HeaderView from '@/views/Base/HeaderView.vue';
</script>

<template>
    <div class="main-container">
        <header>
            <HeaderView />
        </header>
        <main>
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </main>
    </div>
</template>

<style scoped lang="less">
.main-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: @bg-color-bottom-layer;

    header {
        flex: none;
    }

    main {
        flex: auto;
        overflow: auto;
        width: 100%;
    }
}
</style>
