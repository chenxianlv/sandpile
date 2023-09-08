import type { InjectionKey } from 'vue';

export const ON_BEFORE_ITEM_CLICK_INJECTION_KEY: InjectionKey<() => void> = Symbol();
