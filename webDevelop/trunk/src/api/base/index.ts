import baseRequest from '@/common/axios';

export function getLoginSecretAPI(params: AnyObj) {
    return baseRequest({
        url: '/base/getLoginSecret',
        method: 'get',
        params,
    });
}

export function loginAPI(data: FormData) {
    return baseRequest({
        url: '/base/login',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        data,
    });
}

export function logoutAPI() {
    return baseRequest({
        url: '/base/logout',
        method: 'get',
    });
}
