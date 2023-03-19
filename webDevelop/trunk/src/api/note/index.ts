import baseRequest from '@/common/axios';

export function listProjectsAPI() {
    return baseRequest({
        method: 'get',
        url: '/note/listProjects',
    });
}

export function addProjectAPI(data: anyObj) {
    return baseRequest({
        method: 'post',
        url: '/note/addProject',
        data,
    });
}

export function updateProjectAPI(data: anyObj) {
    return baseRequest({
        method: 'put',
        url: '/note/updateProject',
        data,
    });
}

export function deleteProjectAPI(params: anyObj) {
    return baseRequest({
        method: 'delete',
        url: '/note/deleteProject',
        params,
    });
}

export function getProjectDetailAPI(params: anyObj) {
    return baseRequest({
        method: 'get',
        url: '/note/getProjectDetail',
        params,
    });
}

export function getNoteInfoAPI(params: anyObj) {
    return baseRequest({
        method: 'get',
        url: '/note/getNoteInfo',
        params,
    });
}
