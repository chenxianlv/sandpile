<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import ParticleImageController from '@/views/3D/controllers/ParticleImageController';

const displayCanvasRef = ref<HTMLCanvasElement | null>(null);
const guiContainerRef = ref<HTMLDivElement | null>(null);
let particleImageController: ParticleImageController;

onMounted(() => {
    if (displayCanvasRef.value) {
        particleImageController = new ParticleImageController({
            canvas: displayCanvasRef.value!,
            guiContainer: guiContainerRef.value!,
        });
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
            <div class="gui-container" ref="guiContainerRef"></div>
        </el-main>
    </el-container>
</template>

<style lang="less" scoped>
main {
    display: flex;
    justify-content: center;

    canvas {
        background-color: #cccccc;
    }

    .gui-container {
        margin-left: 10px;
    }
}
</style>
