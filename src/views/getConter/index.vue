<template>
    <div id="container">
        <canvas ref="canvasRef" class="canvas">
        </canvas>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { BaseScene } from '@/utils/BaseScene.js';
import * as BABYLON from 'babylonjs'
import { Vector3 } from '@babylonjs/core';
import meshBoundingBoxInfo from '@/utils/MeshBoundingBox'//获取模型尺寸包围盒
import path from 'path';

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
        radius: 10, // 自定义相机距离
    },
};



onMounted(async () => {
    baseScene = new BaseScene(canvasRef.value, initOptions);
    baseScene.initAxesHelper();
    // baseScene.scene.debugLayer.show()

    // 创建一个材质
    const yellowMaterial = new BABYLON.StandardMaterial('material', baseScene.scene)
    yellowMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0)

    // let ratation = Math.PI / 2
    let ratation = 0


    let trayModel = await baseScene.createModel({
        name: 'tray',
        path: carModel,
        // path: terminal,
        path: modelUrl,
        position: { x: -1, y: 0, z: 1 },
    })


    let trayModelMesh = baseScene.scene.getMeshByID(trayModel.id);
    let trayModelPos = trayModelMesh.position;
    console.log('trayModelPos:', trayModelPos);

    const trayModelBoundingBoxInfo = meshBoundingBoxInfo(trayModelMesh);
    // console.log('trayModelBoundingBoxInfo:', trayModelBoundingBoxInfo);

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
            "",
            "3530009000191022140207",
            "3530009000191022140206",
            "3530009000191022140207",

            "3530009000191022140207",
            "3530009000191022140206",
            "3530009000191022140207",

            "3530009000191022140207",
            "3530009000191022140206",
            "3530009000191022140207",
        ],

        assetList2: [
            "",
            "",
            "3530009000191022140207",
            "3530009000191022140206",
        ],
        assetList3: [
            "3530009000191022140207",
            "3530009000191022140207",
            "3530009000191022140206",
        ],
        assetList4: [
            "3530009000191022140207",
            "3530009000191022140207",
        ],
        assetList5: [
            "3530009000191022140207",
        ],
        assetType: 1
    };

    // const modelSize = {
    //     width: 0.18,
    //     height: 0.096,
    //     depth: 0.26,
    // };

    const modelSize = {
        width: 0.112,
        height: 0.073,
        depth: 0.16,
    };

    const phaseMesh = {
        width: 0.112,
        height: 0.073,
        depth: 0.16,
    };

    // 假设每个小模型的尺寸
    const totalModels = obj.assetList.length;  // 三相表模型数量
    // const totalModels = obj.assetList2.length;  // 单相表模型数量
    let meterParams = {
        totalModels,
        containerModelPos:trayModelPos,
        // modelSize,
        phaseMesh,
        spacing: 0,
        assetType: obj.assetType,
        rotation: ratation
    }
    let positions = putMeterPos(meterParams)

    let arr = obj.assetList.slice().reverse()
    // let arr = obj.assetList2.slice().reverse()
    let phaseRotation = { x: 0, y: getRotationAngle(obj.meterDirection), z: 0 };// 电表方向
    // console.log('@@@phaseRotation:模型方向：', phaseRotation)

    // 输出每个小模型的位置
    let pos = trayModelPos.clone()
    arr.forEach((item, index) => {
        if (item.length > 0) {
            // console.log(`Model ${index + 1} positions:`, positions[index], '@@item:', item);
            let meter = baseScene.createModel({
                // name: item,
                path: singlePhase,
                rotation: phaseRotation,
                position: positions[index],

            });
            // let meter = baseScene.createModel({
            //     // path: threePhaseMeter,
            //     path: singlePhase,
            //     // rotation: { x: 0, y: Math.PI / 2, z: 0 },
            //     rotation: { x: 0, y: 0, z: 0 },
            //     position: positions[index],
            // });
        }
    })

})
/* 
     设置电表位置:
        totalModels: 4, 摆放数量
        containerModelPos: 摆放起始位置
        modelSize: { width: 0.1, height: 0.1, depth: 0.1 }, 模型大小
        spacing: 0.1, 模型间距
*/
// const putMeterPos = (params) => {
//     let { totalModels, containerModelPos, modelSize, spacing } = params
//     const layoutMap = { 4: { rows: 2, cols: 2 }, 12: { rows: 4, cols: 3 } };
//     const { rows, cols } = layoutMap[totalModels] || { rows: 2, cols: 2 };
//     // const rows = Math.ceil(Math.sqrt(totalModels));  // 行数，使用向上取整来确保有足够的行
//     // const cols = Math.ceil(totalModels / rows);     // 列数，计算每行的模型数量
//     const positions = [];   // 存储所有小模型位置的数组
//     for (let row = 0; row < rows; row++) {
//         for (let col = 0; col < cols; col++) {
//             // 计算每个小模型的相对位置
//             const x = (col - (cols - 1) / 2) * (modelSize.width + spacing); // 水平偏移，确保中心对齐
//             const y = 0;  // 垂直偏移：所有小模型在同一平面
//             const z = (row - (rows - 1) / 2) * (modelSize.depth + spacing); // 深度偏移，确保中心对齐

