import { defineStore } from 'pinia';
import baseConfig from '@/config/base';
import { getLocalStorage, setLocalStorage } from '@/utils/storage';

interface UserInfo {
    username?: string;
    id?: number;
    token?: string;
    authList: number[];
}

export const useUserStore = defineStore('user', {
    state: () => {
        const user: UserInfo = {
            username: undefined,
            id: undefined,
            token: undefined,
            authList: [],
        };

        const userStorage = getLocalStorage(baseConfig.storage.USER_PROP_NAME, true);
        if (userStorage instanceof Object) {
            Object.assign(user, userStorage);
        }

        return user;
    },
    actions: {
        login(user: UserInfo) {
            this.$patch(user);
            setLocalStorage(baseConfig.storage.USER_PROP_NAME, user);
        },
        logout() {
            window.localStorage.removeItem(baseConfig.storage.USER_PROP_NAME);
            this.$reset();
        },
        authenticate(requiredAuthIdArr: number[]) {
            return requiredAuthIdArr.every((authId) => this.authList.includes(authId));
        },
    },
});
