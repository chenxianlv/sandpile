import baseRequest from '@/common/axios';

const pathPrefix = '/base';

export function getMenu(params: any) {
    return baseRequest({
        url: `${pathPrefix}/getMenu`,
        method: 'get',
        params,
    });
}
