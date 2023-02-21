<script lang="ts">
import type { FunctionalComponent } from 'vue';
import { parse } from './parser';

interface Props {
    markdownText: string;
    updateMenu?: (menus: string[]) => void;
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

const MarkDownParser: FunctionalComponent<Props> = (props, context) => {
    const { vnode, menus } = parse(props.markdownText);
    if (props.updateMenu && diff(menus)) props.updateMenu(menus);
    return vnode;
};

export default MarkDownParser;
</script>

<style lang="less" scoped>
@bg-color: #ffffff;
@text-color: #333333;
@select-text-bg-color: #b5d6fc;
@select-text-font-color: auto;
@monospace: 'Lucida Console', Consolas, 'Courier', monospace;

#write {
    font-size: 1rem;
    background: inherit;
    background-color: @bg-color;
    color: @text-color;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    margin: 0;
    padding: 20px 30px 100px 30px;
    height: auto;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    line-height: 1.42857143;
    overflow-x: hidden;
    tab-size: 4;
}
</style>
<style src="@/styles/markdown/base.less" scoped></style>
<style src="@/styles/markdown/themes/vue.less" scoped></style>
<style src="@/styles/markdown/codemirror.less" scoped></style>
<style src="@/styles/markdown/custom.less" scoped></style>
