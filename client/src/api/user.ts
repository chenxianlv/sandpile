import type { NormalResponse } from '@/common/axios';
import type { GenericAbortSignal } from 'axios';
import { validRequest } from '@/api/types/typeValid';
import { encryptPwd } from '@/utils/crypto';
import { cloneDeep } from 'lodash-es';

export function loginAPI(data: ApiReq.User.LoginAPI) {
    const requestMethod = validRequest('User.LoginAPI', data);

    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', encryptPwd(data.password, data.username));

    return requestMethod({
        url: '/user/login',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        data: formData,
    });
}

export function logoutAPI() {
    return validRequest('')({
        url: '/user/logout',
        method: 'get',
    });
}

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

export function signupAPI(data: ApiReq.User.SignupAPI): NormalResponse {
    const _data = cloneDeep(data);
    _data.password = encryptPwd(data.password, data.username);

    return validRequest(
        'User.SignupAPI',
        _data
    )({
        url: '/user/signup',
        data: _data,
    });
}
