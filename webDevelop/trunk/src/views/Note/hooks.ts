import { ref, watch } from 'vue';
import { getProjectDetailAPI } from '@/api/note';
import type { NormalResponse } from '@/common/axios';

export interface NoteProject {
    id: string;
    projectName: string;
}

export interface NoteInfo {
    id: number;
    name: string;
    path: string;
    text?: string;
}

interface NoteNode {
    name: string;
    noteId: number;
    text?: string;
}

interface FolderNode {
    name: string;
    children: Array<TreeNode>;
}

export type TreeNode = NoteNode | FolderNode;

export function useNoteDetail(projectId: string) {
    const noteInfoList = ref<NoteInfo[]>([]);
    const noteTreeData = ref<TreeNode[]>([]);

    if (projectId !== '') {
        getProjectDetailAPI({ id: Number(projectId) }).then(
            (res: NormalResponse) => {
                noteInfoList.value = res?.data?.data?.notes;
            }
        );
    }

    watch(noteInfoList, (newVal) => {
        const newData: TreeNode[] = [];
        newVal.forEach(({ id, name, path, text }) => {
            const folder = getFolder(path, newData);
            const noteNode = { name, noteId: id, text };
            if (!folder) {
                newData.push(noteNode);
            } else {
                folder.children.push(noteNode);
            }
        });
        noteTreeData.value = newData;
    });

    function getFolder(path: string, treeData: TreeNode[]) {
        if (path === '/') return;

        const splits = path.split('/');
        splits.shift();

        let children = treeData;
        let resultFolder: FolderNode;

        splits.forEach((folderName) => {
            let folderNode = children.find(
                (node) =>
                    !Object.prototype.hasOwnProperty.call(node, 'noteId') &&
                    node.name === folderName
            ) as FolderNode | undefined;

            if (!folderNode) {
                folderNode = { name: folderName, children: [] };
                const insertIndex = children.findIndex((node) =>
                    Object.prototype.hasOwnProperty.call(node, 'noteId')
                );
                // 将新创建的目录节点添加于所有笔记节点前
                children.splice(
                    insertIndex === -1 ? 0 : insertIndex,
                    0,
                    folderNode
                );
            }

            children = folderNode.children;
            resultFolder = folderNode;
        });

        // @ts-ignore
        return resultFolder;
    }

    /**
     * 获取指定节点的文本（有缓存机制）
     */
    function getNoteText(id: number) {
        const noteInfo = noteInfoList.value.find((info) => info.id === id);
        if (!noteInfo) return;
        if (noteInfo.text) return noteInfo.text;
    }

    return [noteTreeData, getNoteText];
}
