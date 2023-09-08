<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { ElAside } from 'element-plus';
import { ArrowLeftBold, CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue';
import FileTree from '@/views/Note/NoteProjectDetail/FileTree/FileTree.vue';
import VerticalSizeSash from '@/components/VerticalSizeSash/VerticalSizeSash.vue';
import { useLoading } from '@/utils/hooks';
import AddFileDialog from '@/views/Note/NoteProjectDetail/Dialogs/AddFileDialog.vue';
import AddFolderDialog from '@/views/Note/NoteProjectDetail/Dialogs/AddFolderDialog.vue';
import RenameNodeDialog from '@/views/Note/NoteProjectDetail/Dialogs/RenameNodeDialog.vue';
import MarkdownTextarea from '@/views/Note/NoteProjectDetail/Markdown/MdTextarea.vue';
import MdHtmlDisplay from '@/views/Note/NoteProjectDetail/Markdown/MdHtmlDisplay.vue';
import { useUserStore } from '@/stores/userStore';
import $bus from '@/common/eventBus';
import { i18n } from '@/lang';
import { AccessEnum } from '@/config/enum/access';
import { useNoteProjectDetailStore } from '@/views/Note/NoteProjectDetail/store';
import type { ProjectTreeNode } from '@/views/Note/NoteProjectDetail/store';
import { ClickMenu, ClickMenuItem, ClickMenuGroup } from '@/components/ClickMenu';

const $t = i18n.global.t;
window.location.hash = '';
const projectId = Number(useRoute().params.id);

const {
    loading: parserLoading,
    startLoading: startParserLoading,
    stopLoading: stopParserLoading,
} = useLoading();

const asideRef = ref<InstanceType<typeof ElAside> | null>(null);
const mdTextAreaRef = ref<InstanceType<typeof MarkdownTextarea> | null>(null);

const store = useNoteProjectDetailStore();
const {
    requestProjectDetail,
    getNoteText,
    setNoteText,
    saveChange,
    confirmAndDeleteNode,
    selectFileAndUpload,
    selectFolderAndUpload,
} = store;
store.projectId = projectId;
requestProjectDetail();

watch(
    () => store.showingNote,
    (note) => {
        if (note?.id === undefined) {
            store.showingText = '';
            return;
        }
        startParserLoading();
        getNoteText(note.id)
            .then((text: string) => {
                store.showingText = text;
            })
            .finally(() => {
                stopParserLoading();
            });
    }
);
const onSelectChange = (data: ProjectTreeNode) => {
    if (!data.isFile || store.showingNote?.id === data.id) return;
    store.showingNote = data;
};

const rightClickNodeFolderId = computed(() => {
    const node = store.rightClickNode;
    if (node && !node.isFile) {
        return node.id;
    }
    return -1;
});

const onPanelTabSelect = (tab: 'files') => {
    store.activePanelTab = tab;
};

watch(
    () => store.isEditing,
    () => {
        nextTick(() => {
            $bus.emit('manualResize');
        });
    }
);

const onMdTextareaInput = () => {
    if (store.showingNote !== undefined) {
        setNoteText(store.showingNote.id, store.showingText);
    }
};

const userStore = useUserStore();
const projectRequiredEditAuthList = computed(() => {
    const isOwner =
        userStore.id !== undefined &&
        (store.projectDetail?.owners?.some((owner) => owner.id === userStore.id) ?? false);
    return isOwner ? [AccessEnum.EDIT_OWNED_PROJECT] : [AccessEnum.EDIT_ALL_PROJECT];
});
</script>

<template>
    <el-container v-loading="store.pageLoading">
        <el-header class="operation-bar">
            <div class="left">
                <el-button
                    :icon="ArrowLeftBold"
                    class="backBtn"
                    circle
                    @click="$router.push({ name: 'select' })"
                />
                <span class="project-name" v-if="store.projectDetail?.projectName !== undefined">
                    {{ store.projectDetail?.projectName }}</span
                >
            </div>
            <div class="right">
                <span
                    v-show="store.isEditing && store.saveGapDuration !== -1"
                    :class="['save-status', store.saveState ? 'success' : 'failed']"
                >
                    <el-icon>
                        <CircleCheckFilled v-if="store.saveState" />
                        <CircleCloseFilled v-else />
                    </el-icon>
                    {{
                        $t('note.saveState', {
                            time: store.saveGapDuration,
                            state: store.saveState,
                        })
                    }}
                </span>
                <el-button
                    v-if="store.isEditing"
                    :disabled="store.saveDisabled"
                    :loading="store.saveLoading"
                    @click="saveChange"
                    >{{ $t('form.save') }}
                </el-button>
                <el-switch
                    :disabled="!userStore.authenticate(projectRequiredEditAuthList)"
                    v-model="store.isEditing"
                    :active-text="$t('note.editMode')"
                    :inactive-text="$t('note.readMode')"
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
                        :default-active="store.activePanelTab"
                        @select="onPanelTabSelect"
                    >
                        <el-menu-item index="files">{{ $t('note.files') }}</el-menu-item>
                    </el-menu>
                    <FileTree
                        class="tree"
                        :data="store.projectTreeData"
                        :draggable="store.isEditing"
                        @select-change="onSelectChange"
                        @context-menu-select-change="(node: ProjectTreeNode) => (store.rightClickNode = node)"
                    >
                        <template #context-menu="{ data, hideContextMenu }" v-if="store.isEditing">
                            <ClickMenu @before-item-click="hideContextMenu">
                                <ClickMenuGroup v-if="!data?.isFile">
                                    <ClickMenuItem @click="store.addFileDialogVisible = true">
                                        {{ $t('note.addFile') }}
                                    </ClickMenuItem>
                                    <ClickMenuItem @click="store.addFolderDialogVisible = true">
                                        {{ $t('note.addFolder') }}
                                    </ClickMenuItem>
                                </ClickMenuGroup>
                                <ClickMenuGroup v-if="!data?.isFile">
                                    <ClickMenuItem @click="selectFileAndUpload">
                                        {{ $t('note.uploadFile') }}
                                    </ClickMenuItem>
                                    <ClickMenuItem @click="selectFolderAndUpload">
                                        {{ $t('note.uploadFolder') }}
                                    </ClickMenuItem>
                                </ClickMenuGroup>
                                <ClickMenuGroup v-if="data">
                                    <ClickMenuItem @click="store.renameDialogVisible = true">
                                        {{ $t('form.rename') }}
                                    </ClickMenuItem>
                                    <ClickMenuItem @click="confirmAndDeleteNode">
                                        {{ $t('form.delete') }}
                                    </ClickMenuItem>
                                </ClickMenuGroup>
                            </ClickMenu>
                        </template>
                    </FileTree>
                </el-aside>
                <VerticalSizeSash v-if="asideRef?.$el" :targetDOM="asideRef?.$el" />
                <el-main class="main" v-loading="parserLoading">
                    <el-empty
                        v-if="store.showingNote === undefined"
                        :description="$t('note.selectNote')"
                    />
                    <div class="detail-container" v-else>
                        <MarkdownTextarea
                            v-if="store.isEditing"
                            class="detail-item"
                            ref="mdTextAreaRef"
                            :input-debounce="200"
                            v-model="store.showingText"
                            @input="onMdTextareaInput"
                        />
                        <VerticalSizeSash
                            v-if="mdTextAreaRef?.$el"
                            :targetDOM="mdTextAreaRef?.$el"
                            percentage-mode
                        />
                        <MdHtmlDisplay class="detail-item" :markdown-text="store.showingText" />
                    </div>
                </el-main>
            </el-container>
        </el-main>
    </el-container>
    <AddFileDialog
        v-model="store.addFileDialogVisible"
        :folderId="rightClickNodeFolderId"
        :projectId="projectId"
        @submit-success="requestProjectDetail()"
    />
    <AddFolderDialog
        v-model="store.addFolderDialogVisible"
        :folderId="rightClickNodeFolderId"
        :projectId="projectId"
        @submit-success="requestProjectDetail()"
    />
    <RenameNodeDialog
        v-model="store.renameDialogVisible"
        :targetNode="store.rightClickNode"
        @submit-success="requestProjectDetail()"
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
