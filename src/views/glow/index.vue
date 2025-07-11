<template>
    <div id="container">
        <canvas ref="canvasRef" class="canvas">
        </canvas>
    </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { BaseScene } from '@/utils/BaseScene.js';
import { Vector3, MeshBuilder, Animation, TransformNode, Color3, StandardMaterial } from "babylonjs";


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
    const mat = new StandardMaterial("mat", scene);
    mat.emissiveColor = new BABYLON.Color3(1, 1, 0);
    mat.diffuseColor = new BABYLON.Color3(1, 1, 0);
    sphere.material = mat;

    const glow = new GlowLayer("glow", baseScene.scene, {
        intensity: 0.5, // 光晕强度
        blurKernelSize: 64, // 光晕模糊程度
    })

    // Create a property to animate
    const emissiveStrength = {
        value: 1.0
    };
    const glowMask = emissiveStrength; // alias for semantic clarity

    // Glow render masking logic
    glow.onBeforeRenderMeshToEffect.add(() => {
        glowMask.value = 1.0;
    });
    glow.onAfterRenderMeshToEffect.add(() => {
        glowMask.value = 0.0;
    });

    // Animate emissive color intensity (flicker)
    const flickerAnim = new Animation("flickerAnim", "value", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    const flickerKeys = [{
        frame: 0,
        value: 0.2
    },
    {
        frame: 5,
        value: 0.8
    },
    {
        frame: 10,
        value: 0.1
    },
    {
        frame: 25,
        value: 0.8
    },
    {
        frame: 30,
        value: 0.05
    },
    {
        frame: 35,
        value: 0.7
    },
    {
        frame: 40,
        value: 0.3
    },
    {
        frame: 55,
        value: 0.5
    },
    {
        frame: 70,
        value: 0.35
    },
    {
        frame: 170,
        value: 1.0
    },
    ];

    flickerAnim.setKeys(flickerKeys);

    const easingFunction = new BABYLON.SineEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    flickerAnim.setEasingFunction(easingFunction);

    scene.beginDirectAnimation(emissiveStrength, [flickerAnim], 0, 170, true);

    // Update material based on animated value
    scene.registerBeforeRender(() => {
        mat.emissiveColor = new BABYLON.Color3(1, 0.4, 0).scale(emissiveStrength.value);
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


.default-html {
    width: 500px;
    height: 500px;
    background-color: red;
    // color: green;
    border: none;
}

.box {
    font-size: 100px !important;
}
</style>