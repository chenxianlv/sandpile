<script setup lang="ts">
export interface TreeNode extends anyObj {
    fileId?: number;

    children?: Array<TreeNode>;
}

const props = defineProps<{ data: TreeNode[] }>();
const emit = defineEmits<{
    (e: 'fileChange', id: number): void;
}>();

const handleCurrentChange = (data: TreeNode) => {
    if (data.fileId === undefined) return;
    emit('fileChange', data.fileId);
};
</script>

<template>
    <el-tree
        :data="props.data"
        default-expand-all
        highlight-current
        @current-change="handleCurrentChange"
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
</template>

<style lang="less" scoped>
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
