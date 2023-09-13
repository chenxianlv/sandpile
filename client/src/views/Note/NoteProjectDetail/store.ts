import { defineStore } from 'pinia';
import type { FileTreeNode } from '@/views/Note/NoteProjectDetail/FileTree/types';
import {
    deleteNoteFileAPI,
    deleteNoteFolderAPI,
    getNoteTextAPI,
    getProjectDetailAPI,
    updateNoteFileAPI,
    updateNoteFileBeforeCloseAPI,
} from '@/api/note';
import { computed, onBeforeUnmount, reactive, ref, toRefs, watch } from 'vue';
import { useLoading } from '@/utils/hooks';
import { cloneDeep } from 'lodash-es';
import noteConfig from '@/config/note';
import beforeCloseAPI from '@/common/beforeCloseAPI';
import { ElMessage, ElMessageBox } from 'element-plus';
import { i18n } from '@/lang';
import TreeUtil from '@/utils/tree';
import { selectFile, selectFolder, uploadFolder, uploadSingleFile } from '@/views/Note/utils';

export interface NoteNode extends FileTreeNode {
    name: string;

    /**
     * 所属文件夹id，若在笔记项目根目录，则为-1
     */
    folderId: number;
    children: [];

    isFile: true;
}

interface FolderNode extends FileTreeNode {
    name: string;

    /**
     * 所属文件夹id，若在笔记项目根目录，则为-1
     */
    folderId: number;
    children: Array<ProjectTreeNode>;

    isFile: false;
}

export type ProjectTreeNode = NoteNode | FolderNode;

