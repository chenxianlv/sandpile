<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { ElAside } from 'element-plus';
import { ArrowLeftBold } from '@element-plus/icons-vue';
import { useNoteDetail } from '@/views/Note/NoteProjectDetail/hooks';
import MarkdownMenuTree from '@/views/Note/components/Markdown/MdMenuTree.vue';
import MarkdownParser from '@/views/Note/components/Markdown/MdParser.vue';
import FileTree from '@/views/Note/components/FileTree/FileTree.vue';
import type { TreeNode } from '@/views/Note/components/FileTree/FileTree.vue';
import VerticalSizeSash from '@/components/VerticalSizeSash/VerticalSizeSash.vue';
import { useLoading } from '@/utils/hooks';
import AddFileDialog from '@/views/Note/components/FileDialogs/AddFileDialog.vue';
import AddFolderDialog from '@/views/Note/components/FileDialogs/AddFolderDialog.vue';
import RenameTreeNodeDialog from '@/views/Note/components/FileDialogs/RenameTreeNodeDialog.vue';

window.location.hash = '';
let projectId = Number(useRoute().params.id?.[0]);

const { loading: parserLoading, startLoading, stopLoading } = useLoading();
const { noteTreeData, getData, getNoteText, responseData, pageLoading } = useNoteDetail(projectId);
const markdownText = ref<string>();
const markdownMenus = ref<string[]>([]);

const parserRef = ref(null);
const asideRef = ref<InstanceType<typeof ElAside> | null>(null);

const updateMarkdownMenus = (newVal: string[]) => {
    markdownMenus.value = newVal;
};

let showingNoteId: number;
const handleFileChange = (id: number) => {
    startLoading();
    if (showingNoteId === id) return;
    showingNoteId = id;
    getNoteText(id)
        .then((text: string) => {
            markdownText.value = text;
            activePanelTab.value = 'outline';
        })
        .finally(() => {
            stopLoading();
        });
};

let contextMenuSelectNode = ref<TreeNode | undefined>();
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
</script>

<template>
    <el-container v-loading="pageLoading">
        <el-header class="operation-bar">
            <el-button
                :icon="ArrowLeftBold"
                class="backBtn"
                circle
                @click="$router.push({ name: 'select' })"
            />
            <span class="project-name" v-if="responseData?.projectName !== undefined">
                {{ responseData?.projectName }}</span
            >
        </el-header>
        <el-main>
            <div v-if="isNaN(projectId)">404</div>
            <el-container class="container" v-else>
                <el-aside class="aside" ref="asideRef">
                    <el-menu
                        class="panel-tab"
                        mode="horizontal"
                        :ellipsis="false"
                        :default-active="activePanelTab"
                        @select="handlePanelTabSelect"
                    >
                        <el-menu-item index="file">文件</el-menu-item>
                        <el-menu-item index="outline">大纲</el-menu-item>
                    </el-menu>
                    <FileTree
                        class="tree"
                        v-show="activePanelTab === 'file'"
                        :data="noteTreeData"
                        @file-change="handleFileChange"
                        @context-menu-select-change="handleContextMenuSelectChange"
                    >
                        <template #context-menu="{ data, hideContextMenu }">
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
                                <li v-if="data">删除</li>
                            </ul>
                        </template>
                    </FileTree>
                    <MarkdownMenuTree
                        class="tree"
                        v-show="activePanelTab === 'outline'"
                        :menus="markdownMenus"
                        :expand-level="3"
                    />
                </el-aside>
                <VerticalSizeSash v-if="asideRef?.$el" :targetDOM="asideRef?.$el" />
                <el-main class="main" v-loading="parserLoading">
                    <el-empty v-if="markdownText === undefined" description="请选择笔记" />
                    <MarkdownParser
                        v-else
                        ref="parserRef"
                        :markdownText="markdownText"
                        :updateMenus="updateMarkdownMenus"
                    />
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
    background-color: rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;

    .backBtn {
        margin-left: 10px;
    }

    .project-name {
        margin-left: 10px;
        font-size: 16px;
        line-height: $font-size;
        color: @font-color-primary;
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
