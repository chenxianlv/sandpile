<script setup lang="ts">
import { ref } from 'vue';
import { debounce } from 'lodash-es';

const props = defineProps<{
    modelValue: string;
    inputDebounce: number;
}>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'input'): void;
}>();

const textareaRef = ref<HTMLTextAreaElement>();

const inputHandler = debounce(function () {
    if (textareaRef.value?.value === undefined) return;
    emit('update:modelValue', textareaRef.value.value);
    emit('input');
}, props.inputDebounce);

const supportTab = (event: KeyboardEvent) => {
    if (event.code !== 'Tab') return true;
    event.preventDefault();
    document.execCommand('insertText', false, '\t');
};
</script>

<template>
    <textarea
        ref="textareaRef"
        class="el-textarea__inner"
        @input="inputHandler"
        @keydown.tab="supportTab"
        :value="props.modelValue"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        :placeholder="$t('note.inputMdText')"
    ></textarea>
</template>

<style lang="less" scoped>
textarea {
    outline: none;
    box-shadow: none;
    resize: none;
}
</style>
