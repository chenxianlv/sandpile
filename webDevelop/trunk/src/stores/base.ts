import { defineStore } from 'pinia';
import { LOCALSTORAGE_USER_PROP_NAME } from '@/common/commonDefine';
import { getLocalStorage, setLocalStorage } from '@/utils/utils';

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

interface UserInfo {
    username?: string;
    id?: number;
}

export const useUserStore = defineStore('user', {
    state: () => {
        const user: UserInfo = {
            username: undefined,
            id: undefined,
        };

        const userStorage = getLocalStorage(LOCALSTORAGE_USER_PROP_NAME, true);
        if (userStorage instanceof Object) {
            Object.assign(user, userStorage);
        }

        return user;
    },
    actions: {
        login(user: UserInfo) {
            this.$patch(user);
            setLocalStorage(LOCALSTORAGE_USER_PROP_NAME, user);
        },
        logout() {
            window.localStorage.removeItem(LOCALSTORAGE_USER_PROP_NAME);
            this.$reset();
        },
    },
});
