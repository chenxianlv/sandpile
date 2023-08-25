<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { ElAside } from 'element-plus';
import { ArrowLeftBold, CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue';
import { useNoteDetail, useNoteEdit } from '@/views/Note/NoteProjectDetail/hooks';
import FileTree from '@/views/Note/components/FileTree/FileTree.vue';
import type { TreeNode } from '@/views/Note/components/FileTree/FileTree.vue';
import VerticalSizeSash from '@/components/VerticalSizeSash/VerticalSizeSash.vue';
import { useLoading } from '@/utils/hooks';
import AddFileDialog from '@/views/Note/components/FileDialogs/AddFileDialog.vue';
import AddFolderDialog from '@/views/Note/components/FileDialogs/AddFolderDialog.vue';
import RenameTreeNodeDialog from '@/views/Note/components/FileDialogs/RenameTreeNodeDialog.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
    addNoteFolderAPI,
    deleteNoteFileAPI,
    deleteNoteFolderAPI,
    uploadNoteFileAPI,
} from '@/api/note';
import MarkdownTextarea from '@/views/Note/components/Markdown/MdTextarea.vue';
import MdHtmlDisplay from '@/views/Note/components/Markdown/MdHtmlDisplay.vue';
import { useUserStore } from '@/stores/userStore';
import $bus from '@/common/eventBus';

window.location.hash = '';
let projectId = Number(useRoute().params.id);

const {
    loading: parserLoading,
    startLoading: startParserLoading,
    stopLoading: stopParserLoading,
} = useLoading();
const { noteTreeData, getData, nodeChange, getNoteText, setNoteText, responseData, pageLoading } =
    useNoteDetail(projectId);
const markdownText = ref<string>('');

const asideRef = ref<InstanceType<typeof ElAside> | null>(null);

const showingNoteId = ref<number | null>(null);
watch(showingNoteId, (newId) => {
    if (newId === null) {
        markdownText.value = '';
        return;
    }
    startParserLoading();
    getNoteText(newId)
        .then((text: string) => {
            markdownText.value = text;
        })
        .finally(() => {
            stopParserLoading();
        });
});
const handleFileChange = (id: number) => {
    if (showingNoteId.value === id) return;
    showingNoteId.value = id;
};

const contextMenuSelectNode = ref<TreeNode>();
const contextMenuSelectNodeFolderId = computed(() => {
    const node = contextMenuSelectNode.value;
    if (node && !node.isFile) {
        return node.id;
    }
    return -1;
});
const handleContextMenuSelectChange = (node: TreeNode) => {
    contextMenuSelectNode.value = node;
};

const activePanelTab = ref<string>('file');
const handlePanelTabSelect = (tab: string) => {
    activePanelTab.value = tab;
};

type DialogVisibleState = {
    addFile: boolean;
    addFolder: boolean;
    rename: boolean;
};
const dialogVisibleState: DialogVisibleState = reactive({
    addFile: false,
    addFolder: false,
    rename: false,
});

const openDialog = (key: keyof DialogVisibleState, hideContextMenu: () => void) => {
    dialogVisibleState[key] = true;
    hideContextMenu();
};

const deleteNode = (hideContextMenu: () => void) => {
    const node: TreeNode = contextMenuSelectNode.value;
    if (node) {
        hideContextMenu();
        ElMessageBox({
            message: node.isFile
                ? `确认删除文件 ${node?.name} 吗？`
                : `确认删除文件夹 ${node?.name} ，以及该文件夹内的所有内容吗？`,
            title: node.isFile ? '删除文件' : '删除文件夹',
            type: 'warning',
            confirmButtonText: '删除',
            showCancelButton: true,
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    const promise = node.isFile
                        ? deleteNoteFileAPI({ id: node.id })
                        : deleteNoteFolderAPI({ id: node.id });
                    promise.then(() => {
                        console.log(node.isChildren(showingNoteId.value));
                        if (
                            (node.isFile && node.id === showingNoteId.value) ||
                            node.isChildren(showingNoteId.value)
                        ) {
                            showingNoteId.value = null;
                        }
                        done();
                        getData(projectId);
                    });
                } else {
                    done();
                }
            },
        });
    }
};

const acceptFileTypes = ['.txt', '.md'];
const uploadSingleFile = async (file?: File, folderId: number) => {
    if (!file) throw new Error();

    const suffixIndex = acceptFileTypes.reduce((result, suffix) => {
        if (result !== -1) return result;
        const index = file.name.lastIndexOf(suffix);
        if (index !== -1 && index + suffix.length === file.name.length) {
            return index;
        }
        return result;
    }, -1);
    if (file.size >= 10 * 1024 * 1024) throw new Error('文件不得超过10MB');
    if (suffixIndex === -1) throw new Error('不支持该文件格式');

    const fileName = file.name.slice(0, suffixIndex);
    await uploadNoteFileAPI({
        file,
        projectId: projectId,
        folderId,
        name: fileName,
    });
    return fileName;
};

