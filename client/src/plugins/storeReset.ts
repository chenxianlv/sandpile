import { cloneDeep } from 'lodash-es';
import type { PiniaPluginContext } from 'pinia';

export function storeReset({ store }: PiniaPluginContext) {
    const initialState = cloneDeep(store.$state);
    store.$reset = () => store.$patch(initialState);
}
