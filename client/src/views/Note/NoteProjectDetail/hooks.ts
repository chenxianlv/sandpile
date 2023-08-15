import { cloneDeep } from 'lodash-es';
import { onBeforeUnmount, reactive, ref, watch } from 'vue';
import {
    getNoteTextAPI,
    getProjectDetailAPI,
    updateNoteFileAPI,
    updateNoteFileBeforeCloseAPI,
} from '@/api/note';
import { useLoading } from '@/utils/hooks';
// @ts-ignore
import type { TreeNode } from '@/views/Note/components/FileTree/FileTree.vue';
import beforeCloseAPI from '@/common/beforeCloseAPI';
import noteConfig from '@/config/note';
import { timeToNowFormatter } from '@/utils/formatter';

export interface NoteProject {
    id: number;
    projectName: string;
    owners: number[];
    readers?: number[];
    openness: number;
    createUserName?: string;
    createTime: string;
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

    /**
     * 判断该节点是否有一个子孙节点，其id等于传入的id
     */
    isChildren: (targetId: number) => boolean;
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

    /**
     * 判断该节点是否有一个子孙节点，其id等于传入的id
     */
    isChildren: (targetId: number) => boolean;
}

export type TempTreeNode = NoteNode | FolderNode;

function isChildren(this: TreeNode, targetId: number): boolean {
    if (this.children === undefined) return false;
    return this.children.some(
        (node: TreeNode) => node.id === targetId || node.isChildren(targetId)
    );
}

export function useNoteDetail(projectId: number) {
    const responseData = ref<{
        notes?: NoteNode[];
        noteFolders?: FolderNode[];
        projectName?: string;
        owners?: number[];
        readers?: number[];
        openness?: number;
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
    async function getData(projectId: number, clearText = false) {
        try {
            const res = await getProjectDetailAPI({ id: Number(projectId) });
            if (clearText) {
                noteTextStorage.value = {};
            }
            responseData.value = res?.data?.data ?? {};
        } finally {
            stopLoading();
        }
    }

    getData(projectId).then(() => {});

    // 加工响应数据，生成树信息
    watch(
        responseData,
        (newVal) => {
            const { notes, noteFolders } = cloneDeep(newVal);
            const newTreeData: TempTreeNode[] = [];

            const tempArr: FolderNode[] = [];

            noteFolders?.forEach((item) => {
                item.children = [];
                item.isFile = false;
                item.isChildren = isChildren.bind(item);
                tempArr.push(item);
            });

            const getParentArr = (folderId: number) => {
                return folderId !== -1
                    ? tempArr?.find?.((i) => i.id === folderId)?.children
                    : newTreeData;
            };

            tempArr?.forEach((item) => {
                getParentArr(item.folderId)?.push(item);
            });

            notes?.forEach((item) => {
                item.isFile = true;
                item.isChildren = isChildren.bind(item);
                getParentArr(item.folderId)?.push(item);
            });

            noteTreeData.value = newTreeData;
            nodeSort();
        },
        { deep: true }
    );

    function nodeSort() {
        function sub(nodeArr: TempTreeNode[]) {
            nodeArr.forEach((node) => {
                // @ts-ignore
                if (node.children !== undefined) {
                    // @ts-ignore
                    node.children = sub(node.children);
                }
            });
            return nodeArr.sort(
                (a, b) =>
                    Number((a.isFile && !b.isFile) || a.name.toUpperCase() > b.name.toUpperCase()) -
                    1
            );
        }

        noteTreeData.value = cloneDeep(sub(noteTreeData.value));
    }

    /**
     * 用于手动变更节点对象
     */
    function nodeChange(id: number, isFile: boolean, mergeObj: AnyObj) {
        const arr = isFile ? responseData.value.notes : responseData.value.noteFolders;
        // @ts-ignore
        const nodeIndex = arr?.findIndex((node) => node.id === id);
        if (arr && nodeIndex !== -1 && nodeIndex !== undefined) {
            arr[nodeIndex] = { ...arr[nodeIndex], ...mergeObj };
        }
    }

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

    /**
     * 更新指定节点的文本（
     */
    function setNoteText(id: number, text: string) {
        noteTextStorage.value[id] = text;
    }

    return {
        noteTreeData,
        getNoteText,
        setNoteText,
        responseData,
        pageLoading,
        getData,
        nodeChange,
    };
}

export function useNoteEdit() {
    const { loading, startLoading, stopLoading } = useLoading();

    const changeMap: SimpleObj<string> = reactive({});
    const saveDisabled = ref(false);
    // 是否保存成功
    const saveState = ref(false);
    const lastSaveTime = ref(-1);

    watch(
        () => Object.keys(changeMap).length,
        (newVal) => {
            saveDisabled.value = newVal === 0;
        },
        { immediate: true }
    );

    function onTextEdit(fileId: number, newText: string) {
        changeMap[fileId] = newText;
    }

    function onSave() {
        if (Object.keys(changeMap).length === 0) return;
        const promiseArr: Promise<any>[] = [];
        startLoading();
        Object.keys(changeMap).forEach((id) => {
            // 先删除文本 若保存失败再将文本还原，防止重复发出请求
            const text = changeMap[id];
            delete changeMap[id];
            promiseArr.push(
                updateNoteFileAPI({ id, text }).catch((e) => {
                    changeMap[id] = text;
                    return Promise.reject(e);
                })
            );
        });
        return Promise.allSettled(promiseArr)
            .then((resArr) => {
                console.log(resArr);
                saveState.value = resArr.every(({ status }) => status === 'fulfilled');
                lastSaveTime.value = Date.now();
            })
            .finally(() => {
                stopLoading();
            });
    }

    const intervalId = setInterval(onSave, noteConfig.AUTO_SAVE_INTERVAL);
    onBeforeUnmount(() => {
        onSave();
        clearInterval(intervalId);
    });

    // 当页面关闭时，发送未保存的请求
    let beforeCloseIdArr: number[] = [];
    watch(
        () => Object.keys(changeMap).length,
        () => {
            beforeCloseIdArr.forEach((id) => beforeCloseAPI.off(id));
            beforeCloseIdArr = [];

            Object.keys(changeMap).forEach((id) => {
                const beforeCloseId = updateNoteFileBeforeCloseAPI((send) => {
                    // 先删除文本 若保存失败再将文本还原，防止重复发出请求
                    const text = changeMap[id];
                    delete changeMap[id];
                    send({ id, text }).catch(() => {
                        changeMap[id] = text;
                    });
                });
                beforeCloseIdArr.push(beforeCloseId);
            });
        },
        { immediate: true }
    );

    // 格式化时间字符串，如 xx秒前
    const formattedTimeStr = ref('');
    const updateTimeStr = () => {
        if (lastSaveTime.value === -1) {
            formattedTimeStr.value = '';
            return;
        }
        formattedTimeStr.value = timeToNowFormatter(lastSaveTime.value);
    };
    watch(lastSaveTime, updateTimeStr);
    const timeUpdateIntervalId = setInterval(updateTimeStr, 1000);
    onBeforeUnmount(() => {
        clearInterval(timeUpdateIntervalId);
    });

    return { loading, saveDisabled, onTextEdit, onSave, saveState, formattedTimeStr };
}
