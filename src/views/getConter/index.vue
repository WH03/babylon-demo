<template>
    <div id="cesiumContainer">
        <canvas ref="canvasRef" class="canvas">111</canvas>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { BaseScene } from '@/utils/BaseScene.js';
import * as BABYLON from 'babylonjs'
import gsap from "gsap";

let baseScene;

const initOptions = {
    cameraParams: {
        alpha: 0, // 相机绕y轴旋转角度
        beta: Math.PI / 4, // 相机绕x轴旋转角度
        radius: 30, // 自定义相机距离
    },
};




onMounted(() => {
    baseScene = new BaseScene('.canvas', initOptions);
    baseScene.initAxesHelper();

    // 创建一个材质
    const yellowMaterial = new BABYLON.StandardMaterial('material', baseScene.scene)
    yellowMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0)


    // 创建大盒子
    var largeBox = BABYLON.MeshBuilder.CreateBox("largeBox", { height: 6, width: 2, depth: 1 }, baseScene.scene);

    // 创建小盒子
    var smallBox = BABYLON.MeshBuilder.CreateBox("smallBox", { height: 2, width: 1, depth: 0.5 }, baseScene.scene);
    // smallBox.position.y = 4; // 将小盒子放置在大盒子上方
    smallBox.position.y = largeBox.position.y + smallBox.position.y; // 将小盒子放置在大盒子上方

    smallBox.material = yellowMaterial;

    // 将小盒子设置为大盒子的子节点
    smallBox.parent = largeBox;
    console.log('@@@smallBox:', smallBox);

    console.log('@@@largeBox.position:', largeBox.position);






    // 假设你已经有一个 Mesh 对象，比如 myMesh
    let boundingInfo = largeBox.getBoundingInfo();
    let boundingSphere = boundingInfo.boundingSphere;

    // 包围球的中心点
    let center = boundingSphere.centerWorld;
    console.log('@@@center:', center);



    // 假设你已经加载了一个模型，并将其赋值给变量 `mesh`
    const mesh = baseScene.scene.getMeshByName("largeBox");
    // 获取模型的包围盒信息
    const boundingInfo2 = mesh.getBoundingInfo();

    // 获取包围盒的最小和最大向量
    const minimum = boundingInfo2.boundingBox.minimumWorld;
    const maximum = boundingInfo2.boundingBox.maximumWorld;

    // 计算中心点
    let center2 = BABYLON.Vector3.Center(minimum, maximum);

    console.log("模型中心点:2 ", center2);




    // gsap.to(largeBox.position, {
    //     x: 10,
    //     duration: 2,
    //     // repeat: 1,
    //     ease: "linear",
    //     onComplete: (value) => {
    //         console.log("动画完成:value", value);
    //         smallBox.parent = null;
    //         smallBox.position.x = 13;
    //         gsap.to(largeBox.position, {
    //             y: 5,
    //             duration: 2,
    //             // repeat: 1,
    //             ease: "linear",
    //             onComplete: () => {
    //                 console.log("动画完成");
    //                 // smallBox.parent = null;
    //             }
    //         })
    //     }
    // })






})



</script>

<style scoped lang="scss">
html,
body,
#cesiumContainer {
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


.btnBox {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 999;
}
</style>