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
        position: { x: -1, y: 0, z: 0 },
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
    // let meterModelMesh = baseScene.scene.getMeshByID(meter.id);

    // 将小盒子设置为大盒子的子节点
    // smallBox.parent = model;

    const trayModelBoundingBoxInfo = meshBoundingBoxInfo(trayModelMesh);
    console.log('trayModelBoundingBoxInfo:', trayModelBoundingBoxInfo);

    // const meterModelBoundingBoxInfo = meshBoundingBoxInfo(meterModelMesh);
    // console.log('meterModelBoundingBoxInfo:', meterModelBoundingBoxInfo);




    let obj = {
        dataType: "box",
        start: "210119002000000144629",
        end: "210119002000000144629",
        meterDirection: 3,
        moveDirection: 0,
        endAssetNum: 0,
        time: 0,
        assetID: null,
        assetList: [
            "",
            "",
            "3530009000191022140207",
            "3530009000191022140206"
        ],
        assetType: 2
    };

    const spacing = 0.28;  // 小模型之间的间距
    const positions = [];   // 存储所有小模型位置的数组
    for (let row = 0; row < obj.assetList.length / 2; row++) { // 2 行
        for (let col = 0; col < obj.assetList.length / 2; col++) { // 每行 2 个模型
            // console.log("row", row);
            // console.log("col", col);

            const x = trayModelPos.x - (trayModelBoundingBoxInfo.width / 2) * col
            // console.log("x", x);
            const y = 0;
            const z = trayModelPos.z - (trayModelBoundingBoxInfo.depth / 2) * row
            // const x = (col - 0.5) * spacing;  // X 轴偏移：-0.5, 0.5 使它们对称
            // 计算每个小模型的相对位置
            // const x = (col - 0.5) * spacing;  // X 轴偏移：-0.5, 0.5 使它们对称
            // const y = 0;                    // 垂直偏移：所有小模型在同一平面
            // const z = (row - 0.5) * spacing;  // Z 轴偏移：-0.5, 0.5 使它们对称

            // // 根据大模型的位置偏移小模型的坐标
            // const modelX = trayModelPos.x + x;  // 小模型的 X 坐标
            // const modelY = trayModelPos.y + y;  // 小模型的 Y 坐标
            // const modelZ = trayModelPos.z + z;  // 小模型的 Z 坐标

            // 将计算出的坐标添加到位置数组
            // positions.push(new BABYLON.Vector3(modelX, modelY, modelZ));
            positions.push(new BABYLON.Vector3(x, y, z));
        }
    }
    console.log("positions", positions);


    // 输出每个小模型的位置
    positions.forEach((pos, index) => {
        console.log(`小模型 ${index + 1} 的位置:`, pos);
        // 创建小模型
        let meter = baseScene.createModel({
            path: threePhaseMeter,
            // scaling: { x: 0.5, y: 0.5, z: 0.5 },
            rotation: { x: 0, y: Math.PI / 2, z: 0 },
            position: pos,
        });
    });








    // // const largeModelPosition = [5, 2, 2];  // 大模型的位置
    // const totalModels = 4;  // 总共需要摆放的小模型数量
    // const spacing = 0.15;  // 间距
    // const modelPath = 'path_to_your_model';  // 小模型的路径

    // const smallModelsPositions = placeSmallModels(trayModelPos, totalModels, spacing, modelPath);

    // // 输出每个小模型的位置
    // smallModelsPositions.forEach((pos, index) => {
    //     console.log(`小模型 ${index + 1} 的位置:`, pos);

    //     // 创建小模型
    //     let meter = baseScene.createModel({
    //         path: threePhaseMeter,
    //         scaling: { x: 0.5, y: 0.5, z: 0.5 },
    //         rotation: { x: 0, y: Math.PI / 2, z: 0 },
    //         position: pos,
    //     });
    // });

})


// 创建一个方法来生成小模型的位置并摆放
function placeSmallModels(largeModelPosition, totalModels, spacing, modelPath) {
    const positions = [];  // 存储小模型位置的数组

    // 获取大模型的位置
    const { x, y, z } = largeModelPosition;

    // 确定行数和列数
    let numRows, numCols;

    // 判断需要摆放的模型数量
    if (totalModels === 12) {
        numRows = 4;  // 4行
        numCols = 3;  // 3列
    } else if (totalModels === 4) {
        numRows = 2;  // 2行
        numCols = 2;  // 2列
    } else {
        console.error("只支持摆放 4 或 12 个模型");
        return;
    }

    // 遍历每个小模型的位置并计算
    for (let row = 0; row < numRows; row++) {  // 控制行数
        for (let col = 0; col < numCols; col++) {  // 控制列数
            const index = row * numCols + col;
            if (index >= totalModels) break; // 如果已达到所需模型数量，跳出循环

            // 计算每个小模型的相对位置
            const smallX = (col - (numCols - 1) / 2) * spacing;  // 水平偏移：使得小模型在 X 轴对称
            const smallY = 0;  // Y 轴位置不变
            const smallZ = (row - (numRows - 1) / 2) * spacing;  // 深度偏移：使得小模型在 Z 轴对称

            // 计算小模型的绝对位置
            const modelX = x + smallX;  // 小模型的 X 坐标
            const modelY = y + smallY;  // 小模型的 Y 坐标
            const modelZ = z + smallZ;  // 小模型的 Z 坐标

            // 将位置保存为 BABYLON 的 Vector3 对象
            positions.push(new BABYLON.Vector3(modelX, modelY, modelZ));

            // 创建小模型
            // baseScene.createModel({
            //     path: threePhaseMeter,  // 模型文件路径
            //     scaling: { x: 0.4, y: 0.4, z: 0.4 },  // 缩放比例
            //     rotation: { x: 0, y: Math.PI / 2, z: 0 },  // 旋转角度
            //     position: new BABYLON.Vector3(modelX, modelY, modelZ),  // 位置
            // });
        }
    }

    // 返回小模型的位置数组（可选）
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