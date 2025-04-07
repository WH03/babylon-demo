<template>
    <div id="container">
        <canvas ref="canvasRef" class="canvas">

        </canvas>
        <a-space class="btnBox">
            <a-button type="primary" @click="goGroup">分组</a-button>
            <a-button type="primary" @click="unGroup">解组</a-button>
        </a-space>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { BaseScene } from '@/utils/BaseScene.js';
import * as BABYLON from 'babylonjs'
import meshBoundingBoxInfo from '@/utils/MeshBoundingBox'//获取模型尺寸包围盒
import gsap from "gsap";

let baseScene;
const modelUrl2 = '/models/tray.glb'; // 模型地址
const initOptions = {
    cameraParams: {
        alpha: 0, // 相机绕y轴旋转角度
        beta: Math.PI / 4, // 相机绕x轴旋转角度
        radius: 50, // 自定义相机距离
    },
};
let smallBox, largeBox, model;

// 分组
const goGroup = () => {
    if (!smallBox.parent) {
        // smallBox.scaling.setAll(0.1);
        smallBox.parent = largeBox;
        smallBox.position.set(largeBox.position.x, largeBox.position.y, largeBox.position.z)
        // console.log('@@@model.position:', model.position);
    }
}
// 解组
const unGroup = () => {
    if (!smallBox.parent) return
    smallBox.parent = null;
    smallBox.scaling.setAll(1);
    smallBox.position.set(model.position.x, model.position.y, model.position.z)
    // console.log('@@@model.position:', model.position);
    // smallBox.position.y = 4; // 将小盒子放置在大盒子上方
    // console.log('@@@smallBox.position:', smallBox.position);
}


onMounted(async () => {
    baseScene = new BaseScene('.canvas', initOptions);
    baseScene.initAxesHelper();

    // 创建一个材质
    const yellowMaterial = new BABYLON.StandardMaterial('material', baseScene.scene)
    yellowMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0)

    // 创建大盒子
    largeBox = BABYLON.MeshBuilder.CreateBox("largeBox", { height: 6, width: 2, depth: 1 }, baseScene.scene);
    largeBox.position.set(0, 0, 0);

    // 使用示例
    // 假设您已经有一个 BABYLON.Mesh 对象
    // const mesh = baseScene.scene.getMeshByName('largeBox');

    // 调用函数获取边界信息
    // const boundingInfo = meshBoundingBoxInfo(mesh);
    // console.log('boundingInfo:', boundingInfo);

    let trayModel = await baseScene.createModel({
        path: modelUrl2,
        scaling: { x: 10, y: 10, z: 10 },
        position: { x: 0, y: 1, z: 0 },
    })

    // console.log('trayModel:', trayModel);
    
    model = baseScene.scene.getMeshByID(trayModel.id);

    // 创建小盒子
    smallBox = BABYLON.MeshBuilder.CreateBox("smallBox", { width: 2, height: 1, depth: 3 }, baseScene.scene);
    // smallBox.scaling.setAll(0.1);
    // smallBox.position.y = largeBox.position.y + smallBox.position.y; // 将小盒子放置在大盒子上方
    // smallBox.position.y = 4; // 将小盒子放置在大盒子上方

    smallBox.material = yellowMaterial;

    // 将小盒子设置为大盒子的子节点
    // smallBox.parent = model;

    const boundingInfo2 = meshBoundingBoxInfo(model);
    // console.log('boundingInfo2:', boundingInfo2);

    gsap.to(smallBox.position, {
        z: 30,
        duration: 5,
        repeat: -1,
        ease: "linear",
        onComplete: (value) => {
            console.log("动画完成:value", value);
        }
    })

    gsap.to([largeBox.position, model.position], {
        z: -20,
        duration: 5,
        repeat: -1,
        ease: "linear",
        onComplete: (value) => {
            console.log("动画完成:value", value);
        }
    })

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