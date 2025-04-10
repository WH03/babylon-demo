<template>
    <div id="container">
        <canvas ref="canvasRef" class="canvas">

        </canvas>
        <!-- <a-space>
            <a-button type="primary" @click="goGroup">分组</a-button>
            <a-button type="primary" @click="unGroup">解组</a-button>
        </a-space> -->
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { BaseScene } from '@/utils/BaseScene.js';
import * as BABYLON from 'babylonjs'
import { Vector3, Mesh, AbstractMesh, TransformNode, Scene, MeshBuilder, StandardMaterial, Texture, PBRMaterial, Color3, CubeTexture, Material } from "babylonjs";
import meshBoundingBoxInfo from '@/utils/MeshBoundingBox'//获取模型尺寸包围盒
import gsap from "gsap";

type ThreeDimensional = {
    x: number,
    y: number,
    z: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)


let baseScene: BaseScene;
const modelUrl2 = '/models/tray.glb'; // 模型地址
const initOptions = {
    cameraParams: {
        alpha: 0, // 相机绕y轴旋转角度
        beta: Math.PI / 4, // 相机绕x轴旋转角度
        radius: 30, // 自定义相机距离,
        wheelPrecision: 30, // 鼠标滚轮精度
    },
};

let textUrl = ref<string>('/src/assets/texture/meterTexture.jpg');//保存文本url
const createTexture = (texturl: string) => {
    // 纹理贴图
    const textureMat = new StandardMaterial('standardMat', baseScene.scene!);
    textureMat.diffuseTexture = new Texture(texturl, baseScene.scene);
    textureMat.diffuseTexture.hasAlpha = true;//Have an alpha
    textureMat.backFaceCulling = false;//Show all the faces of the element
    return textureMat;
}

// 创建立方体
const createMeter = (name: string, position: ThreeDimensional, z: number, rotation: number, textureMat: Material) => {
    let box = MeshBuilder.CreateBox(`model${name}`, { width: 2, height: 2, depth: 2 }, baseScene.scene);
    box.rotation.y = rotation * Math.PI / 180;
    box.position = new Vector3(position.x, position.y, z);
    box.material = textureMat;
    return box;

}




// let meterBox = MeshBuilder.CreateBox("skyBox", { width: 1, height: 1, depth: 1 }, baseScene.scene);
// let cubeTextureMaterial = new StandardMaterial("skyBox", baseScene.scene);
// meterBox.position = new Vector3(0, 0, 0)

// cubeTextureMaterial.reflectionTexture = new CubeTexture("texture/cubeTexture2/", baseScene.scene);


// cubeTextureMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
// cubeTextureMaterial.disableLighting = true;
// meterBox.material = cubeTextureMaterial;

let meterDirection: number = 2;
let startPos: ThreeDimensional = { x: 0, y: 0, z: 0 };
let z: number = 0;
let rotation: number = 0;

/**
 * 根据电表方向获取旋转角度
 * @param {number} meterDirection - 电表方向，取值范围为 0 至 3。
 * @returns {number} 对应的旋转角度。如果输入值无效，返回默认角度 0。
 */
function getRotationAngle(meterDirection: number): number {
    const rotations = [180, 270, 0, 90];
    if (meterDirection >= 0 && meterDirection < rotations.length) {
        return rotations[meterDirection];
    } else {
        // 输入值无效时返回默认角度 0
        console.error('无效的方向值:', meterDirection);
        return 2;
    }
}







onMounted(async () => {
    baseScene = new BaseScene(canvasRef.value, initOptions);
    // baseScene.initAxesHelper();


    let textureMat = createTexture(textUrl.value);
    // switch (meterDirection) {//电表方向
    //     case 0:
    //         rotation = 180;
    //         break;
    //     case 1:
    //         rotation = 270;
    //         break;
    //     case 2:
    //         rotation = 0;
    //         break;
    //     case 3:
    //         rotation = 90;
    //         break;
    // }

    rotation = getRotationAngle(meterDirection);// 电表方向
    createMeter('box', startPos, z, rotation, textureMat)!;


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