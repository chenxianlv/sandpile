import { defineStore } from 'pinia';
import { listProjectsAPI } from '@/api/note';
import { clone } from 'lodash-es';
import dayjs from 'dayjs';

export interface NoteProjectRow extends ApiRes.Note.NoteProject {
    createTimeStr: string;
}

export const useNoteProjectSelectStore = defineStore('noteProjectSelect', {
    state: () => {
        const state: {
            noteProjects: NoteProjectRow[];
        } = {
            noteProjects: [],
        };

        return state;
    },
    actions: {
        listProjects() {
            listProjectsAPI().then((res) => {
                this.noteProjects = res.data.data.noteProjects.map((item) => {
                    const cloneItem = clone(item);
                    (cloneItem as NoteProjectRow).createTimeStr = dayjs(item.createTime).format(
                        'YYYY/MM/DD HH:mm:ss'
                    );
                    return cloneItem as NoteProjectRow;
                });
            });
        },
    },
});
