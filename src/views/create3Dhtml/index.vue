<template>
    <div id="container">
        <canvas ref="canvasRef" class="canvas">
        </canvas>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { BaseScene } from '@/utils/BaseScene.js';
import { Vector3, MeshBuilder, Animation, TransformNode, Color4 } from "babylonjs";
import { HtmlMeshRenderer, HtmlMesh } from "babylonjs-addons"



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


function createHtmlMeshFromTemplate(htmlContent, cssText, width = 4, height = 3, position = new Vector3(0, 0, 0)) {
    const htmlRenderer = new HtmlMeshRenderer(baseScene.scene);
    const htmlMesh = new HtmlMesh(baseScene.scene, "html-overlay-mesh",
        {
            captureOnPointerEnter: true,
            isCanvasOverlay: true,
        });
    const container = document.createElement('div');
    container.className = 'default-html';
    container.innerHTML = htmlContent;
    const style = document.createElement('style')
    style.textContent = cssText
    container.prepend(style)
    htmlMesh.setContent(container, width, height);
    htmlMesh.material.diffuseColor = new Color4.FromHexString('#0f1f42');

    htmlMesh.position = position;
    // ✅ 关键：始终面向摄像机
    htmlMesh.billboardMode = TransformNode.BILLBOARDMODE_ALL;
    console.log('@@htmlMesh:这是啥', htmlMesh.material)
    return htmlMesh;
}


function moveAnimate(mesh, from, to, duration = 1000, scene) {
    const frameRate = 60
    const totalFrames = (duration / 1000) * frameRate

    const animation = new Animation(
        'moveAnimation',
        'position',
        frameRate,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CYCLE
    )

    animation.setKeys([
        { frame: 0, value: from.clone() },
        { frame: totalFrames, value: to.clone() }
    ])

    mesh.animations = []
    mesh.animations.push(animation)

    scene.beginAnimation(mesh, 0, totalFrames, true)
}



onMounted(async () => {
    baseScene = new BaseScene(canvasRef.value, initOptions);
    baseScene.initAxesHelper();

    // 创建球
    const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2 }, baseScene.scene)
    sphere.position = new Vector3(0, 0, 0)
    // baseScene.scene.debugLayer.show()
    const htmlTemplate = `<div class='box'>
        是啥？
        </div>`;
    const cssText = `.box {
    font-size: 100px;
    color: white;
    padding: 20px;
    color:red;
    width: 100%;
    height: 100%;
    background-color: #0f1f42;
  }
`
    let html = createHtmlMeshFromTemplate(htmlTemplate, cssText, 4, 3, new Vector3(0, 5, 0));
    html.setParent(sphere)
    moveAnimate(sphere, sphere.position.clone(), new Vector3(0, 0, 5), 2000, baseScene.scene)





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