export const useNoteProjectDetailStore = defineStore('noteProjectDetail', function () {
    const state: {
        projectId?: number;
        projectDetail?: ApiRes.Note.NoteProjectDetail;
        projectTreeData: ProjectTreeNode[];
        rightClickNode?: ProjectTreeNode;
        showingNote?: NoteNode;
        showingText: string;
        noteTextCache: SimpleObj<string>;
        noteChangeCache: SimpleObj<string>;
        saveState: boolean;
        // 距离上次保存的时间，若为-1表示时间未知
        saveGapDuration: number;
        addFileDialogVisible: boolean;
        addFolderDialogVisible: boolean;
        renameDialogVisible: boolean;
        isEditing: boolean;
        activePanelTab: 'files';
    } = reactive({
        projectId: undefined,
        projectDetail: undefined,
        projectTreeData: [],
        rightClickNode: undefined,
        showingNote: undefined,
        showingText: '',
        noteTextCache: {},
        noteChangeCache: {},
        saveState: false,
        saveGapDuration: -1,
        addFileDialogVisible: false,
        addFolderDialogVisible: false,
        renameDialogVisible: false,
        isEditing: false,
        activePanelTab: 'files',
    });

    const {
        loading: pageLoading,
        startLoading: startPageLoading,
        stopLoading: stopPageLoading,
    } = useLoading();

    const {
        loading: saveLoading,
        startLoading: startSaveLoading,
        stopLoading: stopSaveLoading,
    } = useLoading();

    const saveDisabled = computed(() => {
        return Object.keys(state.noteChangeCache).length === 0;
    });

    // 节点所处文件夹的id
    const rightClickNodeParentId = computed(() => {
        const node = state.rightClickNode;
        if (!node) return -1;
        if (node.isFile) {
            return node.folderId;
        } else {
            return node.id;
        }
    });

    // 启动自动保存
    const intervalId = setInterval(saveChange, noteConfig.AUTO_SAVE_INTERVAL);
    onBeforeUnmount(() => {
        saveChange();
        clearInterval(intervalId);
    });

    // 当页面关闭时，发送未保存的请求
    let beforeCloseIdArr: number[] = [];
    watch(
        () => Object.keys(state.noteChangeCache).length,
        () => {
            beforeCloseIdArr.forEach((id) => beforeCloseAPI.off(id));
            beforeCloseIdArr = [];

            Object.keys(state.noteChangeCache).forEach((id) => {
                const beforeCloseId = updateNoteFileBeforeCloseAPI((send) => {
                    // 先删除文本 若保存失败再将文本还原，防止重复发出请求
                    const text = state.noteChangeCache[id];
                    delete state.noteChangeCache[id];
                    send({ id, text }).catch(() => {
                        state.noteChangeCache[id] = text;
                    });
                });
                beforeCloseIdArr.push(beforeCloseId);
            });
        },
        { immediate: true }
    );

    // 保存时间间隔处理
    const lastSaveTime = ref(-1);
    const updateDuration = () => {
        if (lastSaveTime.value === -1) {
            state.saveGapDuration = -1;
            return;
        }
        state.saveGapDuration = Date.now() - lastSaveTime.value;
    };
    watch(lastSaveTime, updateDuration);
    const timeUpdateIntervalId = setInterval(updateDuration, 1000);
    onBeforeUnmount(() => {
        clearInterval(timeUpdateIntervalId);
    });

    /**
     * 发出请求获取信息，可以重复调用刷新数据
     * @param cleanCache 若传入true，请求后清除已缓存的笔记文本信息
     */
    async function requestProjectDetail(cleanCache = false) {
        if (state.projectId === undefined) throw new Error();
        try {
            startPageLoading();
            const res = await getProjectDetailAPI({ id: state.projectId });
            if (cleanCache) {
                state.noteTextCache = {};
            }
            state.projectDetail = res.data.data;
            generateProjectTreeData();
        } finally {
            stopPageLoading();
        }
    }

    // 加工响应数据，生成树信息
    function generateProjectTreeData() {
        const detail = state.projectDetail;
        if (detail === undefined) return;

        const rootNode: ProjectTreeNode = {
            id: -1,
            folderId: -1,
            name: '',
            isFile: false,
            children: [],
            parent: null,
        };
        const folderNodes: Array<FolderNode> = [];

        // 创建所有文件夹节点
        detail.noteFolders?.forEach((item) => {
            folderNodes.push({
                name: item.name,
                id: item.id,
                folderId: item.folderId,
                children: [],
                isFile: false,
                parent: null,
            });
        });

        // 将文件或文件夹添加至目标文件夹，目标文件夹id若为-1，表示添加至根目录
        const appendToFolder = (node: ProjectTreeNode, targetFolderId: number) => {
            const parent =
                targetFolderId !== -1
                    ? folderNodes?.find?.((i) => i.id === targetFolderId)
                    : rootNode;
            if (!parent) {
                console.error('no parent');
                return;
            }
            TreeUtil.appendChild(parent, node);
        };

        folderNodes?.forEach((item) => {
            appendToFolder(item, item.folderId);
        });

        // 创建所有文件
        detail.notes?.forEach((item) => {
            const noteNode: NoteNode = {
                name: item.name,
                id: item.id,
                folderId: item.folderId,
                children: [],
                parent: null,
                isFile: true,
            };
            appendToFolder(noteNode, noteNode.folderId);
        });

        state.projectTreeData = sortProjectTreeData(rootNode).children;
    }

    // 对文件树根据文件名进行排序，返回副本
    function sortProjectTreeData(treeData: ProjectTreeNode) {
        const duplicate = cloneDeep(treeData);

        function sub(node: ProjectTreeNode) {
            node.children.sort(
                (a, b) =>
                    Number((a.isFile && !b.isFile) || a.name.toUpperCase() > b.name.toUpperCase()) -
                    1
            );
            node.children.forEach(sub);
        }

        sub(duplicate);
        return duplicate;
    }

    async function getNoteText(noteId: number) {
        const cacheText = state.noteTextCache[noteId];
        if (cacheText !== undefined) return Promise.resolve(cacheText);

        const res = await getNoteTextAPI({ id: noteId });
        const text = res.data.data.text;
        state.noteTextCache[noteId] = text;
        return text;
    }

    /**
     * 更新指定节点的文本
     */
    function setNoteText(id: number, text: string) {
        state.noteTextCache[id] = text;
        state.noteChangeCache[id] = text;
    }

    function saveChange() {
        if (Object.keys(state.noteChangeCache).length === 0) return;
        const promiseArr: Promise<any>[] = [];
        startSaveLoading();
        Object.keys(state.noteChangeCache).forEach((id) => {
            // 先删除文本 若保存失败再将文本还原，防止重复发出请求
            const text = state.noteChangeCache[id];
            delete state.noteChangeCache[id];
            promiseArr.push(
                updateNoteFileAPI({ id: Number(id), text }).catch((e) => {
                    state.noteChangeCache[id] = text;
                    return Promise.reject(e);
                })
            );
        });
        return Promise.allSettled(promiseArr)
            .then((resArr) => {
                state.saveState = resArr.every(({ status }) => status === 'fulfilled');
                lastSaveTime.value = Date.now();
            })
            .finally(() => {
                stopSaveLoading();
            });
    }

    const $t = i18n.global.t;

    const confirmAndDeleteNode = () => {
        const node = state.rightClickNode;
        if (node) {
            ElMessageBox({
                message: $t(node.isFile ? 'note.deleteFileConfirm' : 'note.deleteFolderConfirm', {
                    name: node?.name ?? '',
                }),
                title: $t(node.isFile ? 'note.deleteFile' : 'note.deleteFolder'),
                type: 'warning',
                confirmButtonText: $t('form.delete'),
                showCancelButton: true,
                cancelButtonText: $t('form.cancel'),
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        const promise = node.isFile
                            ? deleteNoteFileAPI({ id: node.id })
                            : deleteNoteFolderAPI({ id: node.id });
                        promise.then(() => {
                            // 判断是否需要关闭当前打开的笔记
                            if (
                                state.showingNote &&
                                // 删除的文件是正在打开的笔记
                                ((node.isFile && node.id === state.showingNote?.id) ||
                                    // 打开的笔记是被删除文件夹的后代
                                    (!node.isFile &&
                                        TreeUtil.findChild(
                                            node,
                                            (item) => item.id === state.showingNote?.id
                                        )))
                            ) {
                                state.showingNote = undefined;
                            }
                            done();
                            requestProjectDetail().then(() => {});
                        });
                    } else {
                        done();
                    }
                },
            }).then(() => {});
        }
    };

    const selectFileAndUpload = async () => {
        try {
            const file = await selectFile();
            if (!file || state.projectId === undefined) throw new Error();
            const fileName = await uploadSingleFile(
                file,
                state.projectId,
                rightClickNodeParentId.value
            );
            ElMessage.success($t('msg.uploadFileSuccessWithName', { name: fileName }));
        } catch (e: any) {
            ElMessage.warning(e?.message ?? $t('msg.unknownError'));
        } finally {
            await requestProjectDetail();
        }
    };

    const selectFolderAndUpload = async () => {
        try {
            const files = await selectFolder();
            if (!files || state.projectId === undefined) throw new Error();
            const folderName = await uploadFolder(
                files,
                state.projectId,
                rightClickNodeParentId.value
            );

            ElMessage.success(
                $t('msg.uploadFolderSuccessWithName', {
                    name: folderName,
                })
            );
        } catch (e: any) {
            ElMessage.warning(e?.message ?? $t('msg.unknownError'));
        } finally {
            await requestProjectDetail();
        }
    };

    return {
        ...toRefs(state),
        pageLoading,
        saveLoading,
        saveDisabled,
        rightClickNodeParentId,

        requestProjectDetail,
        getNoteText,
        setNoteText,
        saveChange,
        confirmAndDeleteNode,
        selectFileAndUpload,
        selectFolderAndUpload,
    };
});
