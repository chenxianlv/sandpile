import { defineStore } from 'pinia';

export const useHeaderStore = defineStore('header', {
    state: () => ({
        collapsed: true,
        collapseBtnShow: false,
    }),
    actions: {
        switchCollapse() {
            this.collapsed = !this.collapsed;
        },
    },
});
