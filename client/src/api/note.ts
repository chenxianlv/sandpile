import baseRequest from '@/common/axios';
import type { NormalResponse } from '@/common/axios';
import beforeCloseAPI from '@/common/beforeCloseAPI';
import type { CallbackFn } from '@/common/beforeCloseAPI';
import type { UserSummary } from '@/api/user';
import { reqValid, resValid } from '@/api/types/typeValid';

// todo 移除类型
export interface NoteProject {
    id: number;
    projectName: string;
    owners: Array<UserSummary>;
    readers: Array<UserSummary>;
    openness: number;
    createUsername: string;
    createTime: string;
}

export interface NoteProjectDetail {
    projectName: string;
    owners: Array<UserSummary>;
    readers: Array<UserSummary>;
    openness: number;
    notes: Array<NoteFile>;
    noteFolders: Array<NoteFolder>;
}

export interface NoteFile {
    id: number;
    name: string;
    folderId: number;
}

export interface NoteFolder {
    id: number;
    name: string;
    folderId: number;
}

export function listProjectsAPI(): NormalResponse<ApiRes.Note.ListProjectsAPI> {
    return resValid(
        baseRequest({
            url: '/note/listProjects',
        }),
        'ApiRes.Note.ListProjectsAPI'
    );
}

export function addProjectAPI(
    data: ApiReq.Note.AddProjectAPI
): NormalResponse<ApiRes.Note.AddProjectAPI> {
    reqValid(data, 'ApiReq.Note.AddProjectAPI');
    return resValid(
        baseRequest({
            url: '/note/addProject',
            data,
        }),
        'ApiRes.Note.AddProjectAPI'
    );
}

export function updateProjectAPI(data: ApiReq.Note.UpdateProjectAPI): NormalResponse {
    reqValid(data, 'ApiReq.Note.UpdateProjectAPI');
    return resValid(
        baseRequest({
            url: '/note/updateProject',
            data,
        })
    );
}

export function deleteProjectAPI(data: ApiReq.Note.DeleteProjectAPI): NormalResponse {
    reqValid(data, 'ApiReq.Note.DeleteProjectAPI');
    return resValid(
        baseRequest({
            url: '/note/deleteProject',
            data,
        })
    );
}

export function getProjectDetailAPI(
    data: ApiReq.Note.GetProjectDetailAPI
): NormalResponse<ApiRes.Note.GetProjectDetailAPI> {
    reqValid(data, 'ApiReq.Note.GetProjectDetailAPI');
    return resValid(
        baseRequest({
            url: '/note/getProjectDetail',
            data,
        }),
        'ApiRes.Note.GetProjectDetailAPI'
    );
}

export function getNoteTextAPI(
    data: ApiReq.Note.GetNoteTextAPI
): NormalResponse<ApiRes.Note.GetNoteTextAPI> {
    reqValid(data, 'ApiReq.Note.GetNoteTextAPI');
    return resValid(
        baseRequest({
            url: '/note/getNoteText',
            data,
        }),
        'ApiRes.Note.GetNoteTextAPI'
    );
}

export function addNoteFileAPI(
    data: ApiReq.Note.AddNoteFileAPI
): NormalResponse<ApiRes.Note.AddNoteFileAPI> {
    reqValid(data, 'ApiReq.Note.AddNoteFileAPI');
    return resValid(
        baseRequest({
            url: '/note/addNoteFile',
            data,
        }),
        'ApiRes.Note.AddNoteFileAPI'
    );
}

export function deleteNoteFileAPI(data: ApiReq.Note.DeleteNoteFileAPI): NormalResponse {
    reqValid(data, 'ApiReq.Note.DeleteNoteFileAPI');
    return resValid(
        baseRequest({
            url: '/note/deleteNoteFile',
            data,
        })
    );
}

export function updateNoteFileAPI(data: ApiReq.Note.UpdateNoteFileAPI): NormalResponse {
    reqValid(data, 'ApiReq.Note.UpdateNoteFileAPI');
    return resValid(
        baseRequest({
            url: '/note/updateNoteFile',
            data,
        })
    );
}

export function updateNoteFileBeforeCloseAPI(callback: CallbackFn) {
    return beforeCloseAPI.on('/note/updateNoteFile', callback);
}

export function addNoteFolderAPI(
    data: ApiReq.Note.AddNoteFolderAPI
): NormalResponse<ApiRes.Note.AddNoteFolderAPI> {
    reqValid(data, 'ApiReq.Note.AddNoteFolderAPI');
    return resValid(
        baseRequest({
            url: '/note/addNoteFolder',
            data,
        }),
        'ApiRes.Note.AddNoteFolderAPI'
    );
}

export function deleteNoteFolderAPI(data: ApiReq.Note.DeleteNoteFolderAPI): NormalResponse {
    reqValid(data, 'ApiReq.Note.DeleteNoteFolderAPI');
    return resValid(
        baseRequest({
            url: '/note/deleteNoteFolder',
            data,
        })
    );
}

export function updateNoteFolderAPI(data: ApiReq.Note.UpdateNoteFolderAPI): NormalResponse {
    reqValid(data, 'ApiReq.Note.UpdateNoteFolderAPI');
    return resValid(
        baseRequest({
            url: '/note/updateNoteFolder',
            data,
        })
    );
}

export function uploadNoteFileAPI(data: ApiReq.Note.UploadNoteFileAPI): NormalResponse {
    reqValid(data, 'ApiReq.Note.UploadNoteFileAPI');
    const formData = new FormData();
    formData.append('projectId', String(data.projectId));
    formData.append('folderId', String(data.folderId));
    formData.append('name', data.name);
    formData.append('file', data.file);

    return resValid(
        baseRequest({
            url: '/note/uploadNoteFile',
            data: formData,
            timeout: 0,
        })
    );
}
