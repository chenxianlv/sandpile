import axios from 'axios';
import type { AxiosResponse } from 'axios';

const baseURL = '/api';

const baseRequest = axios.create({
    baseURL,
    timeout: 5000,
});
export default baseRequest;

baseRequest.interceptors.response.use((res: AxiosResponse) => {
    // console.log(res);
    if (res?.data?.status !== 1) return Promise.reject(res);
    return res;
});

export type NormalResponse = AxiosResponse<ResponseData>;
