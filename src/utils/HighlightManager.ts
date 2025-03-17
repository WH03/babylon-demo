import { Scene, AbstractMesh, HighlightLayer, Color3, StandardMaterial } from "@babylonjs/core";

interface HighlightOptions {
    color?: Color3;               // 高亮颜色，默认红色
    useHighlightLayer?: boolean;  // 是否使用高亮层（性能更优），默认true
    multiSelect?: boolean;        // 是否允许多选，默认false
    animationSpeed?: number;      // 颜色过渡动画速度（0为无动画），默认0.2
}

export class HighlightManager {
    private scene: Scene;
    private options: HighlightOptions;
    private selectedMeshes = new Set<AbstractMesh>(); // 选中的网格集合
    private originalMaterials = new Map<AbstractMesh, any>(); // 原始材质缓存
    private highlightLayer: HighlightLayer | null = null; // 高亮层实例

    constructor(scene: Scene, options: HighlightOptions = {}) {
        this.scene = scene;
        this.options = {
            color: Color3.Red(),
            useHighlightLayer: true,
            multiSelect: false,
            animationSpeed: 0.2,
            ...options,
        };

        this.initHighlightLayer();
        this.registerPointerEvent();
    }

    // 初始化高亮层（如果启用）
    private initHighlightLayer() {
        if (this.options.useHighlightLayer) {
            this.highlightLayer = new HighlightLayer("highlightLayer", this.scene);
            this.highlightLayer.blurHorizontalSize = 1.5;
            this.highlightLayer.blurVerticalSize = 1.5;
        } else {
            // 预创建高亮材质（材质替换模式）
            this.options.color = this.options.color || Color3.Red();
        }
    }

    // 注册点击事件
    private registerPointerEvent() {
        this.scene.onPointerDown = (evt, pickResult) => {
            if (pickResult.hit && pickResult.pickedMesh) {
                this.toggleHighlight(pickResult.pickedMesh);
            } else {
                if (!this.options.multiSelect) {
                    this.clearHighlights();
                }
            }
        };
    }

    // 切换高亮状态
    private toggleHighlight(mesh: AbstractMesh) {
        if (this.selectedMeshes.has(mesh)) {
            this.removeHighlight(mesh);
        } else {
            this.addHighlight(mesh);
            if (!this.options.multiSelect) {
                this.clearHighlightsExcept(mesh);
            }
        }
    }

    // 添加高亮
    private addHighlight(mesh: AbstractMesh) {
        if (this.selectedMeshes.has(mesh)) return;

        // 保存原始材质
        if (!this.originalMaterials.has(mesh)) {
            this.originalMaterials.set(mesh, this.highlightLayer ? null : mesh.material);
        }

        // 应用高亮
        if (this.highlightLayer) {
            this.highlightLayer.addMesh(mesh, this.options.color!);
        } else {
            const highlightMat = this.createHighlightMaterial();
            if (this.options.animationSpeed > 0) {
                this.animateMaterialTransition(mesh, highlightMat);
            } else {
                mesh.material = highlightMat;
            }
        }

        this.selectedMeshes.add(mesh);
    }

    // 移除高亮
    private removeHighlight(mesh: AbstractMesh) {
        if (!this.selectedMeshes.has(mesh)) return;

        // 恢复原始材质
        if (this.highlightLayer) {
            this.highlightLayer.removeMesh(mesh);
        } else {
            const originalMat = this.originalMaterials.get(mesh);
            if (this.options.animationSpeed > 0) {
                this.animateMaterialTransition(mesh, originalMat);
            } else {
                mesh.material = originalMat;
            }
        }

        this.selectedMeshes.delete(mesh);
        this.originalMaterials.delete(mesh);
    }

    // 清除所有高亮
    clearHighlights() {
        this.selectedMeshes.forEach(mesh => this.removeHighlight(mesh));
    }

    // 清除除指定网格外的所有高亮
    private clearHighlightsExcept(exceptMesh: AbstractMesh) {
        this.selectedMeshes.forEach(mesh => {
            if (mesh !== exceptMesh) {
                this.removeHighlight(mesh);
            }
        });
    }

    // 创建高亮材质（材质替换模式）
    private createHighlightMaterial(): StandardMaterial {
        const mat = new StandardMaterial("highlightMat", this.scene);
        mat.diffuseColor = this.options.color!;
        mat.specularColor = Color3.Black(); // 取消反光
        return mat;
    }

    // 材质过渡动画
    private animateMaterialTransition(mesh: AbstractMesh, targetMat: any) {
        // 实现颜色插值动画（示例简化，可用Tween或Babylon动画系统）
        mesh.material = targetMat; // 实际项目应使用动画系统
    }

    // 销毁资源
    dispose() {
        this.clearHighlights();
        if (this.highlightLayer) {
            this.highlightLayer.dispose();
        }
        this.scene.onPointerDown = null; // 移除事件监听
    }
}