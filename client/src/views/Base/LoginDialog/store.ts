import { defineStore } from 'pinia';

export const useLoginStore = defineStore('login', {
    state: () => ({
        loginDialogVisible: false,
    }),
    actions: {
        open() {
            this.loginDialogVisible = true;
        },
        close() {
            this.loginDialogVisible = false;
        },
    },
});
