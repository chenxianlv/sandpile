<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ParticleImageController from '@/views/3D/controllers/ParticleImageController';

type Controllers = ParticleImageController;

const options = [
    {
        name: ParticleImageController.controllerName,
        controller: ParticleImageController,
    },
];
const selectedControllerName = ref(options[0].name);
let currentControllerInstance: Controllers | undefined;

const displayCanvasRef = ref<HTMLCanvasElement | null>(null);
const guiContainerRef = ref<HTMLDivElement | null>(null);

const handleCurrentChange = (newVal: string) => {
    currentControllerInstance?.unmount();
    const newControllerConstructor = options.find((item) => item.name === newVal)?.controller;
    if (newControllerConstructor && displayCanvasRef.value && guiContainerRef.value) {
        currentControllerInstance = Reflect.construct(newControllerConstructor, [
            {
                canvas: displayCanvasRef.value,
                guiContainer: guiContainerRef.value,
            },
        ]);
        currentControllerInstance?.mount();
    }
};

onMounted(() => {
    handleCurrentChange(selectedControllerName.value);
});
</script>

<template>
    <el-container>
        <el-header class="demo-header">
            <span>DEMO：</span>
            <el-select v-model="selectedControllerName" @change="handleCurrentChange">
                <el-option
                    v-for="item in options"
                    :label="item.name"
                    :value="item.name"
                    :key="item.name"
                />
            </el-select>
        </el-header>
        <el-main class="demo-main">
            <canvas width="600" height="600" ref="displayCanvasRef"></canvas>
            <div class="gui-container" ref="guiContainerRef"></div>
        </el-main>
    </el-container>
</template>

<style lang="less" scoped>
.el-container {
    width: 600px + 10px + 300px;
    margin: 0 auto;
}

.demo-header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.demo-main {
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
