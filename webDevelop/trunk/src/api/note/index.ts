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
        url: '/note/project',
        params,
    });
}

export function updateProjectAPI(data: anyObj) {
    return baseRequest({
        method: 'put',
        url: '/note/project',
        data,
    });
}

export function getNoteDetailAPI(params: anyObj) {
    return baseRequest({
        method: 'get',
        url: '/note/note',
        params,
    });
}
