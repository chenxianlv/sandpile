import type { NormalResponse } from '@/common/axios';
import beforeCloseAPI from '@/common/beforeCloseAPI';
import type { CallbackFn } from '@/common/beforeCloseAPI';
import { validRequest } from '@/api/types/typeValid';

export function listProjectsAPI(): NormalResponse<ApiRes.Note.ListProjectsAPI> {
    return validRequest('Note.ListProjectsAPI')({
        url: '/note/listProjects',
    });
}

export function addProjectAPI(
    data: ApiReq.Note.AddProjectAPI
): NormalResponse<ApiRes.Note.AddProjectAPI> {
    return validRequest(
        'Note.AddProjectAPI',
        data
    )({
        url: '/note/addProject',
        data,
    });
}

export function updateProjectAPI(data: ApiReq.Note.UpdateProjectAPI): NormalResponse {
    return validRequest(
        'Note.UpdateProjectAPI',
        data
    )({
        url: '/note/updateProject',
        data,
    });
}

export function deleteProjectAPI(data: ApiReq.Note.DeleteProjectAPI): NormalResponse {
    return validRequest(
        'Note.DeleteProjectAPI',
        data
    )({
        url: '/note/deleteProject',
        data,
    });
}

export function getProjectDetailAPI(
    data: ApiReq.Note.GetProjectDetailAPI
): NormalResponse<ApiRes.Note.GetProjectDetailAPI> {
    return validRequest(
        'Note.GetProjectDetailAPI',
        data
    )({
        url: '/note/getProjectDetail',
        data,
    });
}

export function getNoteTextAPI(
    data: ApiReq.Note.GetNoteTextAPI
): NormalResponse<ApiRes.Note.GetNoteTextAPI> {
    return validRequest(
        'Note.GetNoteTextAPI',
        data
    )({
        url: '/note/getNoteText',
        data,
    });
}

export function addNoteFileAPI(
    data: ApiReq.Note.AddNoteFileAPI
): NormalResponse<ApiRes.Note.AddNoteFileAPI> {
    return validRequest(
        'Note.AddNoteFileAPI',
        data
    )({
        url: '/note/addNoteFile',
        data,
    });
}

export function deleteNoteFileAPI(data: ApiReq.Note.DeleteNoteFileAPI): NormalResponse {
    return validRequest(
        'Note.DeleteNoteFileAPI',
        data
    )({
        url: '/note/deleteNoteFile',
        data,
    });
}

export function updateNoteFileAPI(data: ApiReq.Note.UpdateNoteFileAPI): NormalResponse {
    return validRequest(
        'Note.UpdateNoteFileAPI',
        data
    )({
        url: '/note/updateNoteFile',
        data,
    });
}

export function updateNoteFileBeforeCloseAPI(callback: CallbackFn) {
    return beforeCloseAPI.on('/note/updateNoteFile', callback);
}

export function addNoteFolderAPI(
    data: ApiReq.Note.AddNoteFolderAPI
): NormalResponse<ApiRes.Note.AddNoteFolderAPI> {
    return validRequest(
        'Note.AddNoteFolderAPI',
        data
    )({
        url: '/note/addNoteFolder',
        data,
    });
}

export function deleteNoteFolderAPI(data: ApiReq.Note.DeleteNoteFolderAPI): NormalResponse {
    return validRequest(
        'Note.DeleteNoteFolderAPI',
        data
    )({
        url: '/note/deleteNoteFolder',
        data,
    });
}

export function updateNoteFolderAPI(data: ApiReq.Note.UpdateNoteFolderAPI): NormalResponse {
    return validRequest(
        'Note.UpdateNoteFolderAPI',
        data
    )({
        url: '/note/updateNoteFolder',
        data,
    });
}

export function uploadNoteFileAPI(data: ApiReq.Note.UploadNoteFileAPI): NormalResponse {
    const requestMethod = validRequest('Note.UploadNoteFileAPI', data);

    const formData = new FormData();
    formData.append('projectId', String(data.projectId));
    formData.append('folderId', String(data.folderId));
    formData.append('name', data.name);
    formData.append('file', data.file);

    return requestMethod({
        url: '/note/uploadNoteFile',
        data: formData,
        timeout: 0,
    });
}
