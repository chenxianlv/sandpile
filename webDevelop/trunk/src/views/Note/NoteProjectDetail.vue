<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useNoteDetail } from '@/views/Note/hooks';
import MarkdownMenu from '@/components/Markdown/MdMenuTree.vue';
import MarkdownParser from '@/components/Markdown/MdParser.vue';
import FileTree from '@/components/FileTree/FileTree.vue';
import VerticalSizeSash from '@/components/VerticalSizeSash/VerticalSizeSash.vue';

window.location.hash = '';
let projectId = useRoute().params.id;

if (projectId instanceof Array) {
    projectId = projectId[0];
}
const { noteTreeData, getNoteText } = useNoteDetail(projectId);
const markdownText = ref<string>();
const markdownMenus = ref<string[]>([]);

const parserRef = ref(null);
const asideRef = ref(null);

const updateMarkdownMenus = (newVal: string[]) => {
    markdownMenus.value = newVal;
};

// // 进入页面，组件渲染完成后，跳转到指定位置
// watch(parserRef, (newVal, oldVal) => {
//     if (oldVal === null) {
//         setTimeout(() => {
//             const hash = window.location.hash;

//             window.location.hash = hash;
//         }, 0);
//     }
// });

let showingNoteId: number;
const handleFileChange = (id: number) => {
    if (showingNoteId === id) return;
    showingNoteId = id;
    getNoteText(id).then((text: string) => {
        markdownText.value = text;
        activePanelTab.value = 'outline';
    });
};

const activePanelTab = ref<string>('file');
const handlePanelTabSelect = (tab: string) => {
    activePanelTab.value = tab;
};
</script>

<template>
    <div v-if="projectId === ''">404</div>
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
            />
            <MarkdownMenu
                class="tree"
                v-show="activePanelTab === 'outline'"
                :menus="markdownMenus"
                :expand-level="3"
            />
        </el-aside>
        <VerticalSizeSash v-if="asideRef?.$el" :targetDOM="asideRef?.$el" />
        <el-main class="main">
            <el-empty
                v-if="markdownText === undefined"
                description="请选择笔记"
            />
            <MarkdownParser
                v-else
                ref="parserRef"
                :markdownText="markdownText"
                :updateMenus="updateMarkdownMenus"
            />
        </el-main>
    </el-container>
</template>

<style lang="less" scoped>
.container {
    display: flex;
    height: 100%;
    padding: 0;
    justify-content: center;
    position: relative;

    .aside,
    .main {
        height: 100%;
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

//.main {
//}

.el-empty {
    margin-top: 100px;
}

//.md-edit,
//.md-detail {
//    box-sizing: border-box;
//    border: none;
//    height: 100%;
//    width: 300px;
//    flex-grow: 1;
//    overflow: auto;
//}
//
//.menu,
//.md-edit {
//}
//
//.md-edit {
//    outline: none;
//    box-shadow: none;
//}
</style>
