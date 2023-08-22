import { ref } from 'vue';
import baseConfig from '@/config/base';

export function useLoading(config: { startOffsetTime?: number; minDurationTime?: number } = {}) {
    const loading = ref(false);
    let timeout: number | undefined;
    let loadingStartTime: number | undefined;

    const startLoading = () => {
        if (timeout !== undefined) return;
        timeout = window.setTimeout(() => {
            loading.value = true;
            loadingStartTime = Date.now();
            timeout = undefined;
        }, config.startOffsetTime ?? baseConfig.loading.START_OFFSET_TIME);
    };

    const stopLoading = () => {
        if (timeout !== undefined) {
            // 若正在等待loading开始
            clearTimeout(timeout);
            timeout = undefined;
            loading.value = false;
        } else {
            // 若已在loading
            if (loadingStartTime === undefined) return;
            const timeNeedToWait =
                (config.minDurationTime ?? baseConfig.loading.MIN_DURATION_TIME) -
                (Date.now() - loadingStartTime);
            if (timeNeedToWait > 0) {
                setTimeout(() => {
                    loading.value = false;
                }, timeNeedToWait);
            } else {
                loading.value = false;
            }
        }
        loadingStartTime = undefined;
    };

    return { loading, startLoading, stopLoading };
}
