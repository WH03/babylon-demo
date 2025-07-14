<template>
    <div id="container">
        <canvas ref="canvasRef" class="canvas">
        </canvas>
    </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { BaseScene } from '@/utils/BaseScene.js';
import { Vector3, MeshBuilder, Animation, TransformNode, Color3, StandardMaterial, GlowLayer, SineEase, EasingFunction } from "babylonjs";


let baseScene;
let canvasRef = ref(null);
const modelUrl = '/models/tray.glb'; // 模型地址
const threePhaseMeter = '/models/threePhase.glb'; // 模型地址
const singlePhase = '/models/singlePhase.glb'; // 模型地址
const carModel = '/models/car.glb'; // 模型地址
const terminal = '/models/terminal.glb'; // 模型地址

const initOptions = {
    cameraParams: {
        alpha: 0, // 相机绕y轴旋转角度
        beta: Math.PI / 4, // 相机绕x轴旋转角度
        radius: 20, // 自定义相机距离
    },
};


onMounted(async () => {
    baseScene = new BaseScene(canvasRef.value, initOptions);
    baseScene.initAxesHelper();
    // 创建球
    const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2 }, baseScene.scene)
    sphere.position = new Vector3(0, 0, 0)
    // 创建材质
    const mat = new StandardMaterial("mat", baseScene.scene);
    mat.emissiveColor = new Color3(0, 1, 1);
    sphere.material = mat;

    const glow = new GlowLayer("glow", baseScene.scene, {
        intensity: 0.5, // 光晕强度
        blurKernelSize: 32, // 光晕模糊程度
    })

    // 创建一个用于动画效果的属性
    const emissiveStrength = {
        value: 1.0
    };
    const glowMask = emissiveStrength; // alias for semantic clarity 用于语义清晰性

    //光晕渲染遮罩逻辑
    glow.onBeforeRenderMeshToEffect.add(() => {
        glowMask.value = 1.0;
    });
    glow.onAfterRenderMeshToEffect.add(() => {
        glowMask.value = 0.0;
    });

    //动画发光强度（闪烁）
    const flickerAnim = new Animation("flickerAnim", "value", 60, Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE);

    const flickerKeys = [{
        frame: 0,
        value: 0
    },
    {
        frame: 30,
        value: 1
    },
    {
        frame: 60,
        value: 0
    }];

    flickerAnim.setKeys(flickerKeys);

    const easingFunction = new SineEase();
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    flickerAnim.setEasingFunction(easingFunction);

    baseScene.scene.beginDirectAnimation(emissiveStrength, [flickerAnim], 0, 170, true);

    baseScene.scene.registerBeforeRender(() => {
        mat.emissiveColor = new Color3(0, 1, 1).scale(emissiveStrength.value);
    });



})
</script>

<style scoped lang="scss">
html,
body,
#container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: relative;
}

canvas {
    width: 100%;
    height: 100%;
}


.ant-space {
    position: absolute;
    top: 10px;
    left: 10px;
}
</style>