const selectFileAndUpload = (hideContextMenu: () => void) => {
    hideContextMenu();

    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async () => {
        try {
            const fileName = await uploadSingleFile(
                input.files?.[0],
                contextMenuSelectNode.value?.id ?? -1
            );
            ElMessage.success(`上传文件 ${fileName} 成功`);
        } catch (e: any) {
            ElMessage.warning(e?.message ?? '未知错误');
        } finally {
            await getData(projectId);
        }
    };
    input.click();
};

const selectFolderAndUpload = (hideContextMenu: () => void) => {
    hideContextMenu();

    const input = document.createElement('input');
    input.type = 'file';
    input.directory = true;
    input.webkitdirectory = true;
    input.onchange = async () => {
        try {
            const files = input.files;
            if (!files) throw new Error();
            const folderIdMap: SimpleObj<number> = {};
            const uploadFilePromiseArr = [];

            for (const file of Object.values(files)) {
                const path = file.webkitRelativePath.split('/');
                let parentFolderId = contextMenuSelectNode.value?.id ?? -1;

                for (let i = 0; i < path.length; i++) {
                    const itemName = path[i];

                    if (i < path.length - 1) {
                        // 是文件夹

                        let folderId = folderIdMap[itemName];
                        if (folderId !== undefined) {
                            // 文件夹已被创建
                            parentFolderId = folderId;
                        } else {
                            // 文件夹未创建
                            const res = await addNoteFolderAPI({
                                name: itemName,
                                projectId,
                                folderId: parentFolderId,
                            });
                            folderId = res.data.data.id;
                            folderIdMap[itemName] = folderId;
                            parentFolderId = folderId;
                        }
                    } else {
                        // 是文件
                        uploadFilePromiseArr.push(uploadSingleFile(file, parentFolderId));
                    }
                }
            }
            const resArr = await Promise.allSettled(uploadFilePromiseArr);
            for (const res of resArr) {
                if (res.status === 'rejected') throw res.reason;
            }
            ElMessage.success(`上传文件夹 ${Object.keys(folderIdMap)[0] ?? ''} 成功`);
        } catch (e: any) {
            ElMessage.warning(e?.message ?? '未知错误');
        } finally {
            await getData(projectId);
        }
    };
    input.click();
};

const isEditing = ref(false);
watch(isEditing, () => {
    nextTick(() => {
        $bus.emit('manualResize');
    });
});
const mdTextAreaRef = ref<InstanceType<typeof MarkdownTextarea> | null>(null);

const {
    loading: mdSaveLoading,
    saveDisabled,
    onTextEdit,
    onSave,
    saveState,
    formattedTimeStr,
} = useNoteEdit();

const onTextareaInput = () => {
    if (showingNoteId.value !== null) {
        setNoteText(showingNoteId.value, markdownText.value);
        onTextEdit(showingNoteId.value, markdownText.value);
    }
};

const userStore = useUserStore();
const projectRequiredEditAuthList = computed(() => {
    const isOwner =
        userStore.id !== undefined &&
        (responseData.value?.owners?.some((owner) => owner.id === userStore.id) ?? false);
    return isOwner ? [20001] : [20002];
});
</script>

