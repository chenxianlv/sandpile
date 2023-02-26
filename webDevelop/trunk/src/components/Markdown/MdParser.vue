<script lang="ts">
import type { FunctionalComponent } from 'vue';
import { parse } from './parser';

interface Props {
    markdownText: string;
    updateMenus?: (menus: string[]) => void;
}

let menusSave: string[];

const diff = (menus: string[]) => {
    let isDiff = true;
    if (menusSave) {
        isDiff = menus.some((menu, i) => menu !== menusSave[i]);
    }
    menusSave = menus;
    return isDiff;
};

const MarkdownParser: FunctionalComponent<Props> = (props, context) => {
    const { vnode, menus } = parse(props.markdownText);
    if (props.updateMenus && diff(menus)) props.updateMenus(menus);
    return vnode;
};

export default MarkdownParser;
</script>

<style src="@/styles/markdown/base.less" scoped></style>
<style src="@/styles/markdown/themes/vue.less" scoped></style>
<style src="@/styles/markdown/codemirror.less" scoped></style>
<style src="@/styles/markdown/custom.less" scoped></style>
