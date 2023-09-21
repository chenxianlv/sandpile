<script setup lang="ts" generic="T extends FileTreeNode">
import { reactive, ref, useSlots } from 'vue';
import { Document, Folder } from '@element-plus/icons-vue';
import ContextMenu from '@/components/ContextMenu/ContextMenu.vue';
import { updateNoteFileAPI, updateNoteFolderAPI } from '@/api/note';
import type { FileTreeNode } from './types';

const props = withDefaults(
    defineProps<{
        data: T[];
        draggable?: boolean;
    }>(),
    {
        draggable: true,
    }
);
const emit = defineEmits<{
    (e: 'selectChange', data: T): void;
    (e: 'contextMenuSelectChange', node?: T): void;
    (e: 'nodeChange', id: number, isFile: boolean, mergeObj: SimpleObj<any>): void;
}>();
const slots = useSlots();

const handleCurrentChange = (data: T) => {
    contextMenuState.visible = false;
    emit('selectChange', data);
};

const contextMenuRef = ref<InstanceType<typeof ContextMenu> | null>(null);
const contextMenuState: {
    event?: MouseEvent;
    data?: T;
    visible: boolean;
} = reactive({
    event: undefined,
    data: undefined,
    visible: false,
});
const openContextMenu = (e: MouseEvent, data: T) => {
    if (slots['context-menu'] === undefined) return;
    contextMenuState.visible = true;
    contextMenuState.event = e;
    contextMenuState.data = data;
    emit('contextMenuSelectChange', data);
};
const openContextMenuInBlank = (e: MouseEvent) => {
    e.preventDefault();
    if (slots['context-menu'] === undefined) return;
    contextMenuState.visible = true;
    contextMenuState.event = e;
    contextMenuState.data = undefined;
    emit('contextMenuSelectChange');
};
const hideContextMenu = () => {
    contextMenuRef.value?.hide();
};

type DropHandler = (
    draggingNode: { data: T },
    dropNode: { data: T },
    type: 'prev' | 'inner' | 'next'
) => any;
const allowDrop: DropHandler = (draggingNode, dropNode, type) => {
    if (type === 'inner' && dropNode.data.isFile) {
        return false;
    }
    return true;
};
const handleNodeDrop: DropHandler = (draggingNode, dropNode, type) => {
    const newFolderId = type === 'inner' ? dropNode.data.id : dropNode.data.parent?.id ?? -1;

    const requestApi = draggingNode.data.isFile ? updateNoteFileAPI : updateNoteFolderAPI;
    requestApi({ id: draggingNode.data.id, folderId: newFolderId }).then(() => {});
};
// 实时将已展开的节点key同步至default-expanded-keys，防止添加笔记后重新获取data导致文件夹折叠状态重置
const defaultExpandedKeys = ref<Set<string>>(new Set());
</script>

<template>
    <div>
        <el-tree
            :data="props.data"
            :draggable="props.draggable"
            :allow-drop="allowDrop"
            node-key="nodeKey"
            :default-expanded-keys="Array.from(defaultExpandedKeys.values())"
            highlight-current
            @current-change="handleCurrentChange"
            @node-contextmenu="openContextMenu"
            @click.right="openContextMenuInBlank"
            @node-drop="handleNodeDrop"
            @node-expand="(node: T) => defaultExpandedKeys.add(node.nodeKey)"
            @node-collapse="(node: T) => defaultExpandedKeys.delete(node.nodeKey)"
            v-bind="$attrs"
        >
            <template #default="{ data }">
                <span class="tree-icon-label">
                    <el-icon>
                        <Document v-if="data?.isFile" />
                        <Folder v-else />
                    </el-icon>
                    <span>{{ data.name }}</span>
                </span>
            </template>
        </el-tree>
        <ContextMenu
            ref="contextMenuRef"
            v-model:visible="contextMenuState.visible"
            :click-event="contextMenuState.event"
            v-if="$slots['context-menu']"
        >
            <slot
                name="context-menu"
                :data="contextMenuState.data"
                :hideContextMenu="hideContextMenu"
            ></slot>
        </ContextMenu>
    </div>
</template>

<style lang="less" scoped>
.el-tree {
    width: 100%;
    height: 100%;
}

.tree-icon-label {
    display: flex;
    align-items: center;
    user-select: none;

    i {
        font-size: 15px;
        font-weight: 700;
        margin-right: 5px;
    }
}
</style>
