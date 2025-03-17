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

let canvasRef = ref(null)
let baseScene;
// 配置参数
const modelUrl = '/models/testModel.glb';
const initOptions = {
    cameraParams: {
        radius: 60, // 自定义相机距离
    },
};

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



// 创建立方体模型
const createBox = () => {
    const box = BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, baseScene.scene);
    // 创建Animation对象
    /* 
        参数1 - 动画的名称
        参数2 - 这个与对象的属性相关，可以是任何物体的属性，具体取决于需要更新的内容，上例中我们要在X轴的方向缩放 Box1，所以这里设置为 scaling.x 。
        参数3 - 每秒请求的帧数：动画中可能达到的最高FPS。
        参数4 - 数值变化类型。根据参数3的配置，决定要修改的值类型：浮点数（例如x轴位置Position.x），矢量（例如位置Position）还是四元数(例如旋转rotationQuaternion)。
    */
    let animationBox = new BABYLON.Animation("myAnimation", "position.y", 50, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    // 定义动画的关键帧
    let animationBox2 = new BABYLON.Animation("myAnimation2", "scaling.x", 50, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    let keys = [];
    // 在动画key==0时, 动画的初始值是"1"
    keys.push({
        frame: 0,
        value: 1
    });
    // 在动画key==100时, 动画的值是"10"
    keys.push({
        frame: 100,
        value: 10
    });
    keys.push({
        frame: 200,
        value: 1
    });
    animationBox.setKeys(keys);//把之前定义的keys动画组加入到Animation对象中
    animationBox2.setKeys(keys);//把之前定义的keys动画组加入到Animation对象中
    box.animations.push(animationBox, animationBox2);//把动画和物体关联起来
    baseScene.scene.beginAnimation(box, 0, 100, true);// 最后，我们需要一行代码来启动自己的动画：
}

onMounted(async () => {
    // 初始化 Babylon
    // baseScene = await new BaseScene(canvasRef.value, initOptions);

    // // 加载模型


    // // 创建立方体并添加动画
    // // const box = baseScene.createBox({ size: 3 });
    // baseScene.startRenderLoop();
    // addBoxAnimation(box);

    // // 初始化场景后
    // const highlightManager = new HighlightManager(baseScene.scene, {
    //     color: BABYLON.Color3.Green(), // 自定义颜色
    //     // multiSelect: false,     // 是否允许多选
    //     // useHighlightLayer: false, // 使用材质替换
    //     // animationSpeed: 0,      // 颜色渐变过渡
    // });


    // // 创建canvas
    // const canvas = document.querySelector('canvas')
    // console.log('canvas:', canvas)

    // //创建引擎
    // const engine = new BABYLON.Engine(canvas, true)
    // console.log('engine:', engine)
    // // 创建场景
    // const scene = new BABYLON.Scene(engine)
    // // 创建相机
    // /* 
    //     参数：
    //     camera:相机名称
    //     alpha:相机绕y轴旋转的角度
    //     beta:相机绕x轴旋转的角度
    //     radius:相机距离目标点的距离
    //     target:相机目标点
    // */
    // const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene)
    // // 设置相机的位置
    // camera.setPosition(new BABYLON.Vector3(0, 5, -20))
    // camera.attachControl(canvas, true)



    try {
        // 初始化 Babylon
        baseScene = new BaseScene('.canvas');
        // await baseScene.loadModel(modelUrl);
        // createBox()
        const box = BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, baseScene.scene);

        // // 加载模型
        let models = await baseScene.loadModel(modelUrl);
        // console.log(models)

        // 初始化高亮管理器
        new HighlightManager(baseScene.scene, {
            color: BABYLON.Color3.Green(),
        });
        // 创建球
        const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2 }, baseScene.scene)
        sphere.position = new BABYLON.Vector3(0, 5, 0)

        baseScene.startRenderLoop(); // 启动渲染循环

    } catch (err) {
        console.log(err)
    }

    // 渲染场景
    // engine.runRenderLoop(() => {
    //     scene.render()
    // })

    // // 监听窗口变化
    // window.addEventListener('resize', () => {
    //     engine.resize()
    // });
})



// onUnmounted(() => {
//     baseScene?.dispose();
// });





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