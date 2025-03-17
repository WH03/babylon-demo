<template>
    <div id="cesiumContainer">
        <canvas ref="canvasRef">111</canvas>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
let canvasRef = ref(null)

import * as BABYLON from 'babylonjs'

console.log('@@@babylon', BABYLON)

onMounted(() => {
    // const canvas = canvasRef.value

    // 创建canvas
    const canvas = document.querySelector('canvas')
    console.log('canvas:', canvas)

    //创建引擎
    const engine = new BABYLON.Engine(canvas, true)
    console.log('engine:', engine)
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


    // 创建球
    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2 }, scene)
    sphere.material = material
    sphere.position.set(5, 1, -3)
    // 创建地面
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, scene)
    ground.receiveShadows = true
    // 创建平面
    const plane = BABYLON.MeshBuilder.CreatePlane('plane', { size: 10 }, scene)
    // 创建立方体
    const box = BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, scene)
    box.position = new BABYLON.Vector3(0, 0, -3)
    box.material = material

    // 创建圆柱体
    const cylinder = BABYLON.MeshBuilder.CreateCylinder('cylinder',
        { height: 5, diameter: 2 },//圆柱体的高度和直径
        scene
    )
    cylinder.position = new BABYLON.Vector3(0, 0, -6)
    cylinder.material = material
    // 创建圆锥体
    const clone = BABYLON.MeshBuilder.CreateCylinder('cone', {
        height: 5,//高度
        diameterTop: 0,//顶部直径
        diameterBotton: 2,//底部直径
        tessellation: 64//分段数
    }, scene)
    clone.position = new BABYLON.Vector3(0, 5, 0)
    clone.material = material

    // 创建圆环
    const torus = BABYLON.MeshBuilder.CreateTorus('torus', {
        diameter: 2,//外圆直径
        thickness: 0.5,//内圆直径
        tessellation: 64//分段数
    }, scene)
    // torus.position = new BABYLON.Vector3(0, 0, -9)
    // 缩放
    torus.scaling.set(10, 10, 10)
    // 旋转
    // torus.rotation.set(Math.PI / 3, 0, 0)
    // 围绕某个点旋转
    torus.rotateAround(
        new BABYLON.Vector3(0, 0, 0),//旋转中心点
        new BABYLON.Vector3(1, 0, 0),  //旋转的轴 
        Math.PI / 3//旋转的角度
    )
    // 位置
    torus.position.set(0, 6, 0)
    torus.material = material


    // 创建点光源
    const pointLight = new BABYLON.PointLight('pointLight',
        new BABYLON.Vector3(-2, 0, 0),//位置
        scene//场景
    )
    // 设置灯光颜色 红绿蓝
    pointLight.diffuse = new BABYLON.Color3(1, 0, 0)
    // 设置高光颜色
    pointLight.specular = new BABYLON.Color3(1, 1, 0)
    // 设置灯光强度
    pointLight.intensity = 0.5

    // 创建平行光
    const directionalLight = new BABYLON.DirectionalLight('directionalLight',
        new BABYLON.Vector3(-1, -1, 0),//方向
        scene
    )
    // 设置灯光颜色 红绿蓝
    directionalLight.diffuse = new BABYLON.Color3(0, 1, 0)
    // 设置高光颜色
    directionalLight.specular = new BABYLON.Color3(0, 1, 0)
    // 设置灯光强度
    directionalLight.intensity = 0.5

    // 创建聚光灯
    const spotLight = new BABYLON.SpotLight('spotLight',
        new BABYLON.Vector3(0, 5, 5),//位置
        new BABYLON.Vector3(0, -1, -1),//方向
        Math.PI / 3,//角度
        2,//强度
        scene
    )
    // 设置灯光颜色 红绿蓝
    spotLight.diffuse = new BABYLON.Color3(1, 0, 1)
    // 设置高光颜色
    spotLight.specular = new BABYLON.Color3(1, 1, 1)
    // 设置灯光强度
    spotLight.intensity = 1

    // // 创建半球光
    // const hemisphericLight = new BABYLON.HemisphericLight('hemisphericLight',
    //     new BABYLON.Vector3(0, 1, 0),//方向
    //     scene
    // )
    // 生成阴影
    let shadowGenerator = new BABYLON.ShadowGenerator(1024, spotLight)
    shadowGenerator.addShadowCaster(sphere)


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
}


.btnBox {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 999;
}
</style>