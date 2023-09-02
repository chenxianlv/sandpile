declare namespace ApiRes {
    export namespace User {
        export interface UserSummary {
            username: string;
            id: number;
        }
    }
    export namespace Note {
        export interface NoteProject {
            id: number;
            projectName: string;
            owners: Array<User.UserSummary>;
            readers: Array<User.UserSummary>;
            openness: number;
            createUsername: string;
            createTime: number;
        }

        export interface NoteProjectDetail {
            projectName: string;
            owners: Array<User.UserSummary>;
            readers: Array<User.UserSummary>;
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
