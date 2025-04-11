<template>
    <div id="container">
        <canvas ref="canvasRef" class="canvas">

        </canvas>

    </div>
</template>

<script setup lang="ts">
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





onMounted(async () => {
    baseScene = new BaseScene(canvasRef.value, initOptions);
    baseScene.initAxesHelper();

    // 创建一个材质
    const yellowMaterial = new BABYLON.StandardMaterial('material', baseScene.scene)
    yellowMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0)



    let trayModel = await baseScene.createModel({
        path: modelUrl,
        position: { x: -1, y: 0, z: 1 },
    })


    console.log('trayModel:', trayModel);

    let trayModelMesh = baseScene.scene.getMeshByID(trayModel.id);
    let trayModelPos = trayModelMesh.position;
    console.log('trayModelPos:', trayModelPos);

    const trayModelBoundingBoxInfo = meshBoundingBoxInfo(trayModelMesh)!;
    console.log('trayModelBoundingBoxInfo:', trayModelBoundingBoxInfo);


    // 调用示例
    const layoutParams = {
        parentMesh: trayModelMesh,       // 父级大模型
        childTemplate: 'tray',        // 子模型模板
        spacingFactor: 1.5            // 1.5倍模型尺寸作为间距
    };

    const assetList = [
        "",
        "",
        "3530009000191022140207",
        "3530009000191022140206"
    ];

    // arrangeChildModels(layoutParams, assetList);

    let childSize = {
        width: 0.18,
        height: 0.096,
        depth: 0.26,
    }

    let params = {
        parentMesh: BABYLON.AbstractMesh,  // 父级模型
        // childTemplate;            // 子模型模板ID
        spacingFactor: 1.2      // 间距系数(基于子模型尺寸)
    }


    // 动态计算行列数
    const { rows, cols } = calculateGridDimensions(assetList.length);

    // 计算排列参数
    const layout = {
        totalWidth: trayModelBoundingBoxInfo.width * 0.8,  // 使用父模型80%宽度
        totalDepth: trayModelBoundingBoxInfo.depth * 0.8,  // 使用父模型80%深度
        startX: trayModelBoundingBoxInfo.centerPoint.x - trayModelBoundingBoxInfo.width * 0.4,
        startZ: trayModelBoundingBoxInfo.centerPoint.z - trayModelBoundingBoxInfo.depth * 0.4,
        colSpacing: childSize.width * params.spacingFactor,
        rowSpacing: childSize.depth * params.spacingFactor
    };


    const validAssets = assetList.filter(id => id && id.trim() !== '');
    if (validAssets.length === 0) return;

    // 生成网格位置
    let assetIndex = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (assetIndex >= validAssets.length) return;

            const xPos = layout.startX + col * layout.colSpacing;
            const zPos = layout.startZ + row * layout.rowSpacing;

            // createChildModel(
            //     validAssets[assetIndex],
            //     params.childTemplate,
            //     new BABYLON.Vector3(xPos, trayModelBoundingBoxInfo.centerPoint.y, zPos)
            // );

            let meter = baseScene.createModel({
                path: threePhaseMeter,
                scaling: { x: 0.5, y: 0.5, z: 0.5 },
                rotation: { x: 0, y: Math.PI / 2, z: 0 },
                position: { x: xPos, y: trayModelBoundingBoxInfo.centerPoint.y, z: zPos },
            });

            assetIndex++;
        }
    }


})



// 智能行列计算算法
const calculateGridDimensions = (count: number) => {
    // 专业级布局算法
    const sqrt = Math.sqrt(count);
    let rows = Math.floor(sqrt);
    let cols = Math.ceil(count / rows);

    // 优化方形布局
    while (rows * cols < count) {
        rows++;
        cols = Math.ceil(count / rows);
    }

    // 限制最大行列比不超过2:1
    if (rows / cols > 2) {
        rows = Math.ceil(count / cols);
    }

    return { rows, cols };
};




