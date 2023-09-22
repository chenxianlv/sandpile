declare namespace ApiRes {
    export namespace User {
        export interface UserSummary {
            nickname: string;
            id: number;
        }
        export interface LoginAPI {
            id: number;
            nickname: string;
            token: string;
            tokenExpireTime: number;
            authList: number[];
        }
        export interface ListUserSummariesAPI {
            users?: Array<UserSummary>;
        }
    }
    export namespace Note {
        export interface NoteProject {
            id: number;
            projectName: string;
            owners: Array<ApiRes.User.UserSummary>;
            readers: Array<ApiRes.User.UserSummary>;
            openness: number;
            createUserNickname: string;
            createTime: number;
        }

        export interface NoteProjectDetail {
            projectName: string;
            owners: number[];
            readers: number[];
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

        export interface ListProjectsAPI {
            noteProjects: Array<NoteProject>;
        }

        export interface AddProjectAPI {
            id: number;
        }

        export type GetProjectDetailAPI = NoteProjectDetail;

        export interface GetNoteTextAPI {
            text: string;
        }

        export interface AddNoteFileAPI {
            id: number;
        }

        export interface AddNoteFolderAPI {
            id: number;
        }
    }
}
