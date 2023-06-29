<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import ParticleImageController from '@/views/3D/controllers/ParticleImageController';

const displayCanvasRef = ref<HTMLCanvasElement | null>(null);
let particleImageController: ParticleImageController;

onMounted(() => {
    if (displayCanvasRef.value) {
        particleImageController = new ParticleImageController(displayCanvasRef.value!);
        particleImageController.mount();
    }
});

onUnmounted(() => {
    particleImageController?.unmount();
});
</script>

<template>
    <el-container>
        <el-main>
            <canvas width="600" height="600" ref="displayCanvasRef"></canvas>
        </el-main>
    </el-container>
</template>

<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;

    canvas {
        background-color: #cccccc;
    }
}
</style>
