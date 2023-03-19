import { ref, watch } from 'vue';
import type { NormalResponse } from '@/common/axios';
import { getNoteInfoAPI, getProjectDetailAPI } from '@/api/note';
import { useLoading } from '@/utils/hooks';
// @ts-ignore
import type { TreeNode } from '@/components/FileTree/FileTree.vue';

export interface NoteProject {
    id: number;
    projectName: string;
    createUserName?: string;
    createTime: string;
}

export interface NoteInfo {
    id: number;
    name: string;
    path: string;
    text?: string;
}

interface NoteNode extends TreeNode {
    name: string;
    fileId: number;
    text?: string;
}

interface FolderNode extends TreeNode {
    name: string;
    children: Array<TreeNode>;
}

export type TempTreeNode = NoteNode | FolderNode;

export function useNoteDetail(projectId: string) {
    const responseData = ref<anyObj>({});
    const noteInfoList = ref<NoteInfo[]>([]);
    const noteTreeData = ref<TempTreeNode[]>([]);
    const { loading: pageLoading, startLoading, stopLoading } = useLoading();
    startLoading();

    if (projectId !== '') {
        getProjectDetailAPI({ id: Number(projectId) })
            .then((res: NormalResponse) => {
                responseData.value = res?.data?.data ?? {};
                noteInfoList.value = res?.data?.data?.notes;
            })
            .finally(() => {
                stopLoading();
            });
    }

    watch(noteInfoList, (newVal) => {
        const newData: TempTreeNode[] = [];
        newVal.forEach(({ id, name, path, text }) => {
            const folder = getFolder(path, newData);
            const noteNode = { name, fileId: id, text };
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
                    !Object.prototype.hasOwnProperty.call(node, 'fileId') &&
                    node.name === folderName
            ) as FolderNode | undefined;

            if (!folderNode) {
                folderNode = { name: folderName, children: [] };
                const insertIndex = children.findIndex((node) =>
                    Object.prototype.hasOwnProperty.call(node, 'fileId')
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
    async function getNoteText(id: number) {
        const noteInfo = noteInfoList.value.find((info) => info.id === id);
        if (!noteInfo) return;
        if (noteInfo.text) {
            return noteInfo.text;
        } else {
            return getNoteInfoAPI({ id }).then((res) => {
                const text = res?.data?.data?.text;
                if (text === undefined) return;
                noteInfo.text = text;
                return text;
            });
        }
    }

    return { noteTreeData, getNoteText, responseData, pageLoading };
}