interface LayoutParams {
    parentMesh: BABYLON.AbstractMesh;  // 父级模型
    childTemplate: string;            // 子模型模板ID
    spacingFactor: number;      // 间距系数(基于子模型尺寸)
}

/**
 * 智能排列子模型
 * @param params 排列参数配置对象
 * @param assetList 资产列表
 */
function arrangeChildModels(params: LayoutParams, assetList: string[]) {
    // 过滤有效资产ID
    const validAssets = assetList.filter(id => id && id.trim() !== '');
    if (validAssets.length === 0) return;

    // 获取父模型边界信息
    const trayModelBoundingBoxInfo = gettrayModelBoundingBoxInfoInfo(params.parentMesh);
    if (!trayModelBoundingBoxInfo) return;

    // 获取子模型尺寸
    const childSize = getChildModelSize(params.childTemplate);
    if (!childSize) return;

    // 动态计算行列数
    const { rows, cols } = calculateGridDimensions(validAssets.length);

    // 计算排列参数
    const layout = {
        totalWidth: trayModelBoundingBoxInfo.width * 0.8,  // 使用父模型80%宽度
        totalDepth: trayModelBoundingBoxInfo.depth * 0.8,  // 使用父模型80%深度
        startX: trayModelBoundingBoxInfo.centerPoint.x - trayModelBoundingBoxInfo.width * 0.4,
        startZ: trayModelBoundingBoxInfo.centerPoint.z - trayModelBoundingBoxInfo.depth * 0.4,
        colSpacing: childSize.width * params.spacingFactor,
        rowSpacing: childSize.depth * params.spacingFactor
    };

    // 生成网格位置
    let assetIndex = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (assetIndex >= validAssets.length) return;

            const xPos = layout.startX + col * layout.colSpacing;
            const zPos = layout.startZ + row * layout.rowSpacing;

            createChildModel(
                validAssets[assetIndex],
                params.childTemplate,
                new BABYLON.Vector3(xPos, trayModelBoundingBoxInfo.centerPoint.y, zPos)
            );

            assetIndex++;
        }
    }
}

/** 核心工具方法 */
// 获取父模型边界信息
const gettrayModelBoundingBoxInfoInfo = (mesh: BABYLON.AbstractMesh) => {
    // mesh.refreshBoundingInfo(true);
    const bb = mesh.getBoundingInfo().boundingBox;
    return {
        width: bb.maximum.x - bb.minimum.x,
        depth: bb.maximum.z - bb.minimum.z,
        centerPoint: bb.center
    };
};

// 获取子模型尺寸（需根据项目实际实现）
const getChildModelSize = (templateId: string) => {
    // 示例：从预存配置获取或计算实际模型尺寸
    return { width: 1, depth: 1 };
};

// // 智能行列计算算法
// const calculateGridDimensions = (count: number) => {
//     // 专业级布局算法
//     const sqrt = Math.sqrt(count);
//     let rows = Math.floor(sqrt);
//     let cols = Math.ceil(count / rows);

//     // 优化方形布局
//     while (rows * cols < count) {
//         rows++;
//         cols = Math.ceil(count / rows);
//     }

//     // 限制最大行列比不超过2:1
//     if (rows / cols > 2) {
//         rows = Math.ceil(count / cols);
//     }

//     return { rows, cols };
// };

// // 创建子模型实例
// const createChildModel = (id: string, template: string, position: BABYLON.Vector3) => {
//     // 调用项目现有的模型克隆方法
//     // modelManager.copy({
//     //     id: `child_${id}`,
//     //     from: template,
//     //     animationDuration: 0,
//     //     position: position
//     // });
//     let meter = baseScene.createModel({
//         path: threePhaseMeter,
//         scaling: { x: 0.5, y: 0.5, z: 0.5 },
//         rotation: { x: 0, y: Math.PI / 2, z: 0 },
//         position: pos,
//     });
// };
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