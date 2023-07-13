<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Document, Folder } from '@element-plus/icons-vue';
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
    (e: 'contextMenuSelectChange', node?: TreeNode): void;
}>();

const handleCurrentChange = (data: TreeNode) => {
    if (data.id === undefined || !data.isFile) return;
    contextMenuState.visible = false;
    emit('fileChange', data.id);
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
