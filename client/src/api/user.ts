import baseRequest from '@/common/axios';
import type { GenericAbortSignal } from 'axios';

export function listUserSummaries(data: AnyObj, signal: GenericAbortSignal | undefined) {
    return baseRequest({
        url: '/user/listUserSummaries',
        data,
        signal,
    });
}
