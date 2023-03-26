import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { CUSTOM_ERROR_HANDLE_URL } from '@/common/commonDefine';
import { $bus } from '@/common/eventBus';
import { useUserStore } from '@/stores/base';

const baseURL = '/api';

const baseRequest = axios.create({
    baseURL,
    timeout: 5000,
});
export default baseRequest;

baseRequest.interceptors.response.use(
    (res: AxiosResponse) => {
        if (res?.data?.status !== 1) return Promise.reject(res);
        return res;
    },
    (error: any) => {
        console.log(error);
        if (error instanceof AxiosError) {
            const url = error.config?.url;
            if (url && CUSTOM_ERROR_HANDLE_URL.includes(url)) {
                return Promise.reject(error);
            }

            const res = error.response;
            if (res?.data?.errorInfo) {
                ElMessage.warning(res?.data.errorInfo);
            } else {
                ElMessage.warning('网络异常');
            }

            if (res?.status === 401) {
                useUserStore().logout();
                $bus.emit('showLoginDialog');
            }
        }
        return Promise.reject(error);
    }
);

export type NormalResponse = AxiosResponse<ResponseData>;
