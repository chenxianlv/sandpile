<!--<script setup lang="ts">-->
<!--import { ref, watch } from 'vue';-->
<!--import { debounce } from 'lodash-es';-->
<!--import MarkdownParser from '@/components/Markdown/MdParser.vue';-->

<!--const markdownText = ref(text);-->
<!--const textareaRef = ref<HTMLTextAreaElement>();-->
<!--const markdownMenus = ref<string[]>([]);-->

<!--const inputHandler = debounce(function () {-->
<!--    if (!textareaRef.value?.value) return;-->
<!--    markdownText.value = textareaRef.value.value;-->
<!--}, 200);-->

<!--const supportTab = (event: KeyboardEvent) => {-->
<!--    if (event.code !== 'Tab') return true;-->
<!--    event.preventDefault();-->
<!--    document.execCommand('insertText', false, '\t');-->
<!--};-->
<!--const updateMenu = (menus: string[]) => {-->
<!--    markdownMenus.value = menus;-->
<!--};-->

<!--watch(markdownMenus, () => {-->
<!--    console.log('changed');-->
<!--});-->
<!--</script>-->

<!--<template>-->
<!--    <a href="#实例属性">111</a>-->

<!--    <div class="content">-->
<!--        <textarea-->
<!--            ref="textareaRef"-->
<!--            class="el-textarea__inner"-->
<!--            @input="inputHandler"-->
<!--            @keydown.tab="supportTab"-->
<!--            :value="markdownText"-->
<!--            autocomplete="off"-->
<!--            autocapitalize="off"-->
<!--            spellcheck="false"-->
<!--            placeholder="输入原文"-->
<!--        ></textarea>-->
<!--        <div>-->
<!--            <MarkdownParser-->
<!--                :markdownText="markdownText"-->
<!--                :updateMenu="updateMenu"-->
<!--            />-->
<!--        </div>-->
<!--    </div>-->
<!--</template>-->

<!--&lt;!&ndash;<style src="./Markdown.less" scoped></style>&ndash;&gt;-->
