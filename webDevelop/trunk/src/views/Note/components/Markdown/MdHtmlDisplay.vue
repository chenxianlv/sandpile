<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Menu } from '@element-plus/icons-vue';
import MarkdownMenuTree from '@/views/Note/components/Markdown/MdMenuTree.vue';
import MarkdownParser from '@/views/Note/components/Markdown/MdParser.vue';

const props = defineProps<{ markdownText?: string }>();

const markdownMenus = ref<string[]>([]);
const updateMarkdownMenus = (newVal: string[]) => {
    markdownMenus.value = newVal;
};

const containerRef = ref<HTMLDivElement | null>(null);
const containerRectInfo = ref<DOMRect | null>(null);
const updateContainerPosInfo = () => {
    if (containerRef.value) {
        containerRectInfo.value = containerRef.value.getBoundingClientRect();
    }
};

onMounted(() => {
    addEventListener('resize', updateContainerPosInfo);
    updateContainerPosInfo();
});
onUnmounted(() => {
    removeEventListener('resize', updateContainerPosInfo);
});

const menuContainerMarginTop = 16;
const menuContainerMarginBottom = 16;
const menuContainerTop = computed(() => {
    const rect = containerRectInfo.value;
    return rect ? rect.top + menuContainerMarginTop : 0;
});
const menuContainerHeight = computed(() => {
    const rect = containerRectInfo.value;
    return rect ? rect.height - menuContainerMarginTop - menuContainerMarginBottom : 0;
});
</script>

<template>
    <div class="md-html-display-container" ref="containerRef">
        <div class="html-wrapper">
            <MarkdownParser
                ref="parserRef"
                :markdownText="props.markdownText"
                :updateMenus="updateMarkdownMenus"
            />
        </div>
        <div class="menu-placeholder"></div>
        <div class="menu-container">
            <div class="menu-wrapper">
                <MarkdownMenuTree class="menu-tree" :menus="markdownMenus" :expand-level="3" />
            </div>
            <el-button type="primary" circle class="menu-switch-btn">
                <el-icon><Menu /></el-icon>
            </el-button>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import url('@/styles/variable.less');

.md-html-display-container {
    --menu-container-width: 200px;
    --menu-container-right-margin: 30px;

    height: 100%;
    overflow-x: hidden;

    display: flex;

    .html-wrapper {
        flex-grow: 1;
    }

    .menu-placeholder {
        height: 100%;
        width: calc(var(--menu-container-width, 0px) + var(--menu-container-right-margin, 0px));
        flex: none;
    }

    .menu-container {
        width: var(--menu-container-width, 0px);
        height: v-bind('menuContainerHeight + "px"');
        border: 1px solid @border-color-light;

        position: fixed;
        top: v-bind('menuContainerTop + "px"');
        right: var(--menu-container-right-margin, 0px);

        .menu-wrapper {
            height: 100%;
            width: 100%;
            overflow-x: visible;
            overflow-y: auto;

            .menu-tree {
                width: 100%;
            }
        }

        .menu-switch-btn {
            position: absolute;
            left: 0;
            top: 20px;
            transform: translateX(-100%);
            z-index: 10000;

            width: 36px;
            height: 32px;
            border-radius: $height * 0.5 0 0 $height * 0.5;
        }
    }
}
</style>
