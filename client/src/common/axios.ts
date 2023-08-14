import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { LOCALSTORAGE_USER_PROP_NAME } from '@/common/commonDefine';
import apiConfig from '@/config/base/api';
import { useUserStore } from '@/stores/userStore';
import { useLoginStore } from '@/views/Base/LoginDialog/store';
import { getLocalStorage } from '@/utils/utils';

const printEnabled = import.meta.env.DEV && apiConfig.PRINT_IN_DEV;

const baseRequest = axios.create({
    method: 'post',
    baseURL: apiConfig.BASE_URL,
    timeout: 5000,
});
export default baseRequest;

baseRequest.interceptors.request.use((config) => {
    if (printEnabled) {
        console.log('-'.repeat(40));
        console.log('config: ', config);
        console.log('url: ', config.url);
        config.params && console.log('params: ', config.params);
        config.data && console.log('data: ', config.data);
    }
    const token = getLocalStorage(LOCALSTORAGE_USER_PROP_NAME, true)?.token;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

baseRequest.interceptors.response.use(
    (res: AxiosResponse) => {
        if (printEnabled) {
            console.log('');
            console.log('response: ', res);
            console.log('response data: ', res.data);
            console.log('-'.repeat(40));
        }
        if (res?.data?.status !== 1) return Promise.reject(res);
        return res;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

// 失败拦截器置于成功拦截器后，因为写在一起时，成功拦截器内若将promise置为失败，则无法触发失败回调
baseRequest.interceptors.response.use(
    (res: AxiosResponse) => {
        return res;
    },
    (error: AxiosError | AxiosResponse) => {
        const url = error.config?.url;
        if (url && apiConfig.CUSTOM_ERROR_HANDLE_URL.includes(url)) {
            return Promise.reject(error);
        }

        let res: AxiosResponse;
        if ((error as AxiosResponse)?.data) {
            res = error as AxiosResponse;
        } else {
            res = (error as AxiosError).response as AxiosResponse;
        }

        if (res?.data?.errorInfo) {
            ElMessage.warning(res?.data.errorInfo);
        } else {
            ElMessage.warning('网络异常');
        }

        if (res?.status === 401) {
            useUserStore().logout();
            useLoginStore().open();
        }

        return Promise.reject(error);
    }
);

export type NormalResponse = AxiosResponse<ResponseData>;
