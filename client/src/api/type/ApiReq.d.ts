declare namespace ApiReq {
    export namespace User {}
    export namespace Note {
        export interface AddProjectAPI {
            projectName: string;
            owners: number[];
            readers: number[];
            openness: number;
        }

        export interface UpdateProjectAPI {
            id: number;
            projectName?: string;
            owners?: number[];
            readers?: number[];
            openness?: number;
        }

        export interface DeleteProjectAPI {
            id: number;
        }

        export interface GetProjectDetailAPI {
            id: number;
        }

        export interface GetNoteTextAPI {
            id: number;
        }

        export interface AddNoteFileAPI {
            projectId: number;
            name: string;
            folderId: number;
        }

        export interface DeleteNoteFileAPI {
            id: number;
        }

        export interface UpdateNoteFileAPI {
            id: number;
            name?: string;
            folderId?: number;
            text?: string;
        }

        export interface AddNoteFolderAPI {
            projectId: number;
            name: string;
            folderId: number;
        }

        export interface DeleteNoteFolderAPI {
            id: number;
        }

        export interface UpdateNoteFolderAPI {
            id: number;
            name?: string;
            folderId?: number;
        }

        export interface UploadNoteFileAPI {
            projectId: number;
            name: string;
            folderId: number;
            file: File;
        }
    }
}
