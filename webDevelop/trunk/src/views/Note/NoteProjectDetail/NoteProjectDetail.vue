<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { ElAside } from 'element-plus';
import { ArrowLeftBold } from '@element-plus/icons-vue';
import { useNoteDetail, useNoteEdit } from '@/views/Note/NoteProjectDetail/hooks';
import FileTree from '@/views/Note/components/FileTree/FileTree.vue';
import type { TreeNode } from '@/views/Note/components/FileTree/FileTree.vue';
import VerticalSizeSash from '@/components/VerticalSizeSash/VerticalSizeSash.vue';
import { useLoading } from '@/utils/hooks';
import AddFileDialog from '@/views/Note/components/FileDialogs/AddFileDialog.vue';
import AddFolderDialog from '@/views/Note/components/FileDialogs/AddFolderDialog.vue';
import RenameTreeNodeDialog from '@/views/Note/components/FileDialogs/RenameTreeNodeDialog.vue';
import { ElMessageBox } from 'element-plus';
import { deleteNoteFileAPI, deleteNoteFolderAPI } from '@/api/note';
import MarkdownTextarea from '@/views/Note/components/Markdown/MdTextarea.vue';
import MdHtmlDisplay from '@/views/Note/components/Markdown/MdHtmlDisplay.vue';

window.location.hash = '';
let projectId = Number(useRoute().params.id?.[0]);

const {
    loading: parserLoading,
    startLoading: startParserLoading,
    stopLoading: stopParserLoading,
} = useLoading();
const { noteTreeData, getData, nodeChange, getNoteText, setNoteText, responseData, pageLoading } =
    useNoteDetail(projectId);
const markdownText = ref<string>();

const asideRef = ref<InstanceType<typeof ElAside> | null>(null);

let showingNoteId: number;
const handleFileChange = (id: number) => {
    startParserLoading();
    if (showingNoteId === id) return;
    showingNoteId = id;
    getNoteText(id)
        .then((text: string) => {
            markdownText.value = text;
        })
        .finally(() => {
            stopParserLoading();
        });
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

const addFileDialogVisible = ref(false);
const openAddFileDialog = (hideContextMenu: () => void) => {
    addFileDialogVisible.value = true;
    hideContextMenu();
};
const addFolderDialogVisible = ref(false);
const openAddFolderDialog = (hideContextMenu: () => void) => {
    addFolderDialogVisible.value = true;
    hideContextMenu();
};
const renameDialogVisible = ref(false);
const openRenameDialog = (hideContextMenu: () => void) => {
    renameDialogVisible.value = true;
    hideContextMenu();
};
const deleteNode = (hideContextMenu: () => void) => {
    const node = contextMenuSelectNode.value;
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

const isEditing = ref(false);
const mdTextAreaRef = ref<InstanceType<typeof MarkdownTextarea> | null>(null);

const { loading: mdSaveLoading, saveDisabled, onTextEdit, onSave } = useNoteEdit();
const onTextareaInput = () => {
    if (markdownText.value !== undefined) {
        setNoteText(showingNoteId, markdownText.value);
        onTextEdit(showingNoteId, markdownText.value);
    }
};
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
                <el-button
                    v-if="isEditing"
                    :disabled="saveDisabled"
                    :loading="mdSaveLoading"
                    @click="onSave"
                    >保存</el-button
                >
                <el-switch v-model="isEditing" active-text="编辑模式" inactive-text="阅读模式" />
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
                        @select-change="handleFileChange"
                        @context-menu-select-change="handleContextMenuSelectChange"
                        @node-change="nodeChange"
                    >
                        <template #context-menu="{ data, hideContextMenu }" v-if="isEditing">
                            <ul class="option-menu">
                                <li
                                    v-if="!data?.isFile"
                                    @click="openAddFileDialog(hideContextMenu)"
                                >
                                    新建文件
                                </li>
                                <li
                                    v-if="!data?.isFile"
                                    @click="openAddFolderDialog(hideContextMenu)"
                                >
                                    新建文件夹
                                </li>
                                <li v-if="data" @click="openRenameDialog(hideContextMenu)">
                                    重命名
                                </li>
                                <li v-if="data" @click="deleteNode(hideContextMenu)">删除</li>
                            </ul>
                        </template>
                    </FileTree>
                </el-aside>
                <VerticalSizeSash v-if="asideRef?.$el" :targetDOM="asideRef?.$el" />
                <el-main class="main" v-loading="parserLoading">
                    <el-empty v-if="markdownText === undefined" description="请选择笔记" />
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
                        />
                        <MdHtmlDisplay class="detail-item" :markdown-text="markdownText" />
                    </div>
                </el-main>
            </el-container>
        </el-main>
    </el-container>
    <AddFileDialog
        v-model="addFileDialogVisible"
        :folderId="contextMenuSelectNodeFolderId"
        :projectId="projectId"
        @submit-success="getData(projectId)"
    />
    <AddFolderDialog
        v-model="addFolderDialogVisible"
        :folderId="contextMenuSelectNodeFolderId"
        :projectId="projectId"
        @submit-success="getData(projectId)"
    />
    <RenameTreeNodeDialog
        v-model="renameDialogVisible"
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
