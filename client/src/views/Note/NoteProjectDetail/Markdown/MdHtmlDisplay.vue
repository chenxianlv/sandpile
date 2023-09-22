<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { Menu } from '@element-plus/icons-vue';
import MarkdownMenuTree from '@/views/Note/NoteProjectDetail/Markdown/MdMenuTree.vue';
import MarkdownParser from '@/views/Note/NoteProjectDetail/Markdown/MdParser.vue';
import $bus from '@/common/eventBus';

const props = defineProps<{ markdownText: string }>();

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
    $bus.on('manualResize', updateContainerPosInfo);
    updateContainerPosInfo();
});
onUnmounted(() => {
    removeEventListener('resize', updateContainerPosInfo);
    $bus.off('manualResize', updateContainerPosInfo);
});

const menuContainerMarginTop = 16;
const menuContainerMarginBottom = 16;
const menuContainerTop = computed(() => {
    const rect = containerRectInfo.value;
    return (rect ? rect.top + menuContainerMarginTop : 0) + 'px';
});
const menuContainerHeight = computed(() => {
    const rect = containerRectInfo.value;
    return (rect ? rect.height - menuContainerMarginTop - menuContainerMarginBottom : 0) + 'px';
});

const menuAutoCollapsedWidth = 930;
const menuAutoCollapsed = ref(false); // 用户不干涉的情况下，菜单应有的折叠状态
let menuAutoCollapsedLock = false;
const menuCollapsed = ref(false); // 实际折叠状态

watch(
    () => containerRectInfo.value?.width ?? 0,
    (newWidth) => {
        menuAutoCollapsed.value = newWidth <= menuAutoCollapsedWidth;
        if (!menuAutoCollapsedLock) menuCollapsed.value = menuAutoCollapsed.value;
    }
);

const handleCollapseBtnClick = () => {
    menuAutoCollapsedLock = menuCollapsed.value === menuAutoCollapsed.value;
    menuCollapsed.value = !menuCollapsed.value;
};
const toTop = () => {
    containerRef.value && (containerRef.value.scrollTop = 0);
};
defineExpose({
    toTop,
});
</script>

<template>
    <div class="md-html-display-container" ref="containerRef">
        <div class="html-wrapper">
            <MarkdownParser :markdownText="props.markdownText" :updateMenus="updateMarkdownMenus" />
        </div>
        <div :class="['menu-placeholder', { collapsed: menuCollapsed }]"></div>
        <div :class="['menu-container', { collapsed: menuCollapsed }]">
            <div class="menu-wrapper">
                <MarkdownMenuTree class="menu-tree" :menus="markdownMenus" :expand-level="3" />
            </div>
            <el-button
                type="primary"
                circle
                class="menu-switch-btn"
                @click="handleCollapseBtnClick"
            >
                <el-icon>
                    <Menu />
                </el-icon>
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
        max-width: 100%;
    }

    .menu-placeholder {
        height: 100%;
        width: calc(var(--menu-container-width, 0px) + var(--menu-container-right-margin, 0px));
        flex: none;
        transition: all 0.3s;

        &.collapsed {
            width: 0;
        }
    }

    .menu-container {
        width: var(--menu-container-width, 0px);
        height: v-bind(menuContainerHeight);
        border: 1px solid @border-color-light;
        background-color: #fff;

        position: fixed;
        top: v-bind(menuContainerTop);
        right: var(--menu-container-right-margin, 0px);

        transition: width 0.2s ease-out, border-width 0.2s ease-out, border-top 0.2s ease-out;

        &.collapsed {
            width: 0;
            border-width: 0;
            border-top: solid 1px transparent;

            .menu-switch-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
            }
        }

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
            transition: width 0.2s ease-out, height 0.2s ease-out, border-radius 0.2s ease-out;
        }
    }
}
</style>
