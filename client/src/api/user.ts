import type { NormalResponse } from '@/common/axios';
import type { GenericAbortSignal } from 'axios';
import { validRequest } from '@/api/types/typeValid';

export function listUserSummariesAPI(
    data: ApiReq.User.ListUserSummariesAPI,
    signal: GenericAbortSignal | undefined
): NormalResponse<ApiRes.User.ListUserSummariesAPI> {
    return validRequest(
        'User.ListUserSummariesAPI',
        data
    )({
        url: '/user/listUserSummaries',
        data,
        signal,
    });
}
