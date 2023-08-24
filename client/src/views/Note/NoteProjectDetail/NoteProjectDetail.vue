<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { ElAside, UploadFile } from 'element-plus';
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
import { deleteNoteFileAPI, deleteNoteFolderAPI, uploadNoteFileAPI } from '@/api/note';
import MarkdownTextarea from '@/views/Note/components/Markdown/MdTextarea.vue';
import MdHtmlDisplay from '@/views/Note/components/Markdown/MdHtmlDisplay.vue';
import { useUserStore } from '@/stores/userStore';

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
const onUploadFile = async (uploadFile: UploadFile, hideContextMenu: () => void) => {
    hideContextMenu();
    try {
        if (!uploadFile.raw || uploadFile.size === undefined) throw new Error();

        const suffixIndex = acceptFileTypes.reduce((result, suffix) => {
            if (result !== -1) return result;
            const index = uploadFile.name.lastIndexOf(suffix);
            if (index !== -1 && index + suffix.length === uploadFile.name.length) {
                return index;
            }
            return result;
        }, -1);
        if (uploadFile.size >= 10 * 1024 * 1024) throw new Error('文件不得超过10MB');
        if (suffixIndex === -1) throw new Error('不支持该文件格式');

        const fileName = uploadFile.name.slice(0, suffixIndex);
        await uploadNoteFileAPI({
            file: uploadFile.raw,
            projectId: projectId,
            folderId: contextMenuSelectNode.value?.id ?? -1,
            name: fileName,
        });
        ElMessage.success(`上传文件 ${fileName} 成功`);

        await getData(projectId);
    } catch (e: any) {
        ElMessage.warning(e?.message ?? '未知错误');
    }
};

const isEditing = ref(false);
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
                                <li v-if="!data?.isFile" class="custom upload">
                                    <el-upload
                                        class="upload-btn"
                                        :on-change="
                                            (uploadFile) =>
                                                onUploadFile(uploadFile, hideContextMenu)
                                        "
                                        :auto-upload="false"
                                        :show-file-list="false"
                                        :accept="acceptFileTypes.join(',')"
                                    >
                                        <template #default> 上传文件</template>
                                    </el-upload>
                                </li>
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

.option-menu li.upload .upload-btn {
    width: 100%;
    height: 100%;

    /deep/ .el-upload {
        padding-left: @option-menu-item-indentation;
        width: 100%;
        height: 100%;
        justify-content: left;
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
