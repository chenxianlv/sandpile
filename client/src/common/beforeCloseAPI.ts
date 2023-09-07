import baseConfig from '@/config/base';
import { getLocalStorage } from '@/utils/dom';

type SendFn = (data: SimpleObj<any>) => Promise<any>;
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
        const headers: SimpleObj<any> = {
            'Content-Type': 'application/json; charset=utf-8',
        };
        const token = getLocalStorage(baseConfig.storage.USER_PROP_NAME, true)?.token;
        if (token) {
            headers.Authorization = token;
        }

        this.dataGetterMap.forEach(({ url, callback }) => {
            callback(async (data) => {
                const res = await fetch(url, {
                    headers,
                    method: 'POST',
                    body: JSON.stringify(data),
                    keepalive: true,
                });
                return await res.json();
            });
        });
        this.dataGetterMap = new Map();
    }

    on(url: string, callback: CallbackFn) {
        const id = this.idCount++;
        this.dataGetterMap.set(id, { url: baseConfig.api.BASE_URL + url, callback });
        return id;
    }

    off(id: number) {
        this.dataGetterMap.delete(id);
    }
}

export const beforeCloseAPI = new BeforeCloseAPI();

export default beforeCloseAPI;