//             // 根据大模型的位置偏移小模型的坐标
//             const modelX = containerModelPos.x + x;  // 小模型的 X 坐标
//             const modelY = containerModelPos.y + y;  // 小模型的 Y 坐标
//             const modelZ = containerModelPos.z + z;  // 小模型的 Z 坐标

//             // 将计算出的坐标添加到位置数组
//             positions.push(new Vector3(modelX, modelY, modelZ));
//         }
//     }
//     return positions;
// }

// const putMeterPos = (params) => {
//     let { totalModels, containerModelPos, phaseMesh, spacing, assetType, rotation } = params

//     let rows, cols, positions = [],
//         chunkSize, chunkedArray = [];
//     if (totalModels == 4 && assetType == 3) { //三相表
//         rows = 2;
//         cols = 2;
//         chunkSize = 2
//     } else if (totalModels == 12 && assetType == 1) { //单相表
//         rows = 4;
//         cols = 3;
//         chunkSize = 3
//     } else {
//         rows = 2;
//         cols = 2;
//         chunkSize = 2
//     }

//     // 计算旋转矩阵（假设是绕Z轴旋转）
//     const cos = Math.cos(rotation);
//     const sin = Math.sin(rotation);

//     for (let row = 0; row < rows; row++) {
//         for (let col = 0; col < cols; col++) {
//             // 原始位置计算：以网格中心为参考点计算相对偏移
//             const xOffset = (col - (cols - 1) / 2) * (phaseMesh.width + spacing);
//             const yOffset = 0; // 高度不变，假设所有模型在同一平面
//             const zOffset = (row - (rows - 1) / 2) * (phaseMesh.depth + spacing);
//             // 只有在 rotation 不为 0 时才应用旋转
//             let xRotated = xOffset;
//             let zRotated = zOffset;

//             if (rotation !== 0) {
//                 // 旋转后的坐标
//                 xRotated = cos * xOffset - sin * zOffset;
//                 zRotated = sin * xOffset + cos * zOffset;
//             }

//             // 加上 containerModelPos 获取最终的 3D 坐标
//             const modelX = containerModelPos.x + xRotated;
//             const modelY = containerModelPos.y + yOffset;
//             const modelZ = containerModelPos.z + zRotated;

//             // 将位置添加到数组
//             positions.push(new Vector3(modelX, modelY, modelZ));
//         }
//     }

//     // 优化：批量分组并翻转
//     for (let i = 0; i < positions.length; i += chunkSize) {
//         chunkedArray.push(positions.slice(i, i + chunkSize).reverse());
//     }

//     // 优化：直接拼接数组，避免额外的合并操作
//     return [].concat(...chunkedArray);
// }

// const putMeterPos = (params) => {
//     let { totalModels, containerModelPos, phaseMesh, spacing, assetType, rotation } = params;

//     let rows, cols, positions = [],
//         chunkSize, chunkedArray = [];

//     // 根据 totalModels 和 assetType 设置网格布局
//     if (totalModels === 4 && assetType === 3) { // 三相表
//         rows = 2;
//         cols = 2;
//         chunkSize = 2;
//     } else if (totalModels === 12 && assetType === 1) { // 单相表
//         rows = 4;
//         cols = 3;
//         chunkSize = 3;
//     } else if (totalModels === 3) { // 3 个模型，居中排列
//         rows = 1;
//         cols = 3;
//         chunkSize = 3;
//     } else {
//         rows = 2;
//         cols = 2;
//         chunkSize = 2;
//     }

//     // 计算旋转矩阵（假设是绕 Z 轴旋转）
//     const cos = Math.cos(rotation);
//     const sin = Math.sin(rotation);

//     // 计算模型位置
//     for (let row = 0; row < rows; row++) {
//         for (let col = 0; col < cols; col++) {
//             // 原始位置计算：以网格中心为参考点计算相对偏移
//             const xOffset = (col - (cols - 1) / 2) * (phaseMesh.width + spacing);
//             const yOffset = 0; // 高度不变，假设所有模型在同一平面
//             const zOffset = (row - (rows - 1) / 2) * (phaseMesh.depth + spacing);

//             // 只有在 rotation 不为 0 时才应用旋转
//             let xRotated = xOffset;
//             let zRotated = zOffset;

//             if (rotation !== 0) {
//                 // 旋转后的坐标
//                 xRotated = cos * xOffset - sin * zOffset;
//                 zRotated = sin * xOffset + cos * zOffset;
//             }

//             // 加上 containerModelPos 获取最终的 3D 坐标
//             const modelX = containerModelPos.x + xRotated;
//             const modelY = containerModelPos.y + yOffset;
//             const modelZ = containerModelPos.z + zRotated;

//             // 将位置添加到数组
//             positions.push(new Vector3(modelX, modelY, modelZ));
//         }
//     }

