<template>
    <div id="cesiumContainer">
        <canvas ref="canvasRef">111</canvas>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
let canvasRef = ref(null)

import * as BABYLON from 'babylonjs'
import "babylonjs-loaders"
let engine, scene, canvas, camera
// let modelUrl = '/models/testModel.glb'
// let modelUrl = '/models/无标题.glb'
let modelUrl = '/models/雕刻单元-压缩.glb'

const initScene = () => {
    // 创建canvas
    canvas = document.querySelector('canvas')
    //创建引擎
    engine = new BABYLON.Engine(canvas, true)
    // 创建场景
    scene = new BABYLON.Scene(engine)
    // 创建相机
    camera = new BABYLON.ArcRotateCamera("camera", 0, Math.PI / 4, 60, BABYLON.Vector3.Zero(), scene)
    camera.attachControl(canvas, true) // 控制相机
}

const initLight = () => {
    const directionalLight = new BABYLON.DirectionalLight('directionalLight',
        new BABYLON.Vector3(-5, -5, 0),//方向
        scene
    )

    // 添加半球光
    const hemisphericLight = new BABYLON.HemisphericLight('hemisphereLight', new BABYLON.Vector3(0, 5, 0), scene)
}

const initRenderLoop = () => {
    engine.runRenderLoop(() => {
        scene.render()
    })
}

// 加载模型
const loadModel = async (modelUrl) => {
    const index = modelUrl.lastIndexOf("/")
    const rootUrl = modelUrl.substring(0, index + 1);
    const sceneFilename = modelUrl.substring(index + 1);
    let res = await BABYLON.SceneLoader.ImportMeshAsync(null,
        rootUrl, sceneFilename, scene)
    console.log('@@@res：', res)
}

onMounted(() => {
    initScene()
    initLight()
    initRenderLoop()
    loadModel(modelUrl)


})

// 监听窗口变化
window.addEventListener('resize', () => {
    if (engine) {
        engine.resize()
    }
});








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