<template>
    <el-container v-loading="pageLoading">
        <el-header class="operation-bar">
            <div class="left">
                <el-button
                    :icon="ArrowLeftBold"
                    class="backBtn"
                    circle
                    @click="$router.push({ name: 'select' })"
                />
                <span class="project-name" v-if="responseData?.projectName !== undefined">
                    {{ responseData?.projectName }}</span
                >
            </div>
            <div class="right">
                <span
                    v-show="isEditing && formattedTimeStr !== ''"
                    :class="['save-status', saveState ? 'success' : 'failed']"
                >
                    <el-icon>
                        <CircleCheckFilled v-if="saveState" />
                        <CircleCloseFilled v-else />
                    </el-icon>
                    {{ '于 ' + formattedTimeStr + ' 保存' + (saveState ? '成功' : '失败') }}
                </span>
                <el-button
                    v-if="isEditing"
                    :disabled="saveDisabled"
                    :loading="mdSaveLoading"
                    @click="onSave"
                    >保存
                </el-button>
                <el-switch
                    :disabled="!userStore.authenticate(projectRequiredEditAuthList)"
                    v-model="isEditing"
                    active-text="编辑模式"
                    inactive-text="阅读模式"
                />
            </div>
        </el-header>
        <el-main>
            <el-container class="container">
                <el-aside class="aside" ref="asideRef">
                    <el-menu
                        class="panel-tab"
                        mode="horizontal"
                        :ellipsis="false"
                        :default-active="activePanelTab"
                        @select="handlePanelTabSelect"
                    >
                        <el-menu-item index="file">文件</el-menu-item>
                    </el-menu>
                    <FileTree
                        class="tree"
                        :data="noteTreeData"
                        :draggable="isEditing"
                        @select-change="handleFileChange"
                        @context-menu-select-change="handleContextMenuSelectChange"
                        @node-change="nodeChange"
                    >
                        <template #context-menu="{ data, hideContextMenu }" v-if="isEditing">
                            <ul class="option-menu">
                                <li
                                    v-if="!data?.isFile"
                                    @click="openDialog('addFile', hideContextMenu)"
                                >
                                    新建文件
                                </li>
                                <li
                                    v-if="!data?.isFile"
                                    @click="openDialog('addFolder', hideContextMenu)"
                                >
                                    新建文件夹
                                </li>
                                <li class="divider" v-if="!data?.isFile" />
                                <li
                                    v-if="!data?.isFile"
                                    @click="selectFileAndUpload(hideContextMenu)"
                                >
                                    上传文件
                                </li>
                                <li
                                    v-if="!data?.isFile"
                                    @click="selectFolderAndUpload(hideContextMenu)"
                                >
                                    上传文件夹
                                </li>
                                <li class="divider" v-if="!data?.isFile" />
                                <li v-if="data" @click="openDialog('rename', hideContextMenu)">
                                    重命名
                                </li>
                                <li v-if="data" @click="deleteNode(hideContextMenu)">删除</li>
                            </ul>
                        </template>
                    </FileTree>
                </el-aside>
                <VerticalSizeSash v-if="asideRef?.$el" :targetDOM="asideRef?.$el" />
                <el-main class="main" v-loading="parserLoading">
                    <el-empty v-if="showingNoteId === null" description="请选择笔记" />
                    <div class="detail-container" v-else>
                        <MarkdownTextarea
                            v-if="isEditing"
                            class="detail-item"
                            ref="mdTextAreaRef"
                            :input-debounce="200"
                            v-model="markdownText"
                            @input="onTextareaInput"
                        />
                        <VerticalSizeSash
                            v-if="mdTextAreaRef?.$el"
                            :targetDOM="mdTextAreaRef?.$el"
                            percentage-mode
                        />
                        <MdHtmlDisplay class="detail-item" :markdown-text="markdownText" />
                    </div>
                </el-main>
            </el-container>
        </el-main>
    </el-container>
    <AddFileDialog
        v-model="dialogVisibleState.addFile"
        :folderId="contextMenuSelectNodeFolderId"
        :projectId="projectId"
        @submit-success="getData(projectId)"
    />
    <AddFolderDialog
        v-model="dialogVisibleState.addFolder"
        :folderId="contextMenuSelectNodeFolderId"
        :projectId="projectId"
        @submit-success="getData(projectId)"
    />
    <RenameTreeNodeDialog
        v-model="dialogVisibleState.rename"
        :targetNode="contextMenuSelectNode"
        @submit-success="getData(projectId)"
    />
</template>

<style lang="less" scoped>
@import url('@/styles/variable.less');

.el-container {
    height: 100%;
}

.operation-bar {
    width: 100%;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.01);
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: space-between;

    > div {
        display: flex;
        align-items: center;
    }

    .left {
        .backBtn {
            margin-left: 15px;
        }

        .project-name {
            margin-left: 10px;
            font-size: 16px;
            line-height: $font-size;
            color: @font-color-primary;
        }
    }

    .right {
        padding: 0 20px;

        .save-status {
            display: flex;
            align-items: center;

            font-size: 13px;
            color: @font-color-secondary;

            &.failed {
                color: @font-color-danger-dark;
            }

            .el-icon {
                margin-right: 4px;
            }
        }

        > * {
            margin-left: 10px;
        }
    }
}

.container {
    display: flex;
    height: 100%;
    justify-content: center;
    position: relative;

    .aside,
    .main {
        height: 100%;
        background-color: #fff;

        .detail-container {
            width: 100%;
            height: 100%;
            display: flex;
            position: relative;

            > .detail-item {
                width: 50%;
                flex: auto;
                border-right: solid 1px @border-color-light;
            }

            > .detail-item:last-child {
                border-right: none;
            }
        }
    }

    .aside {
        flex-shrink: 0;
        box-sizing: border-box;
        width: 200px;
        overflow: auto;
        border-right: solid 1px #ccc;

        display: flex;
        flex-direction: column;

        .panel-tab {
            flex-grow: 0;
            flex-shrink: 0;

            .el-menu-item {
                flex-grow: 1;
                font-size: 15px;
                font-weight: 700;
            }
        }

        .tree {
            height: 200px;
            overflow: auto;
            flex-grow: 1;
        }
    }
}

.el-empty {
    margin-top: 100px;
}
</style>
