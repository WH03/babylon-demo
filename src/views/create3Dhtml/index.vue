<template>
    <div id="container">
        <canvas ref="canvasRef" class="canvas">
        </canvas>
    </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
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



// htmlMesh 创建方法
function createHtmlMeshFromTemplate(htmlContent, cssText, width = 4, height = 3, position = new Vector3(0, 0, 0)) {
    const htmlRenderer = new HtmlMeshRenderer(baseScene.scene);
    const htmlMesh = new HtmlMesh(baseScene.scene, "html-overlay-mesh", {
        captureOnPointerEnter: true,
        isCanvasOverlay: true,
    });

    const container = document.createElement("div");
    container.className = "htmlDom";
    container.innerHTML = htmlContent;

    const style = document.createElement("style");
    style.textContent = cssText;
    container.prepend(style);

    htmlMesh.setContent(container, width, height);
    htmlMesh.material.diffuseColor = new Color4.FromHexString("#0f1f42");
    htmlMesh.position = position;
    htmlMesh.billboardMode = TransformNode.BILLBOARDMODE_ALL;

    // 把 DOM 节点挂载到 mesh 对象上，便于后续操作
    htmlMesh.domRoot = container;

    return htmlMesh;
}



// 创建一个 HTML 内容
function renderList(data) {
    if (!Array.isArray(data)) return '';
    // 创建 ul 元素
    const ul = document.createElement('ul');
    ul.className = 'list';
    // 遍历创建 li
    data.forEach(item => {
        if (typeof item === 'string' && item.trim()) {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        }
    });
    //  返回字符串而不是 DOM 对象
    return ul.outerHTML;
}






onMounted(async () => {
    baseScene = new BaseScene(canvasRef.value, initOptions);
    baseScene.initAxesHelper();

    // 创建球
    const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2 }, baseScene.scene)
    sphere.position = new Vector3(0, 0, 0)
    // baseScene.scene.debugLayer.show()
    const htmlTemplate = `<div class='box'>
        <div class='title'><img class='close' src='/images/close.svg' alt=''></div>
        <p class='subTitle'> 箱内样品编码：</p>
         ${renderList(['1', '2', '3'])}
        </div>`;

    const cssText = `.box {
        font-size: 100px;
        padding: 10px;
        color:#ccc;

        background-color: #071a42;
        text-align: center;
        position: relative;
        color: aqua;
        .title{
            .close{
                width: 200px;
                height: 200px;
                position: absolute;
                right: 3%;
                top: 2%;
                font-size: 10px;
                color: red;
                cursor: pointer;
                z-index: 999;
                color: aqua;
                width: 100px;
                height: 100px;
            }
        }
      }
    `

    let html = createHtmlMeshFromTemplate(htmlTemplate, cssText, 4, 3, new Vector3(0, 5, 0));
    html.setParent(sphere)
    // moveAnimate(sphere, sphere.position.clone(), new Vector3(0, 0, 5), 2000, baseScene.scene)
    baseScene.moveAnim(sphere, sphere.position.clone(), new Vector3(0, 0, 5), 2000)

    // 添加点击事件（延后执行确保 DOM 已挂载）
    // setTimeout(() => {

    // }, 10);
    nextTick(() => {
        const closeDom = html.domRoot.querySelector(".close");
        closeDom.addEventListener("click", () => {
            html.setEnabled(false); // 点击隐藏 mesh
        });
    })




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