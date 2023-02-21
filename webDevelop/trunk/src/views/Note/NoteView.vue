<script setup lang="ts"></script>

<template>
    <el-container>
        <el-main class="main">
            <RouterView></RouterView>
        </el-main>
    </el-container>
</template>

<style scoped>
.main {
    width: 1000px;
    margin: 0 auto;
    background-color: rgba(0, 255, 102, 0.44);
    flex-grow: 0;
}
</style>
