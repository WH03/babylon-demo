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
import { Vector3 } from '@babylonjs/core';
import meshBoundingBoxInfo from '@/utils/MeshBoundingBox'//获取模型尺寸包围盒
import gsap from "gsap";

let baseScene;
let canvasRef = ref(null);
const modelUrl = '/models/tray.glb'; // 模型地址
const threePhaseMeter = '/models/threePhase.glb'; // 模型地址
const initOptions = {
    cameraParams: {
        alpha: 0, // 相机绕y轴旋转角度
        beta: Math.PI / 4, // 相机绕x轴旋转角度
        radius: 10, // 自定义相机距离
    },
};
let smallBox, largeBox, model;

// 分组
const goGroup = () => {
    if (!smallBox.parent) {
        smallBox.scaling.setAll(0.1);
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
    baseScene = new BaseScene(canvasRef.value, initOptions);
    baseScene.initAxesHelper();

    // 创建一个材质
    const yellowMaterial = new BABYLON.StandardMaterial('material', baseScene.scene)
    yellowMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0)



    let trayModel = await baseScene.createModel({
        path: modelUrl,
        // scaling: { x: 12, y: 12, z: 12 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        position: { x: -1, y: 0, z: 1 },
    })

    // console.log('@@@trayModel:', trayModel);

    // let meter = await baseScene.createModel({
    //     path: threePhaseMeter,
    //     scaling: { x: 0.4, y: 0.4, z: 0.4 },
    //     rotation: { x: 0, y: Math.PI / 2, z: 0 },
    //     position: { x: 0, y: 0, z: 0 },
    // })

    // console.log('trayModel:', trayModel);

    let trayModelMesh = baseScene.scene.getMeshByID(trayModel.id);
    let trayModelPos = trayModelMesh.position;
    console.log('trayModelPos:', trayModelPos);

    const trayModelBoundingBoxInfo = meshBoundingBoxInfo(trayModelMesh);
    console.log('trayModelBoundingBoxInfo:', trayModelBoundingBoxInfo);



    // let meterModelMesh = baseScene.scene.getMeshByID(meter.id);
    // const meterModelBoundingBoxInfo = meshBoundingBoxInfo(meterModelMesh);
    // console.log('meterModelBoundingBoxInfo:', meterModelBoundingBoxInfo);


    // const spacing = 0.25;  // 小模型之间的间距
    // const positions = [];   // 存储所有小模型位置的数组
    // for (let row = 0; row < obj.assetList.length / 2; row++) { // 2 行
    //     for (let col = 0; col < obj.assetList.length / 2; col++) { // 每行 2 个模型
    //         // console.log("row", row);
    //         // console.log("col", col);
    //         // console.log(' trayModelPos.x :', trayModelPos.x);
    //         // const x = trayModelPos.x - (trayModelBoundingBoxInfo.width / 2) * (col - 0.5);
    //         // const y = 0;
    //         // const z = trayModelPos.z - (trayModelBoundingBoxInfo.depth / 2) * (row - 0.5);
    //         // const x = (col - 0.5) * spacing;  // X 轴偏移：-0.5, 0.5 使它们对称  
    //         // 计算每个小模型的相对位置
    //         const x = (col - 0.5) * spacing;  // X 轴偏移：-0.5, 0.5 使它们对称
    //         const y = 0;                    // 垂直偏移：所有小模型在同一平面
    //         const z = (row - 0.5) * spacing;  // Z 轴偏移：-0.5, 0.5 使它们对称

    //         // 根据大模型的位置偏移小模型的坐标
    //         const modelX = trayModelPos.x + x;  // 小模型的 X 坐标
    //         const modelY = trayModelPos.y + y;  // 小模型的 Y 坐标
    //         const modelZ = trayModelPos.z + z;  // 小模型的 Z 坐标

    //         // 将计算出的坐标添加到位置数组
    //         positions.push(new BABYLON.Vector3(modelX, modelY, modelZ));
    //         // positions.push(new BABYLON.Vector3(x, y, z));
    //     }
    // }

    // let obj = {
    //     dataType: "box",
    //     start: "210119002000000144629",
    //     end: "210119002000000144629",
    //     meterDirection: 3,
    //     moveDirection: 0,
    //     endAssetNum: 0,
    //     time: 0,
    //     assetID: null,
    //     assetList: [
    //         "",
    //         "",
    //         "3530009000191022140207",
    //         "3530009000191022140206"
    //     ],
    //     assetType: 2
    // };


    // const spacing = 0.25;  // 小模型之间的间距
    // const positions = [];   // 存储所有小模型位置的数组
    // for (let row = 0; row < obj.assetList.length / 2; row++) { // 2 行
    //     for (let col = 0; col < obj.assetList.length / 2; col++) { // 每行 2 个模型
    //         // 计算每个小模型的相对位置
    //         const x = (col - 0.5) * spacing;  // X 轴偏移：-0.5, 0.5 使它们对称
    //         const y = 0;                    // 垂直偏移：所有小模型在同一平面
    //         const z = (row - 0.5) * spacing;  // Z 轴偏移：-0.5, 0.5 使它们对称

    //         // 根据大模型的位置偏移小模型的坐标
    //         const modelX = trayModelPos.x + x;  // 小模型的 X 坐标
    //         const modelY = trayModelPos.y + y;  // 小模型的 Y 坐标
    //         const modelZ = trayModelPos.z + z;  // 小模型的 Z 坐标
    //         // 将计算出的坐标添加到位置数组
    //         positions.push(new BABYLON.Vector3(modelX, modelY, modelZ));
    //     }
    // }

    // // 输出每个小模型的位置
    // positions.forEach((pos, index) => {
    //     // 创建小模型
    //     let meter = baseScene.createModel({
    //         path: threePhaseMeter,
    //         rotation: { x: 0, y: Math.PI / 2, z: 0 },
    //         position: pos,
    //     });
    // });

    let obj = {
        dataType: "box",
        start: "210119002000000144629",
        end: "210119002000000144629",
        meterDirection: 3,
        moveDirection: 0,
        endAssetNum: 0,
        time: 0,
        assetID: null,
        // assetList: [
        //     "",
        //     "",
        //     "",
        //     // "",
        //     // "3530009000191022140207",
        //     // "3530009000191022140206",
        //     // "3530009000191022140207",

        //     "3530009000191022140206",
        //     "3530009000191022140207",
        //     "3530009000191022140206",

        //     // "",
        //     // "",
        //     // "",
        //     "3530009000191022140207",
        //     "3530009000191022140206",
        //     "3530009000191022140207",

        //     "3530009000191022140206",
        //     "3530009000191022140207",
        //     "3530009000191022140206",
        // ],
        assetList: [
            "",
            "",
            "3530009000191022140206",
            "3530009000191022140207",
        ],
        assetType: 2
    };

    const modelSize = {
        width: 0.18,
        height: 0.096,
        depth: 0.26,
    }; // 假设每个小模型的尺寸
    const totalModels = obj.assetList.length;  // 小模型数量
    let meterParams = {
        totalModels,
        trayModelPos,
        modelSize,
        spacing: 0.05,
    }
    let positions = putMeterPos(meterParams)


    // 输出每个小模型的位置
    obj.assetList.forEach((item, index) => {
        if (item.length > 0) {
            console.log(`Model ${index + 1} positions:`, positions[index]);
            let meter = baseScene.createModel({
                path: threePhaseMeter,
                // rotation: { x: 0, y: Math.PI / 2, z: 0 },
                position: positions[index],
            });
        }
    })






    // 根据assetList.length创建相应数量的模型，并设置其位置，然后添加到场景中。在该数据中，assetList包含两个空元素和两个非空元素，因此会创建两个模型，并把前两个空元素的位置空出来。

})
/* 
     设置电表位置:
        totalModels: 4, 摆放数量
        trayModelPos: 摆放起始位置
        modelSize: { width: 0.1, height: 0.1, depth: 0.1 }, 模型大小
        spacing: 0.1, 模型间距
*/
const putMeterPos = (params) => {
    let { totalModels, trayModelPos, modelSize, spacing } = params
    const layoutMap = { 4: { rows: 2, cols: 2 }, 12: { rows: 4, cols: 3 } };
    const { rows, cols } = layoutMap[totalModels] || { rows: 2, cols: 2 };
    // const rows = Math.ceil(Math.sqrt(totalModels));  // 行数，使用向上取整来确保有足够的行
    // const cols = Math.ceil(totalModels / rows);     // 列数，计算每行的模型数量
    const positions = [];   // 存储所有小模型位置的数组
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // 计算每个小模型的相对位置
            const x = (col - (cols - 1) / 2) * (modelSize.width + spacing); // 水平偏移，确保中心对齐
            const y = 0;  // 垂直偏移：所有小模型在同一平面
            const z = (row - (rows - 1) / 2) * (modelSize.depth + spacing); // 深度偏移，确保中心对齐

            // 根据大模型的位置偏移小模型的坐标
            const modelX = trayModelPos.x + x;  // 小模型的 X 坐标
            const modelY = trayModelPos.y + y;  // 小模型的 Y 坐标
            const modelZ = trayModelPos.z + z;  // 小模型的 Z 坐标

            // 将计算出的坐标添加到位置数组
            positions.push(new Vector3(modelX, modelY, modelZ));
        }
    }
    return positions;
}

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