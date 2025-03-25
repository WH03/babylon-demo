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
const initOptions = {
    cameraParams: {
        alpha: 0, // 相机绕y轴旋转角度
        beta: Math.PI / 4, // 相机绕x轴旋转角度
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

let  groupParent;

// 创建立方体模型
const createBox = () => {
    // 创建Animation对象
    /* 
        参数1 - 动画的名称
        参数2 - 这个与对象的属性相关，可以是任何物体的属性，具体取决于需要更新的内容，上例中我们要在X轴的方向缩放 Box1，所以这里设置为 scaling.x 。
        参数3 - 每秒请求的帧数：动画中可能达到的最高FPS。
        参数4 - 数值变化类型。根据参数3的配置，决定要修改的值类型：浮点数（例如x轴位置Position.x），矢量（例如位置Position）还是四元数(例如旋转rotationQuaternion)。
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




// const createModel = async(params,scene) => {
//     const { path, box,   
//         position = { x: 0, y: 0, z: 0 },
//       scaling = { x: 0, y: 0, z: 0 },
//       rotation = { x: 0, y: 0, z: 0 } 
//     } = params
//     await new BABYLON.AppendSceneAsync(path, scene, {
//       onProgress(event) {
//         console.log(event.loaded, event.total, event.lengthComputable)
//       },
//     });

//     const mesh = scene.getMeshById('立方体.001')
//     if (mesh) {
//       mesh.scaling = new BABYLON.Vector3(scaling?.x, scaling?.y, scaling?.z);
//       mesh.rotation = new BABYLON.Vector3(rotation?.x, rotation?.y, rotation?.z);
//       mesh.position = new BABYLON.Vector3(position?.x, position?.y, position?.z)

//     }

//     return mesh
// }




onMounted(async () => {
    // try {
        // 初始化 Babylon
        baseScene = new BaseScene('.canvas', initOptions);

          // 创建一个材质
    const material = new BABYLON.StandardMaterial('material', baseScene.scene);
    const localAxes = new BABYLON.AxesViewer(baseScene.scene, 0.1);
    const localAxes2 = new BABYLON.AxesViewer(baseScene.scene, 0.1);

     material.diffuseColor = new BABYLON.Color3(1, 1, 0)


        groupParent= new BABYLON.TransformNode("modelGroup", baseScene.scene);
        groupParent.rotation = new BABYLON.Vector3(0, 0, 0); // 强制重置旋转
        groupParent.scaling = new BABYLON.Vector3(1, 1, 1);  // 确保无缩放

        const box1 = BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, baseScene.scene);
        box1.position = new BABYLON.Vector3(-10, 0, -10);
    //    let trayModel = await baseScene.loadModel(modelUrl,(result)=>{
    //     result.meshes.forEach((mesh) => {
    //        mesh.scaling = new BABYLON.Vector3(10, 10, 10);
    //        mesh.rotation.y = 0;
    //     })
    //    });
    //    console.log('trayModel:',trayModel)

    let  trayModel=await baseScene.createModel({
                path: modelUrl,
                // position: new BABYLON.Vector3(0, 0, 0),
                // rotation: new BABYLON.Vector3(0, 0, 0),
                scaling: new BABYLON.Vector3(100, 100, 100),
            })

            const originalModel = baseScene.scene.getMeshById('BoomBox')



        originalModel.rotation.y = 0; // 绕 Y 轴归零（关键：修复默认旋转）


            localAxes.xAxis.parent = originalModel;
            localAxes.yAxis.parent = originalModel;
            localAxes.zAxis.parent = originalModel;	



    //         console.log('trayModel:',trayModel)

            // const originalModel = trayModel.meshes[0];
            // originalModel.rotation.y = 0;


        //    console.log('trayModel@@@:',trayModel.clone())
        // createBox()
        // const box = BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, baseScene.scene);
        // const clonedBox = box1.clone("clonedBox");
        // const clonedBox2 = box1.clone("clonedBox2");
        const clonedBox = originalModel.clone("clonedBox");
        clonedBox.rotation = originalModel.rotation.clone(); // 继承旋转
        clonedBox.material = material;

        const clonedBox2 = originalModel.clone("clonedBox2");
        clonedBox2.rotation = originalModel.rotation.clone(); // 继承旋转

        // clonedBox.material =material;
        clonedBox.position = new BABYLON.Vector3(0, 2.5, 0); // 克隆体向右偏移 2 单位
        clonedBox2.position = new BABYLON.Vector3(0, 5, 0); // 克隆体向右偏移 2 单位
        // clonedBox.makeGeometryUnique();

        // clonedBox.rotation = originalModel.rotation.clone();

        // clonedBox.rotation = originalModel.rotation.clone();
        // clonedBox2.rotation = originalModel.rotation.clone();
        // clonedBox.rotationQuaternion = originalModel.rotationQuaternion.clone();
        // clonedBox.rotation = originalModel.rotation.clone(); // 继承旋转
        // clonedBox2.rotation = originalModel.rotation.clone(); // 继承旋转


        // clonedBox.position = groupParent.worldToLocal(clonedBox.getAbsolutePosition());


        clonedBox.rotation = originalModel.rotation.clone(); // 继承旋转
        clonedBox.parent = groupParent;
        // clonedBox2.parent = groupParent;
        // groupParent.rotation =originalModel.rotation.clone(); // 继承旋转

        localAxes2.xAxis.parent = clonedBox2;
        localAxes2.yAxis.parent = clonedBox2;
        localAxes2.zAxis.parent = clonedBox2;	


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

        
        gsap.to([clonedBox2.position, clonedBox.position, originalModel.position], {
        x: 10, // 移动位置
        repeat: -1, // 重复次数
        duration: 5, // 动画持续时间
        });

    //     let animationBox = new BABYLON.Animation("myAnimation", "position.x", 50, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    // // 定义动画的关键帧
    // // let animationBox2 = new BABYLON.Animation("myAnimation2", "scaling.x", 50, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    //     let keys = [];
    //     // 在动画key==0时, 动画的初始值是"1"
    //     keys.push({
    //         frame: 0,
    //         value: 1
    //     });
    //     // 在动画key==100时, 动画的值是"10"
    //     keys.push({
    //         frame: 100,
    //         value: 10
    //     });
    //     keys.push({
    //         frame: 200,
    //         value: 1
    //     });
    //     animationBox.setKeys(keys);//把之前定义的keys动画组加入到Animation对象中
    //     groupParent.animations.push(animationBox);//把动画和物体关联起来
    //     baseScene.scene.beginAnimation(groupParent, 0, 100, true);// 最后，我们需要一行代码来启动自己的动画：


    //     trayModel.animations.push(animationBox);//把动画和物体关联起来
    //             baseScene.scene.beginAnimation(trayModel, 0, 100, true);// 最后，我们需要一行代码来启动自己的动画：


        // // 加载模型
        // let models = await baseScene.loadModel(modelUrl);
        // console.log('models:', models)

        // 初始化高亮管理器
        new HighlightManager(baseScene.scene, {
            color: BABYLON.Color3.Green(),
        });
        // 创建球
        // const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2 }, baseScene.scene)
        // sphere.position = new BABYLON.Vector3(0, 5, 0)

        // baseScene.startRenderLoop(); // 启动渲染循环

    // } catch (err) {
    //     console.log(err)
    // }

    // 渲染场景
    // engine.runRenderLoop(() => {
    //     scene.render()
    // })

    // // 监听窗口变化
    // window.addEventListener('resize', () => {
    //     engine.resize()
    // });


    /* 
    计算位置：
      params：
        startPos：起始点
        endPos：结束点
        division：分割数
        direction：方向
    */
    // const calculatePosition = (startPos: Vector3, endPos: Vector3, division: number, direction: 'x' | 'y' | 'z'): Vector3[] => {
    //     let distance = startPos.subtract(endPos).length()
    //     let width = distance / division
    //     let positions = [];
    //     for (let i = 0; i < division; i++) {
    //         const newPoint = startPos.clone();
    //         switch (direction) {
    //             case 'x':
    //                 newPoint.x += width * i;
    //                 break;
    //             case 'y':
    //                 newPoint.y += width * i;
    //                 break;
    //             case 'z':
    //                 newPoint.z += width * i;
    //                 break;
    //         }
    //         positions.push(newPoint)
    //     }
    //     return positions
    // }

    // let startPos = new Vector3(4.03, 1, -3.4)
    // let endPos = new Vector3(4.03, 1, -0.8)

    // let pos = calculatePosition(startPos, endPos, 4, 'z')
    // console.log('pos：', pos[2])


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