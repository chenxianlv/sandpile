import { createI18n } from 'vue-i18n';

import zhCn from './zhCn';
import en from './en';
import { getLocalStorage } from '@/utils/dom';

// 语言本身的翻译，使用getter函数形式以避免循环依赖报错
export function getLang() {
    return {
        zhCn: '简体中文',
        en: 'English',
    } as const;
}

const bcp47LangMap: SimpleObj<string> = {
    'en-AU': 'en',
    'en-CA': 'en',
    'en-GB': 'en',
    'en-IE': 'en',
    'en-IN': 'en',
    'en-NZ': 'en',
    'en-US': 'en',
    'en-ZA': 'en',
    'zh-CN': 'zhCn',
};
const localeLang = getLocalStorage('lang') ?? bcp47LangMap[navigator.language] ?? 'en';

export const i18n = createI18n({
    legacy: false,
    globalInjection: true, // 全局模式，可以直接使用 $t
    locale: localeLang,
    messages: {
        zhCn,
        en,
    },
});
