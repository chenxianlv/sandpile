import apiConfig from '@/config/api';
import { getLocalStorage } from '@/utils/utils';
import { LOCALSTORAGE_USER_PROP_NAME } from '@/common/commonDefine';

type SendFn = (data: AnyObj) => Promise<any>;
export type CallbackFn = (send: SendFn) => any;
type MapItem = {
    url: string;
    callback: CallbackFn;
};

class BeforeCloseAPI {
    dataGetterMap: Map<number, MapItem> = new Map();

    idCount: number = 1;

    constructor() {
        if (!fetch) console.error('浏览器不支持fetch API');
        // 移动端可能无法触发beforeunload事件，需用visibilitychange做兼容
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.requestAll();
            }
        });
        document.addEventListener('beforeunload', () => {
            this.requestAll();
        });
    }

    requestAll() {
        const headers: AnyObj = {
            'Content-Type': 'application/json; charset=utf-8',
        };
        const token = getLocalStorage(LOCALSTORAGE_USER_PROP_NAME, true)?.token;
        if (token) {
            headers.Authorization = token;
        }

        this.dataGetterMap.forEach(({ url, callback }) => {
            callback((data) => {
                return fetch(url, {
                    headers,
                    method: 'POST',
                    body: JSON.stringify(data),
                    keepalive: true,
                }).then((res) => res.json());
            });
        });
        this.dataGetterMap = new Map();
    }

    on(url: string, callback: CallbackFn) {
        const id = this.idCount++;
        this.dataGetterMap.set(id, { url: apiConfig.BASE_URL + url, callback });
        return id;
    }

    off(id: number) {
        console.log(this.dataGetterMap);
        this.dataGetterMap.delete(id);
    }
}

export const beforeCloseAPI = new BeforeCloseAPI();

export default beforeCloseAPI;
