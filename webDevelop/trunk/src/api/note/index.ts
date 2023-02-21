import baseRequest from '@/common/axios';

export function listProjectsAPI() {
    return baseRequest({
        method: 'get',
        url: '/note/project/list',
    });
}

export function getProjectDetailAPI(params: anyObj) {
    return baseRequest({
        method: 'get',
        url: '/note/project/detail',
        params,
    });
}

export function updateProjectAPI(params: anyObj) {
    return baseRequest({
        method: 'put',
        url: '/note/project',
        params,
    });
}
