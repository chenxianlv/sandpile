<script setup lang="ts">
import { ref, watch } from 'vue';

type Props = {
    menus: string[];
    expandLevel: number;
};

interface Tree {
    id: number;
    label: string;
    level: number;
    parent: Tree | null;
    children?: Tree[];
}

const props = defineProps<Props>();

const treeData = ref<Tree[]>([]);
const expandedKeys = ref<number[]>([]);
let idCount = 1;

watch(() => props.menus, parseMenu, { immediate: true });

function parseMenu(menus: string[]) {
    const expandedIds: number[] = [];

    const newData: Tree[] = [];
    let preTree: Tree | null = null;

    menus.forEach((text) => {
        const match = text.match(/^(?<level>#+) (?<label>.*)$/);
        if (!match) throw new Error('format error');

        const level = match.groups?.level.length ?? 1;
        const label = match.groups?.label ?? '';
        let parent = null;

        if (preTree) {
            if (preTree.level < level) {
                parent = preTree;
            } else if (preTree.level === level) {
                parent = preTree.parent;
            } else {
                parent = preTree;
                while (parent && parent.level >= level) {
                    parent = parent.parent;
                }
            }
        }

        if (level < props.expandLevel) expandedIds.push(idCount);
        const tree: Tree = { id: idCount++, label, level, parent };

        if (!parent) {
            newData.push(tree);
        } else {
            if (parent.children) {
                parent.children.push(tree);
            } else {
                parent.children = [tree];
            }
        }

        preTree = tree;
        expandedKeys.value.push(...expandedIds);
    });
    treeData.value = newData;
}

function jump(data: Tree) {
    window.location.hash = '#' + data.label;
}
</script>

<template>
    <el-tree
        :data="treeData"
        :expand-on-click-node="false"
        :default-expanded-keys="expandedKeys"
        node-key="id"
        @node-click="jump"
    >
    </el-tree>
</template>

<style lang="less" scoped></style>
