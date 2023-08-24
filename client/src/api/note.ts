import baseRequest from '@/common/axios';
import type { NormalResponse } from '@/common/axios';
import beforeCloseAPI from '@/common/beforeCloseAPI';
import type { CallbackFn } from '@/common/beforeCloseAPI';
import type { UserSummary } from '@/api/user';

export interface NoteProject {
    id: number;
    projectName: string;
    owners: Array<UserSummary>;
    readers: Array<UserSummary>;
    openness: number;
    createUserName: string;
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

export function listProjectsAPI(): NormalResponse<{
    noteProjects: Array<NoteProject>;
}> {
    return baseRequest({
        url: '/note/listProjects',
    });
}

export function addProjectAPI(data: {
    projectName: string;
    owners: number[];
    readers: number[];
    openness: number;
}): NormalResponse<{
    id: number;
}> {
    return baseRequest({
        url: '/note/addProject',
        data,
    });
}

export function updateProjectAPI(data: {
    id: number;
    projectName?: string;
    owners?: number[];
    readers?: number[];
    openness?: number;
}): NormalResponse {
    return baseRequest({
        url: '/note/updateProject',
        data,
    });
}

export function deleteProjectAPI(data: { id: number }): NormalResponse {
    return baseRequest({
        url: '/note/deleteProject',
        data,
    });
}

export function getProjectDetailAPI(data: { id: number }): NormalResponse<NoteProjectDetail> {
    return baseRequest({
        url: '/note/getProjectDetail',
        data,
    });
}

export function getNoteTextAPI(data: { id: number }): NormalResponse<{
    text: string;
}> {
    return baseRequest({
        url: '/note/getNoteText',
        data,
    });
}

export function addNoteFileAPI(data: {
    projectId: number;
    name: string;
    folderId: number;
}): NormalResponse<{
    id: number;
}> {
    return baseRequest({
        url: '/note/addNoteFile',
        data,
    });
}

export function deleteNoteFileAPI(data: { id: number }): NormalResponse {
    return baseRequest({
        url: '/note/deleteNoteFile',
        data,
    });
}

export function updateNoteFileAPI(data: {
    id: number;
    name?: string;
    folderId?: number;
    text?: string;
}): NormalResponse {
    return baseRequest({
        url: '/note/updateNoteFile',
        data,
    });
}

export function updateNoteFileBeforeCloseAPI(callback: CallbackFn) {
    return beforeCloseAPI.on('/note/updateNoteFile', callback);
}

export function addNoteFolderAPI(data: {
    projectId: number;
    name: string;
    folderId: number;
}): NormalResponse<{
    id: number;
}> {
    return baseRequest({
        url: '/note/addNoteFolder',
        data,
    });
}

export function deleteNoteFolderAPI(data: { id: number }): NormalResponse {
    return baseRequest({
        url: '/note/deleteNoteFolder',
        data,
    });
}

export function updateNoteFolderAPI(data: {
    id: number;
    name?: string;
    folderId?: number;
}): NormalResponse {
    return baseRequest({
        url: '/note/updateNoteFolder',
        data,
    });
}

export function uploadNoteFileAPI(data: {
    projectId: number;
    name: string;
    folderId: number;
    file: File;
}): NormalResponse {
    const formData = new FormData();
    formData.append('projectId', String(data.projectId));
    formData.append('folderId', String(data.folderId));
    formData.append('name', data.name);
    formData.append('file', data.file);

    return baseRequest({
        url: '/note/uploadNoteFile',
        data: formData,
        timeout: 0,
    });
}
