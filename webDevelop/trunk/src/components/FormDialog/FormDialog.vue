<script setup lang="ts">
import { nextTick } from 'vue';
import { omit } from 'lodash-es';
import type { FormInstance, InputInstance, InputNumberInstance } from 'element-plus';
import { useLoading } from '@/utils/hooks';

const props = withDefaults(
    defineProps<{
        modelValue?: boolean;
        width?: string;
        formRef?: FormInstance;
        autoFocusRef?: InputInstance | InputNumberInstance;
        requestFn?: () => Promise<any>;
    }>(),
    {
        modelValue: false,
        width: '500px',
    }
);
const { loading: submitBtnLoading, startLoading, stopLoading } = useLoading();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'submitSuccess'): void;
}>();
const resetDialog = () => {
    nextTick(() => {
        props.formRef?.resetFields();
        props.autoFocusRef?.focus();
    });
};

const submit = () => {
    props.formRef?.validate((isValid) => {
        if (!isValid) return;
        if (props.requestFn) {
            startLoading();
            props
                .requestFn()
                .then(() => {
                    emit('submitSuccess');
                    emit('update:modelValue', false);
                })
                .catch(() => {})
                .finally(() => {
                    stopLoading();
                });
        }
    });
};
</script>

<template>
    <el-dialog
        :width="props.width"
        :modelValue="props.modelValue"
        @update:modelValue="(e:boolean) => emit('update:modelValue', e)"
        @open="resetDialog"
        align-center
        draggable
        append-to-body
    >
        <template #footer v-if="$slots.footer === undefined">
            <el-button @click="emit('update:modelValue', false)">取消</el-button>
            <el-button type="primary" @click="submit" :loading="submitBtnLoading">
                <slot name="submitBtnContent">确定</slot>
            </el-button>
        </template>
        <template #default v-if="$slots.footer === undefined">
            <slot name="default" :submit="submit"></slot>
        </template>
        <template
            v-for="(_, name) in omit($slots, ['submitBtnContent', 'default'])"
            :key="name"
            #[name]
        >
            <slot :name="name"></slot>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped></style>
