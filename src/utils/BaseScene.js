import * as BABYLON from "babylonjs";
import "babylonjs-loaders";

export class BaseScene {
    constructor(canvasElement, options = {}) {
        // this.canvas = canvasElement;
        this.canvas = document.querySelector(canvasElement);
        this.options = {
            enableCamera: true,
            enableLight: true,
            cameraParams: {
                alpha: 0,
                beta: Math.PI / 4,
                radius: 60,
                target: BABYLON.Vector3.Zero(),
            },
            ...options,
        };

        // Babylon 核心对象
        this.engine = null;
        this.scene = null;
        this.camera = null;

        // 初始化流程
        this.initEngine();
        this.initScene();
        // this.options.enableCamera && this.initCamera();
        // this.options.enableLight && this.initLight();
        this.initCamera();
        this.initLight();
        this.initAxesHelper();
        this.initResizeListener();
        this.startRenderLoop();
    }

    // 初始化引擎
    initEngine() {
        this.engine = new BABYLON.Engine(this.canvas, true);
    }

    // 初始化场景
    initScene() {
        this.scene = new BABYLON.Scene(this.engine);

        // this.scene.clearColor = new BABYLON.Color4(0.3, 0.3, 0.3, 1); // 默认背景色
    }

    // 初始化相机
    initCamera() {
        const { alpha, beta, radius, target } = this.options?.cameraParams;
        console.log("alpha", alpha, beta, radius, target);
        this.camera = new BABYLON.ArcRotateCamera(
            "mainCamera",
            alpha,
            beta,
            radius,
            target,
            this.scene
        );
        this.camera.attachControl(this.canvas, true);
    }

    initAxesHelper() {
        new BABYLON.AxesViewer(this.scene, 10);
    }

    // 初始化灯光
    initLight() {
        // 方向光
        new BABYLON.DirectionalLight(
            "directionalLight",
            new BABYLON.Vector3(-5, -5, 0),
            this.scene
        );

        // 环境光
        new BABYLON.HemisphericLight(
            "hemisphericLight",
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
    }

    // 加载模型 (GLB/GLTF)
    async loadModel(modelUrl) {
        const index = modelUrl.lastIndexOf("/");
        const rootUrl = modelUrl.substring(0, index + 1);
        const sceneFile = modelUrl.substring(index + 1);

        return BABYLON.SceneLoader.ImportMeshAsync(
            null,
            rootUrl,
            sceneFile,
            this.scene
        );
    }


    // 窗口自适应
    initResizeListener() {
        window.addEventListener("resize", () => this.engine.resize());
    }

    // 启动渲染循环
    startRenderLoop() {
        this.engine.runRenderLoop(() => this.scene.render());
    }


    // 销毁资源
    dispose() {
        this.engine.stopRenderLoop();
        this.scene.dispose();
        this.engine.dispose();
        window.removeEventListener("resize", () => this.engine.resize());
    }
}