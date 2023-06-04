<script setup lang="ts">
import { reactive } from 'vue';
import ContextMenu from '@/components/ContextMenu/ContextMenu.vue';

export interface TreeNode extends AnyObj {
    id?: number;

    /**
     * true表示是笔记文件，false表示是文件夹
     */
    isFile: boolean;

    children?: Array<TreeNode>;
}

const props = defineProps<{ data: TreeNode[] }>();
const emit = defineEmits<{
    (e: 'fileChange', id: number): void;
}>();

const handleCurrentChange = (data: TreeNode) => {
    if (data.id === undefined || !data.isFile) return;
    contextMenuState.visible = false;
    emit('fileChange', data.id);
};

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
};
const openContextMenuInBlank = (e: MouseEvent) => {
    console.log(e);
    e.preventDefault();
    contextMenuState.visible = true;
    contextMenuState.event = e;
    contextMenuState.data = undefined;
};
</script>

<template>
    <div>
        <el-tree
            :data="props.data"
            default-expand-all
            highlight-current
            @current-change="handleCurrentChange"
            @node-contextmenu="openContextMenu"
            @click.right="openContextMenuInBlank"
            v-bind="$attrs"
        >
            <template #default="{ data }">
                <span class="tree-icon-label">
                    <el-icon>
                        <Folder v-if="data.children?.length ?? 0 > 0" />
                        <Document v-else />
                    </el-icon>
                    <span>{{ data.name }}</span>
                </span>
            </template>
        </el-tree>
        <ContextMenu
            v-model:visible="contextMenuState.visible"
            :click-event="contextMenuState.event"
        >
            <slot name="context-menu" :data="contextMenuState.data"></slot>
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

    i {
        font-size: 15px;
        font-weight: 700;
        margin-right: 5px;
    }
}
</style>
