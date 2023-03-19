<script setup lang="ts"></script>

<template>
    <router-view v-slot="{ Component }">
        <keep-alive exclude="NoteProjectDetail">
            <component :is="Component" />
        </keep-alive>
    </router-view>
</template>

<style scoped></style>
