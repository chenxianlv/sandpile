import { defineStore } from 'pinia';
import baseConfig from '@/config/base';
import { getLocalStorage, setLocalStorage } from '@/utils/dom';
import { loginAPI, logoutAPI } from '@/api/user';

export const useUserStore = defineStore('user', {
    state: () => {
        const user: Partial<ApiRes.User.LoginAPI> = {
            nickname: undefined,
            id: undefined,
            token: undefined,
            authList: [],
        };

        const userStorage = getLocalStorage(baseConfig.storage.USER_PROP_NAME, true);
        if (userStorage instanceof Object) {
            Object.assign(user, userStorage);
        }

        return {
            ...user,
            loginDialogVisible: false,
        };
    },
    actions: {
        async login(formData: ApiReq.User.LoginAPI) {
            const res = await loginAPI(formData);
            const data = res.data?.data ?? {};
            this.$patch(data);
            setLocalStorage(baseConfig.storage.USER_PROP_NAME, data);
            return res;
        },
        async logout() {
            await logoutAPI();
            window.localStorage.removeItem(baseConfig.storage.USER_PROP_NAME);
            this.$reset();
        },
        authenticate(requiredAuthIdArr: number[]) {
            return requiredAuthIdArr.every((authId) => this.authList?.includes(authId) ?? false);
        },
    },
});
