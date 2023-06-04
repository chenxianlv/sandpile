<script setup lang="ts">
import HeaderView from '@/views/Base/HeaderView.vue';
import LoginDialog from '@/components/LoginDialog/LoginDialog.vue';
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
    <LoginDialog />
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
