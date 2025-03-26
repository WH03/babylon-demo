import {
    AbstractMesh,
    TransformNode,
    GlowLayer,
    Vector3,
    Mesh,
} from "babylonjs";
export type BabylonNodeObject = AbstractMesh | TransformNode;

export interface ThreeDimensional {
    x?: number;
    y?: number;
    z?: number;
}

interface AnimationParams {
    // box: BabylonNode;
    box: any;
    duration: number;
    // type: "scaling" | "position" | "rotation";
}


interface AnimationParams {
    // box: BabylonNode;
    box: any;
    duration: number;
    // type: "scaling" | "position" | "rotation";
}

export interface AnimationMove extends AnimationParams {
    from?: ThreeDimensional;
    to: ThreeDimensional;
    onComplete?: (node: BabylonNodeObject) => void;
}

export interface AnimationScaling extends AnimationParams {
    from?: ThreeDimensional;
    to: ThreeDimensional;
    onComplete?: (node: BabylonNodeObject) => void;
}

export interface AnimationRotation extends AnimationParams {
    from?: ThreeDimensional;
    to: ThreeDimensional;
    onComplete?: (node: BabylonNodeObject) => void;
}
export interface AnimationManager {
    move(params: AnimationMove): void;
    scaling(params: AnimationScaling): void;
    rotation(params: AnimationRotation): void;
    reset(): void;
}


export type BabylonNode =
    | AbstractMesh
    | TransformNode
    | string
    | number
    | { name?: string; id?: string; uniqueId?: number };


export type Animation = AnimationScaling;

export type ModelColor = { r: number; g: number; b: number; a?: number };