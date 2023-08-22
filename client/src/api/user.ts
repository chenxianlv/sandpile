import baseRequest from '@/common/axios';
import type { NormalResponse } from '@/common/axios';
import type { GenericAbortSignal } from 'axios';

export interface UserSummary {
    username: string;
    id: number;
}

export function listUserSummaries(
    data: {
        pattern: string;
    },
    signal: GenericAbortSignal | undefined
): NormalResponse<{
    users?: Array<UserSummary>;
}> {
    return baseRequest({
        url: '/user/listUserSummaries',
        data,
        signal,
    });
}
