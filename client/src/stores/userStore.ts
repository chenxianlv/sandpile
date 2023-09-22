import { defineStore } from 'pinia';
import baseConfig from '@/config/base';
import { getLocalStorage, setLocalStorage } from '@/utils/dom';
import { loginAPI, logoutAPI } from '@/api/user';
import { ElMessage } from 'element-plus';
import { i18n } from '@/lang';

const $t = i18n.global.t;
export const useUserStore = defineStore('user', {
    state: () => {
        const user: Partial<ApiRes.User.LoginAPI> = {
            nickname: undefined,
            id: undefined,
            token: undefined,
            tokenExpireTime: undefined,
            authList: [],
        };
        let loginDialogVisible = false;

        const userStorage = getLocalStorage(baseConfig.storage.USER_PROP_NAME, true);
        if (userStorage instanceof Object) {
            // 若token已过期，自动注销并清除用户信息
            if (
                userStorage.tokenExpireTime !== undefined &&
                userStorage.tokenExpireTime < Date.now()
            ) {
                logoutAPI();
                window.localStorage.removeItem(baseConfig.storage.USER_PROP_NAME);
                ElMessage.warning($t('errorCode.11002'));
                loginDialogVisible = true;
            } else {
                Object.assign(user, userStorage);
            }
        }

        return {
            ...user,
            loginDialogVisible,
        };
    },
    actions: {
        async login(formData: ApiReq.User.LoginAPI) {
            const res = await loginAPI(formData);
            const data = res.data.data;
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
