<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Document, Folder } from '@element-plus/icons-vue';
import ContextMenu from '@/components/ContextMenu/ContextMenu.vue';
import { updateNoteFileAPI, updateNoteFolderAPI } from '@/api/note';

export interface TreeNode extends AnyObj {
    id: number;

    /**
     * true表示是笔记文件，false表示是文件夹
     */
    isFile: boolean;

    children?: Array<TreeNode>;

    /**
     * 判断该节点是否有一个子孙节点，其id等于传入的id
     */
    isChildren: (targetId: number) => boolean;
}

const props = withDefaults(
    defineProps<{
        data: TreeNode[];
        draggable?: boolean;
    }>(),
    {
        draggable: true,
    }
);
const emit = defineEmits<{
    (e: 'selectChange', id: number): void;
    (e: 'contextMenuSelectChange', node?: TreeNode): void;
    (e: 'nodeChange', id: number, isFile: boolean, mergeObj: AnyObj): void;
}>();

const handleCurrentChange = (data: TreeNode) => {
    if (!data.isFile) return;
    contextMenuState.visible = false;
    emit('selectChange', data.id);
};

const contextMenuRef = ref<InstanceType<typeof ContextMenu> | null>(null);
const contextMenuState: {
    event?: MouseEvent;
    data?: TreeNode;
    visible: boolean;
} = reactive({
    event: undefined,
    data: undefined,
    visible: false,
});
const openContextMenu = (e: MouseEvent, data: TreeNode) => {
    contextMenuState.visible = true;
    contextMenuState.event = e;
    contextMenuState.data = data;
    emit('contextMenuSelectChange', data);
};
const openContextMenuInBlank = (e: MouseEvent) => {
    e.preventDefault();
    contextMenuState.visible = true;
    contextMenuState.event = e;
    contextMenuState.data = undefined;
    emit('contextMenuSelectChange');
};
const hideContextMenu = () => {
    contextMenuRef.value?.hide();
};
const allowDrop = (draggingNode: AnyObj, dropNode: AnyObj, type: string) => {
    if (type !== 'inner' && (dropNode.data.folderId !== -1 || draggingNode.data.folderId === -1)) {
        return false;
    } else if (type === 'inner' && dropNode.data.isFile) {
        return false;
    }
    return true;
};
const handleNodeDrop = (draggingNode: AnyObj, dropNode: AnyObj, type: string) => {
    const newFolderId = type === 'inner' ? dropNode.data.id : dropNode.data.folderId;
    emit('nodeChange', draggingNode.data.id, draggingNode.data.isFile, { folderId: newFolderId });

    const requestApi = draggingNode.data.isFile ? updateNoteFileAPI : updateNoteFolderAPI;
    requestApi({ id: draggingNode.data.id, folderId: newFolderId }).then(() => {});
};
</script>

<template>
    <div>
        <el-tree
            :data="props.data"
            :draggable="props.draggable"
            :allow-drop="allowDrop"
            node-key="id"
            default-expand-all
            highlight-current
            @current-change="handleCurrentChange"
            @node-contextmenu="openContextMenu"
            @click.right="openContextMenuInBlank"
            @node-drop="handleNodeDrop"
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