//     // 优化：批量分组并翻转
//     for (let i = 0; i < positions.length; i += chunkSize) {
//         chunkedArray.push(positions.slice(i, i + chunkSize).reverse());
//     }

//     // 优化：直接拼接数组，避免额外的合并操作
//     return [].concat(...chunkedArray);
// };


const putMeterPos = (params) => {
    let { totalModels, containerModelPos, phaseMesh, spacing, assetType, rotation } = params;

    let rows, cols, positions = [], chunkSize, chunkedArray = [];

    // 根据 totalModels 和 assetType 设置网格布局
    if (totalModels === 4 && assetType === 3) { // 三相表
        rows = 2;
        cols = 2;
        chunkSize = 2;
    } else if (totalModels === 12 && assetType === 1) { // 单相表
        rows = 4;
        cols = 3;
        chunkSize = 3;
    } else if (totalModels === 3) { // 3 个模型，居中排列
        rows = 1;
        cols = 3;
        chunkSize = 3;
    } else if (totalModels === 2) { // 2 个模型，居中排列
        rows = 1;
        cols = 2;
        chunkSize = 2;
    } else if (totalModels === 1) { // 1 个模型，居中排列
        rows = 1;
        cols = 1;
        chunkSize = 1;
    } else {
        rows = 2;
        cols = 2;
        chunkSize = 2;
    }

    // 计算旋转矩阵（假设是绕 Z 轴旋转）
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);

    // 计算模型位置
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // 原始位置计算：以网格中心为参考点计算相对偏移
            const xOffset = (col - (cols - 1) / 2) * (phaseMesh.width + spacing);
            const yOffset = 0; // 高度不变，假设所有模型在同一平面
            const zOffset = (row - (rows - 1) / 2) * (phaseMesh.depth + spacing);

            // 只有在 rotation 不为 0 时才应用旋转
            let xRotated = xOffset;
            let zRotated = zOffset;

            if (rotation !== 0) {
                // 旋转后的坐标
                xRotated = cos * xOffset - sin * zOffset;
                zRotated = sin * xOffset + cos * zOffset;
            }

            // 加上 containerModelPos 获取最终的 3D 坐标
            const modelX = containerModelPos.x + xRotated;
            const modelY = containerModelPos.y + yOffset;
            const modelZ = containerModelPos.z + zRotated;

            // 将位置添加到数组
            positions.push(new Vector3(modelX, modelY, modelZ));
        }
    }

    // 优化：批量分组并翻转
    for (let i = 0; i < positions.length; i += chunkSize) {
        chunkedArray.push(positions.slice(i, i + chunkSize).reverse());
    }

    // 优化：直接拼接数组，避免额外的合并操作
    return [].concat(...chunkedArray);
};


/**
 * 根据电表方向获取旋转角度
 * @param {number} meterDirection - 电表方向，取值范围为 0 至 3。
 * @returns {number} 对应的旋转角度。如果输入值无效，返回默认角度 0。
 */
function getRotationAngle(meterDirection) {
    const rotations = [Math.PI, Math.PI / 2 * 3, 0, Math.PI / 2]; // 逆时针方向
    if (meterDirection >= 0 && meterDirection < rotations.length) {
        return rotations[meterDirection];
    } else {
        // 输入值无效时返回默认角度 0
        console.error('无效的方向值:', meterDirection);
        return 0;
    }
}



// const putMeterPos = (params) => {
//     let { totalModels, containerModelPos, modelSize, spacing, rotation } = params;

//     const layoutMap = { 4: { rows: 2, cols: 2 }, 12: { rows: 4, cols: 3 } };
//     const { rows, cols } = layoutMap[totalModels] || { rows: 2, cols: 2 };

//     const positions = []; // 存储模型的最终位置

//     // 计算旋转矩阵（假设是绕Z轴旋转）
//     const cos = Math.cos(rotation);
//     const sin = Math.sin(rotation);

//     // 遍历所有模型的位置
//     for (let row = 0; row < rows; row++) {
//         for (let col = 0; col < cols; col++) {
//             // 原始位置计算：以网格中心为参考点计算相对偏移
//             const xOffset = (col - (cols - 1) / 2) * (modelSize.width + spacing);
//             const yOffset = 0;  // 高度不变，假设所有模型在同一平面
//             const zOffset = (row - (rows - 1) / 2) * (modelSize.depth + spacing);

//             // 只有在 rotation 不为 0 时才应用旋转
//             let xRotated = xOffset;
//             let zRotated = zOffset;

//             if (rotation !== 0) {
//                 // 旋转后的坐标
//                 xRotated = cos * xOffset - sin * zOffset;
//                 zRotated = sin * xOffset + cos * zOffset;
//             }

//             // 加上 containerModelPos 获取最终的 3D 坐标
//             const modelX = containerModelPos.x + xRotated;
//             const modelY = containerModelPos.y + yOffset;
//             const modelZ = containerModelPos.z + zRotated;

//             // 将位置添加到数组
//             positions.push(new Vector3(modelX, modelY, modelZ));
//         }
//     }

//     return positions;
// }

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