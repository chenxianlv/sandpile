import baseRequest from '@/common/axios';

export function listProjectsAPI() {
    return baseRequest({
        url: '/note/listProjects',
    });
}

export function addProjectAPI(data: AnyObj) {
    return baseRequest({
        url: '/note/addProject',
        data,
    });
}

export function updateProjectAPI(data: AnyObj) {
    return baseRequest({
        url: '/note/updateProject',
        data,
    });
}

export function deleteProjectAPI(data: AnyObj) {
    return baseRequest({
        url: '/note/deleteProject',
        data,
    });
}

export function getProjectDetailAPI(data: AnyObj) {
    return baseRequest({
        url: '/note/getProjectDetail',
        data,
    });
}

export function getNoteTextAPI(data: AnyObj) {
    return baseRequest({
        url: '/note/getNoteText',
        data,
    });
}

export function addNoteFileAPI(data: AnyObj) {
    return baseRequest({
        url: '/note/addNoteFile',
        data,
    });
}

export function addNoteFolderAPI(data: AnyObj) {
    return baseRequest({
        url: '/note/addNoteFolder',
        data,
    });
}
