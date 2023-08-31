<script setup lang="ts">
import { computed } from 'vue';
import HeaderView from '@/views/Base/HeaderView.vue';
import LoginDialog from '@/views/Base/LoginDialog/LoginDialog.vue';
import { i18n } from '@/lang';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';

const elLangMap: SimpleObj<any> = { zhCn, en };
const locale = computed(() => {
    return elLangMap[i18n.global.locale.value];
});
</script>

<template>
    <el-config-provider :locale="locale">
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
    </el-config-provider>
</template>

<style scoped lang="less">
@import url('@/styles/variable.less');

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
