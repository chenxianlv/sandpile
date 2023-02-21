<script setup lang="ts">
// import

// const handleSelect = () => {
//     console.log('send');
//     axios.post('/api/auth/login').then((res) => {
//         console.log(res);
//     });
// };
</script>

<template>
    <el-menu default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">学习笔记</el-menu-item>
        <el-menu-item index="2">Web 3D</el-menu-item>
    </el-menu>
</template>

<style scoped></style>
