import { createI18n } from 'vue-i18n';

import zhCn from './zhCn';
import en from './en';

export const i18n = createI18n({
    legacy: false,
    globalInjection: true, // 全局模式，可以直接使用 $t
    locale: 'zhCn',
    fallbackLocale: 'en',
    messages: {
        zhCn,
        en,
    },
});
