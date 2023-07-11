import { cloneDeep } from 'lodash-es';
import { ref, watch } from 'vue';
import type { NormalResponse } from '@/common/axios';
import { getNoteTextAPI, getProjectDetailAPI } from '@/api/note';
import { useLoading } from '@/utils/hooks';
// @ts-ignore
import type { TreeNode } from '@/views/Note/components/FileTree/FileTree.vue';

export interface NoteProject {
    id: number;
    projectName: string;
    createUserName?: string;
    createTime: string;
}

export interface NoteInfo {
    id: number;
    name: string;
    text?: string;
}

interface NoteNode extends TreeNode {
    id: number;
    name: string;

    /**
     * 所属文件夹id，若在笔记项目根目录，则为-1
     */
    folderId: number;
    text?: string;

    isFile: true;
}

interface FolderNode extends TreeNode {
    name: string;

    id: number;

    /**
     * 所属文件夹id，若在笔记项目根目录，则为-1
     */
    folderId: number;
    children: Array<TreeNode>;

    isFile: false;
}

export type TempTreeNode = NoteNode | FolderNode;

export function useNoteDetail(projectId: number) {
    const responseData = ref<{
        notes?: NoteNode[];
        noteFolders?: FolderNode[];
        projectName?: string;
    }>({});
    const noteTreeData = ref<TempTreeNode[]>([]);
    const noteTextStorage = ref<SimpleObj<string>>({});
    const { loading: pageLoading, startLoading, stopLoading } = useLoading();
    startLoading();

    /**
     * 发出请求获取信息，可以重复调用刷新数据
     * @param projectId
     * @param clearText 若传入true，请求后清除已缓存的笔记文本信息
     */
    function getData(projectId: number, clearText = false) {
        getProjectDetailAPI({ id: Number(projectId) })
            .then((res: NormalResponse) => {
                if (clearText) {
                    noteTextStorage.value = {};
                }
                responseData.value = res?.data?.data ?? {};
            })
            .finally(() => {
                stopLoading();
            });
    }

    getData(projectId);

    // 加工响应数据，生成树信息
    watch(
        responseData,
        (newVal) => {
            const { notes, noteFolders } = cloneDeep(newVal);
            const newTreeData: TempTreeNode[] = [];

            const getParentArr = (folderId: number) => {
                return folderId !== -1
                    ? noteFolders?.find?.((i) => i.id === folderId)?.children
                    : newTreeData;
            };

            noteFolders?.forEach((item) => {
                item.children = [];
                item.isFile = false;
                getParentArr(item.folderId)?.push(item);
            });

            notes?.forEach((item) => {
                item.isFile = true;
                getParentArr(item.folderId)?.push(item);
            });

            noteTreeData.value = newTreeData;
        },
        { deep: true }
    );

    /**
     * 获取指定节点的文本（有缓存机制）
     */
    async function getNoteText(id: number) {
        const text = noteTextStorage.value?.[id];
        if (text) return Promise.resolve(text);

        return getNoteTextAPI({ id }).then((res) => {
            const text = res?.data?.data?.text;
            if (text === undefined) return;
            noteTextStorage.value[id] = text;
            return text;
        });
    }

    return { noteTreeData, getNoteText, responseData, pageLoading, getData };
}
