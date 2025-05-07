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
import gsap from "gsap";

let canvasRef = ref(null)
let baseScene;
// 配置参数
// const modelUrl = '/models/testModel.glb';
// const modelUrl = '/models/tray.glb';
const modelUrl = '/models/BoomBox.glb';
const modelUrl2 = '/models/tray.glb';
const initOptions = {
    cameraParams: {
        alpha: 0, // 相机绕y轴旋转角度
        beta: Math.PI / 4, // 相机绕x轴旋转角度
        radius: 30, // 自定义相机距离
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



let groupParent;

// 创建立方体模型
const createBox = () => {
    // 创建Animation对象
    /* 
        参数1 - 动画的名称
        参数2 - 这个与对象的属性相关，可以是任何物体的属性，比如位置position，旋转rotation，缩放scale等等
        参数3 - 每秒请求的帧数：动画中可能达到的最高FPS。
        参数4 - 数值变化类型。根据参数3的配置，决定要修改的值类型：浮点数（例如x轴位置Position.x），矢量（例如位置Position）还是四元数(例如旋转rotationQuaternion)。 确切的值是：
            浮点数：BABYLON.Animation.ANIMATIONTYPE_FLOAT
            二维向量：BABYLON.Animation.ANIMATIONTYPE_VECTOR2
            三维向量：BABYLON.Animation.ANIMATIONTYPE_VECTOR3
            四元数：BABYLON.Animation.ANIMATIONTYPE_QUATERNION
            矩阵：BABYLON.Animation.ANIMATIONTYPE_MATRIX
            颜色：BABYLON.Animation.ANIMATIONTYPE_COLOR3
        参数5 - 动画循环模式。确定动画是否应该循环播放。 确切的值是：
            循环：执行完一次，从头开始再执行：BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
            常量：动画执行一次就停止不动了：BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            相对：执行完一次，在接着最后的状态，继续执行：BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE  
    */
    let animationBox = new BABYLON.Animation("myAnimation", "position.x", 50, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    // 定义动画的关键帧
    // let animationBox2 = new BABYLON.Animation("myAnimation2", "scaling.x", 50, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
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
    // animationBox2.setKeys(keys);//把之前定义的keys动画组加入到Animation对象中
    box.animations.push(animationBox);//把动画和物体关联起来
    // box.animations.push(animationBox, animationBox2);//把动画和物体关联起来
    // baseScene.scene.beginAnimation(box, 0, 100, true);// 最后，我们需要一行代码来启动自己的动画：
    baseScene.scene.beginAnimation(groupParent, 0, 100, true);// 最后，我们需要一行代码来启动自己的动画：
}



onMounted(async () => {
    // 定义两个三维向量
    const pointA = new BABYLON.Vector3(1, 2, 3);
    const pointB = new BABYLON.Vector3(4, 2, 3);

    // 计算两点之间的距离
    const distance = new BABYLON.Vector3.Distance(pointA, pointB);
    // console.log("Distance:", distance); // 输出: Distance: 5.196152422706632

    // try {
    // 初始化 Babylon
    baseScene = new BaseScene(canvasRef.value, initOptions);
    // baseScene.scene.useRightHandedSystem = true;
    // baseScene.scene.useLeftHandedSystem = true;
    baseScene.initAxesHelper();
    // 创建一个材质
    const redMaterial = new BABYLON.StandardMaterial('material', baseScene.scene);
    const localAxes = new BABYLON.AxesViewer(baseScene.scene, 0.1);
    const localAxes2 = new BABYLON.AxesViewer(baseScene.scene, 0.1);

    redMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0)



    const box1 = BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, baseScene.scene);
    box1.position = new BABYLON.Vector3(10, 0, -10);

    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { size: 2 }, baseScene.scene);
    sphere.position = new BABYLON.Vector3(12, 0, -10);


    let model = await baseScene.createModel({
        path: modelUrl,
        // position: new BABYLON.Vector3(10, 2, 0),
        // rotation: new BABYLON.Vector3(0, 0, 0),
        scaling: new BABYLON.Vector3(100, 100, 100),
    })


    let model2 = await baseScene.createModel({
        path: modelUrl2,
        // position: new BABYLON.Vector3(10, 5, 0),
        // rotation: new BABYLON.Vector3(0, 0, 0),
        scaling: new BABYLON.Vector3(20, 20, 20),
    })



    const originalModel = baseScene.scene.getMeshById('BoomBox')


    // groupParent = new BABYLON.TransformNode("modelGroup", baseScene.scene);
    groupParent = new BABYLON.TransformNode("modelGroup");
    groupParent.position = new BABYLON.Vector3(3, 5, 3);
    // groupParent.rotation = new BABYLON.Vector3(0, 0, 0); // 强制重置旋转
    // groupParent.scaling = new BABYLON.Vector3(1, 1, 1);  // 确保无缩放
    // groupParent.translate((0, 0, 0),); // 确保无平移
    // groupParent.setPivotPoint(new BABYLON.Vector3(0, 0, 0)); // 设置原点为模型中心
    // console.log('@@@groupParent.translate：', groupParent.translate)
    // originalModel.rotation.y = 0; // 绕 Y 轴归零（关键：修复默认旋转）

    localAxes.xAxis.parent = originalModel;
    localAxes.yAxis.parent = originalModel;
    localAxes.zAxis.parent = originalModel;


    const clonedBox1 = originalModel.clone("clonedBox");
    clonedBox1.rotation = originalModel.rotation.clone(); // 继承旋转
    clonedBox1.material = redMaterial;
    clonedBox1.parent = groupParent;
    clonedBox1.translate(new BABYLON.Vector3(0, 0, 0), 1,
        BABYLON.Space.WORLD); //(-1 + 2, 2 + 3, 1 + 4) = (1, 5, 5)


    sphere.parent = groupParent;

    const clonedBox2 = originalModel.clone("clonedBox2");
    clonedBox2.rotation = originalModel.rotation.clone(); // 继承旋转


    clonedBox2.position = new BABYLON.Vector3(10, 8, 0); // 克隆体向右偏移 2 单位


    // clonedBox.rotation = originalModel.rotation.clone();

    // clonedBox.rotation = originalModel.rotation.clone();
    // clonedBox2.rotation = originalModel.rotation.clone();
    // clonedBox.rotationQuaternion = originalModel.rotationQuaternion.clone();
    // clonedBox.rotation = originalModel.rotation.clone(); // 继承旋转
    // clonedBox2.rotation = originalModel.rotation.clone(); // 继承旋转


    // clonedBox.position = groupParent.worldToLocal(clonedBox.getAbsolutePosition());


    // clonedBox.rotation = originalModel.rotation.clone(); // 继承旋转

    // clonedBox.position.set(10, 3, 3);
    // clonedBox2.parent = groupParent;
    // groupParent.rotation =originalModel.rotation.clone(); // 继承旋转

    localAxes2.xAxis.parent = clonedBox2;
    localAxes2.yAxis.parent = clonedBox2;
    localAxes2.zAxis.parent = clonedBox2;

    // gsap.to([ groupParent.position], {
    //     x: 15, // 移动位置
    //     repeat: -1, // 重复次数
    //     duration: 5, // 动画持续时间
    // });


    // groupParent.rotation.y =Math.PI/2; // 继承旋转
    // clonedBox.rotation.x = Math.PI; // 继承旋转
    // clonedBox.rotation.y = Math.PI; // 继承旋转
    // clonedBox.rotation.z = Math.PI; // 继承旋转
    // clonedBox2.rotation.y = Math.PI; // 继承旋转

    // groupParent.rotation.x =Math.PI/2; // 继承旋转

    // groupParent.rotation.y = Math.PI; // 继承旋转

    // groupParent.rotation.z = Math.PI; // 继承旋转
    // 设置克隆模型的朝向一致
    //     clonedBox.rotation = originalModel.rotation.clone();
    // console.log('@@@rotationQuaternion:',originalModel);
    // groupParent.rotationQuaternion = originalModel.rotationQuaternion.clone();


    // gsap.to(groupParent.position, {
    // x: 10, // 移动位置
    // repeat: -1, // 重复次数
    // duration: 5, // 动画持续时间
    // });

    // gsap.to(originalModel.position, {
    // x: 10, // 移动位置
    // repeat: -1, // 重复次数
    // duration: 5, // 动画持续时间
    // });

    // gsap.to(clonedBox.position, {
    // x: 10, // 移动位置
    // repeat: -1, // 重复次数
    // duration: 5, // 动画持续时间
    // });

    // gsap.to(clonedBox2.position, {
    // x: 10, // 移动位置
    // repeat: -1, // 重复次数
    // duration: 5, // 动画持续时间
    // });


    let animationBox = new BABYLON.Animation("myAnimation", "position.x", 50, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    // 定义动画的关键帧
    // let animationBox2 = new BABYLON.Animation("myAnimation2", "scaling.x", 50, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
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
    groupParent.animations.push(animationBox);//把动画和物体关联起来
    baseScene.scene.beginAnimation(groupParent, 0, 100, true);// 最后，我们需要一行代码来启动自己的动画：


    //     trayModel.animations.push(animationBox);//把动画和物体关联起来
    //             baseScene.scene.beginAnimation(trayModel, 0, 100, true);// 最后，我们需要一行代码来启动自己的动画：


    // 初始化高亮管理器
    // new HighlightManager(baseScene.scene, {
    //     color: BABYLON.Color3.Green(),
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