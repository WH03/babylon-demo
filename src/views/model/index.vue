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

onMounted(() => {
    // const canvas = canvasRef.value

    // 创建canvas
    const canvas = document.querySelector('canvas')
    // 设置canvas的宽高
    const canvasWidth = canvas.innerWidth;
    const canvasHeight = canvas.innerHight;

    //创建引擎
    const engine = new BABYLON.Engine(canvas, true)
    // 创建场景
    const scene = new BABYLON.Scene(engine)
    // 创建相机
    /* 
        参数：
        camera:相机名称
        alpha:相机绕y轴旋转的角度
        beta:相机绕x轴旋转的角度
        radius:相机距离目标点的距离
        target:相机目标点
    */
    const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene)
    // 设置相机的位置
    camera.setPosition(new BABYLON.Vector3(0, 5, -20))
    camera.attachControl(canvas, true)

    // 创建一个材质
    const material = new BABYLON.StandardMaterial('material', scene)
    material.diffuseColor = new BABYLON.Color3(1, 1, 0)



    // 创建地面
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, scene)
    // 创建平行光
    const directionalLight = new BABYLON.DirectionalLight('directionalLight',
        new BABYLON.Vector3(-5, -5, 0),//方向
        scene
    )

    let animate;
    //加载模型
    BABYLON.SceneLoader.Append(
        "models/", //模型路径
        "Horse.glb",//模型名称
        scene,//场景
        (gltf) => {
            //模型加载完成后的回调函数
            console.log('gltf:', gltf)
            animate = gltf.animationGroups[0]

            // 修改模型大小
            gltf.meshes.forEach((mesh) => {
                mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1); // 设置缩放比例
            });

            // 修改模型大小
            // gltf.forEach(mesh => {
            //     mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            // })
        }
    )

    window.addEventListener('click', () => {
        // 动画停止和播放
        // if (animate._isStarted) {
        //     animate.stop()
        // } else {
        //     animate.start()
        // }

        // 动画暂停和播放
        if (animate._isPaused) {
            animate.play()
        } else {
            animate.pause()
        }
    })

    // 渲染场景
    engine.runRenderLoop(() => {
        scene.render()
    })

    // 监听窗口变化
    window.addEventListener('resize', () => {
        engine.resize()
    });

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
    border: 1px solid red;
}


.btnBox {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 999;
}
</style>