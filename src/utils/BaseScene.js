import * as BABYLON from "babylonjs";
import "babylonjs-loaders";

export class BaseScene {
    constructor(canvasElement, options = {}) {
        this.canvas = canvasElement;
        // this.canvas = document.querySelector(canvasElement);
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
        // this.initAxesHelper();
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
        const { alpha, beta, radius, target, wheelPrecision } = this.options?.cameraParams;
        // console.log("alpha", alpha, beta, radius, target);
        this.camera = new BABYLON.ArcRotateCamera(
            "mainCamera",
            alpha,
            beta,
            radius,
            target,
            this.scene
        );
        // console.log("this.camera", wheelPrecision);
        this.camera.wheelPrecision = wheelPrecision || 50; // 默认是 50，数值越大，缩放越慢
        this.camera.attachControl(this.canvas, true);
    }

    initAxesHelper() {
        new BABYLON.AxesViewer(this.scene, 10);
    }

    // 初始化灯光
    initLight() {
        // 方向光
        this.directionalLight = new BABYLON.DirectionalLight(
            "directionalLight",
            new BABYLON.Vector3(0, 20, 0),
            this.scene
        );
        this.directionalLight.intensity = 3;
        // 环境光
        this.hemisphericLight = new BABYLON.HemisphericLight(
            "hemisphericLight",
            new BABYLON.Vector3(0, 20, 0),
            this.scene
        );
        this.hemisphericLight.intensity = 2;
    }

    // 加载模型 (GLB/GLTF)
    async loadModel(modelUrl, callback) {
        const index = modelUrl.lastIndexOf("/");
        const rootUrl = modelUrl.substring(0, index + 1);
        const sceneFile = modelUrl.substring(index + 1);

        return BABYLON.SceneLoader.ImportMeshAsync(
            null,
            rootUrl,
            sceneFile,
            this.scene
        ).then((result) => {
            callback(result);
        });
    }

    async createModel(params) {
        const {
            path,
            position = { x: 0, y: 0, z: 0 },
            scaling = { x: 1, y: 1, z: 1 },
            rotation = { x: 0, y: 0, z: 0 },
        } = params;
        const scene = this.scene
        const container = await BABYLON.LoadAssetContainerAsync(path, scene, {
            onProgress(event) {
                console.log(event.loaded, event.total, event.lengthComputable)
            },
        });
        const mesh = container.meshes[container.meshes.length - 1];
        if (mesh) {
            mesh.scaling = new BABYLON.Vector3(scaling.x, scaling.y, scaling.z);
            mesh.rotation = new BABYLON.Vector3(rotation.x, rotation.y, rotation.z);
            mesh.position = new BABYLON.Vector3(position.x, position.y, position.z)
            mesh.isPickable = true
            mesh.computeWorldMatrix(true); // ← 强制更新世界矩阵
        }
        // 4. 添加到场景并刷新
        container.addAllToScene();
        scene.onReadyObservable.addOnce(() => {
            scene.meshes.forEach(m => m.computeWorldMatrix(true));
        });
        return { id: mesh.id }

    }



    // public async create(params: Create) {
    //     const {
    //         path,
    //         position = { x: 0, y: 0, z: 0 },
    //         scaling = { x: 1, y: 1, z: 1 },
    //         rotation = { x: 0, y: 0, z: 0 },
    //     } = params;
    //     const scene = this.scene
    //     const container = await LoadAssetContainerAsync(path, scene, {
    //         onProgress(event) {
    //             console.log(event.loaded, event.total, event.lengthComputable)
    //         },
    //     });
    //     const mesh: AbstractMesh = container.meshes[container.meshes.length - 1] as AbstractMesh;
    //     if (mesh) {
    //         mesh.scaling = new Vector3(scaling.x, scaling.y, scaling.z);
    //         mesh.rotation = new Vector3(rotation.x, rotation.y, rotation.z);
    //         mesh.position = new Vector3(position.x, position.y, position.z)
    //         mesh.isPickable = true
    //         mesh.computeWorldMatrix(true); // ← 强制更新世界矩阵
    //     }
    //     // 4. 添加到场景并刷新
    //     container.addAllToScene();
    //     scene.onReadyObservable.addOnce(() => {
    //         scene.meshes.forEach(m => m.computeWorldMatrix(true));
    //     });
    //     return { id: mesh.id }
    // }



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