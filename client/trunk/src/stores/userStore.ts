import { defineStore } from 'pinia';
import { getLocalStorage, setLocalStorage } from '@/utils/utils';
import { LOCALSTORAGE_USER_PROP_NAME } from '@/common/commonDefine';

interface UserInfo {
    username?: string;
    id?: number;
    token?: string;
}

export const useUserStore = defineStore('user', {
    state: () => {
        const user: UserInfo = {
            username: undefined,
            id: undefined,
            token: undefined,
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
