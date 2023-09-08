<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue';
import type { i18n } from '@/lang';
import { setLocalStorage } from '@/utils/dom';
import { ref } from 'vue';
import type { PopoverInstance } from 'element-plus';
import { ClickMenu, ClickMenuItem } from '@/components/ClickMenu';

const popoverRef = ref<PopoverInstance | null>(null);
const onChangeLocale = (newLocale: (typeof i18n.global.availableLocales)[number]) => {
    setLocalStorage('lang', newLocale);
    history.go(0);
};
</script>

<template>
    <el-popover placement="bottom-end" trigger="hover" ref="popoverRef">
        <template #reference>
            <el-icon class="icon_button">
                <SvgIcon name="i18n" />
            </el-icon>
        </template>
        <template #default>
            <ClickMenu class="lang-menu">
                <ClickMenuItem
                    v-for="locale in $i18n.availableLocales"
                    :key="locale"
                    :value="locale"
                    :class="{ selected: locale === $i18n.locale }"
                    @click="onChangeLocale(locale)"
                    >{{ $t('lang.' + locale) }}</ClickMenuItem
                >
            </ClickMenu>
        </template>
    </el-popover>
</template>

<style scoped lang="less">
@import url('@/styles/variable');

.icon_button {
    margin: 0 8px;
}

.lang-menu {
    max-height: 200px;
    overflow-y: auto;

    li.selected {
        background-color: @bg-color-item-selected;
        color: #fff;
    }
}
</style>
