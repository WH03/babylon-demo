<template>
    <div id="cesiumContainer">
        <canvas class="canvas" ref="canvasRef"></canvas>
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { BaseScene } from '@/utils/BaseScene.js';
import { HighlightManager } from '@/utils/highlightManager'
import * as BABYLON from "babylonjs";
import { Vector3, MeshBuilder } from '@babylonjs/core';
import gsap from "gsap";

let canvasRef = ref(null)
let baseScene;
// 配置参数
const modelUrl = '/models/BoomBox.glb';

const initOptions = {
    cameraParams: {
        alpha: 0, // 相机绕y轴旋转角度
        beta: Math.PI / 4, // 相机绕x轴旋转角度
        radius: 60, // 自定义相机距离
    },
};

/* 
todo：
  1、起点码垛机，终点码垛机：入库或者出库，整体上移或下降0.15-->记录上一次的位置，然后计算差值
  2、起点码垛机，终点辊筒：出库，第一个移动，剩余的下降0.15-->记录上一次的位置，然后计算差值,剩余的根据根据计算结果，整体下降0.15
  3、起点辊筒，终点码垛机：入库，其他的整体上移0.15
  4、起点辊筒，终点辊筒：位移，根据传值结果移动。
*/


// 添加动画示例
const addBoxAnimation = (mesh) => {
    const animationY = new BABYLON.Animation(
        "positionY",
        "position.y",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    animationY.setKeys([
        { frame: 0, value: 1 },
        { frame: 100, value: 10 },
        { frame: 200, value: 1 },
    ]);
    mesh.animations = [animationY];
    baseScene.scene.beginAnimation(mesh, 0, 200, true);
};

/* 
    04-14：
        1、辊筒到暂存台
*/

// 求距离
// let dictance = +startVec3.subtract(endVec3).length().toFixed(2)
// console.log('@@@dictance', dictance)

onMounted(async () => {
    baseScene = new BaseScene(canvasRef.value, initOptions);
    baseScene.initAxesHelper();

    // 方式一：调用 add 进行监听
    // const beforeRenderObserver1 = baseScene.scene.onBeforeRenderObservable.add((scene) => {
    //     console.log('beforeRenderObserver1', scene);
    // });

    // let mesh = new BABYLON.MeshBuilder.CreateBox("box", baseScene.scene);
    // mesh.position = new BABYLON.Vector3(0, 0, 0);


    // // 定义两个三维点
    // const point1 = new BABYLON.Vector3(-10, 0, 0);
    // const point2 = new BABYLON.Vector3(10, 0, 0);

    // // 创建动画对象
    // const animation = new BABYLON.Animation(
    //     "moveAnimation",
    //     "position",
    //     30,
    //     BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    //     BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    // );

    // // 设置关键帧（总时间3秒，90帧）
    // animation.setKeys([
    //     { frame: 0, value: point1 },
    //     { frame: 90, value: point2 }
    // ]);

    // // 添加缓动函数（平滑过渡）
    // const easingFunction = new BABYLON.QuadraticEase();
    // easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASE_IN_OUT);
    // animation.setEasingFunction(easingFunction);

    // // 绑定到物体并播放
    // const box = BABYLON.Mesh.CreateBox("box", 1, baseScene.scene);
    // box.animations = [animation];
    // baseScene.scene.beginAnimation(box, 0, 90, false);

    // let sphere = new BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 5, segments: 32 }, baseScene.scene);
    // sphere.showBoundingBox = true

    // const boundingInfo = sphere.getBoundingInfo()//获取包围盒信息
    // const size = boundingInfo.boundingBox.extendSize//获取包围盒尺寸
    // console.log('@@@size：', size)

    // let ground = BABYLON.MeshBuilder.CreateGround('ground',
    //     { width: 100, height: 100 }, baseScene.scene)
    // let box = BABYLON.MeshBuilder.CreateBox('box', { width: 5, height: 3, depth: 2 }, baseScene.scene)
    // const framerate = 10
    // // 位移动画
    // const up = new BABYLON.Animation('animation', 'position', framerate,
    //     BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    //     BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
    // const keysFrames = []
    // keysFrames.push({
    //     frame: framerate,
    //     value: new BABYLON.Vector3(0, 0, 0)
    // })
    // keysFrames.push({
    //     frame: 2 * framerate,
    //     value: new BABYLON.Vector3(10, 5, 0)
    // })
    // keysFrames.push({
    //     frame: 4 * framerate,
    //     value: new BABYLON.Vector3(6, 10, 10)
    // })
    // up.setKeys(keysFrames)
    // // 绕Y轴旋转
    // let rotation = new BABYLON.Animation('animation', 'rotation.x', framerate,
    //     BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    //     BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
    // const framArr = []
    // framArr.push({
    //     frame: framerate,
    //     value: 0
    // })
    // framArr.push({
    //     frame: 2 * framerate,
    //     value: Math.PI
    // })
    // framArr.push({
    //     frame: 4 * framerate,
    //     value: Math.PI * 2
    // })
    // rotation.setKeys(framArr)
    // //scene.beginDirectAnimation(box,[rotation,up],0,4*framerate,true)
    // // 旋转

    // var animationGrounp = new BABYLON.AnimationGroup('group')
    // animationGrounp.addTargetedAnimation(up, box)
    // animationGrounp.addTargetedAnimation(rotation, box)
    // animationGrounp.normalize(0, 40)
    // animationGrounp.play(true)


    // // 创建一个球体
    // let sphere = new BABYLON.MeshBuilder.CreateBox("box", { width: 5, height: 3, depth: 2 }, baseScene.scene);

    // // 注册一个在每次渲染前执行的函数
    // baseScene.scene.registerBeforeRender(function () {
    //     // 这里写你的代码，例如更新球体的位置
    //     // Math.sin():它接受一个以弧度为单位的数字作为参数，返回该角度的正弦值，结果范围在 -1 到 1 之间。
    //     sphere.position.z = Math.sin(Date.now() * 0.001) * 5; // 使球体在Y轴上上下移动
    // });

    // 创建一个材质
    const yellowMaterial = new BABYLON.StandardMaterial('material', baseScene.scene)
    yellowMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0)

    const baseCylinder = new MeshBuilder.CreateCylinder('baseCylinder', { height: 5, diameter: 1 }, baseScene.scene)
    const topCylinder = new MeshBuilder.CreateCylinder('topCylinder', { height: 5, diameter: 1 }, baseScene.scene)
    topCylinder.material = yellowMaterial
    topCylinder.rotation = new Vector3(Math.PI / 3, 0, 0)
    topCylinder.position = new Vector3(0, 3, 2.5)


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