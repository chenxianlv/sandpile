import { defineStore } from 'pinia';

export const useHeaderStore = defineStore('header', {
    state: () => ({
        collapsed: false,
        collapseBtnShow: false,
    }),
    actions: {
        switchCollapse() {
            this.collapsed = !this.collapsed;
        },
    },
});
