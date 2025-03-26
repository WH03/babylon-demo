import { Color3, Color4, Scene, AbstractMesh, TransformNode } from "babylonjs";
import { BabylonNode, ModelColor } from "./type";

export class ModelUtil {
  static toColor3(c: ModelColor) {
    return new Color3(c.r / 255, c.g / 255, c.b / 255);
  }
  static toColor4(c: ModelColor) {
    return new Color4(c.r / 255, c.g / 255, c.b / 255, c.a ? c.a : 1);
  }
  static getBabylonNodeIfNeed(scene: Scene, box: BabylonNode) {
    if (box instanceof AbstractMesh || box instanceof TransformNode) {
      return box;
    } else if (typeof box == "string") {
      let mesh: AbstractMesh | null = scene.getMeshById(box);
      if (mesh) {
        return mesh;
      }
      let node: TransformNode | null = scene.getTransformNodeById(box);
      if (node) {
        return node;
      }
    } else if (typeof box == "number") {
      let mesh: AbstractMesh | null = scene.getMeshByUniqueId(box);
      if (mesh) {
        return mesh;
      }
      let node: TransformNode | null = scene.getTransformNodeByUniqueId(box);
      if (node) {
        return node;
      }
    } else if (box.id) {
      let mesh: AbstractMesh | null = scene.getMeshById(box.id);
      if (mesh) {
        return mesh;
      }
      let node: TransformNode | null = scene.getTransformNodeById(box.id);
      if (node) {
        return node;
      }
    } else if (box.name) {
      let mesh: AbstractMesh | null = scene.getMeshByName(box.name);
      if (mesh) {
        return mesh;
      }
      let node: TransformNode | null = scene.getTransformNodeByName(box.name);
      if (node) {
        return node;
      }
    } else if (box.uniqueId) {
      let mesh: AbstractMesh | null = scene.getMeshByUniqueId(box.uniqueId);
      if (mesh) {
        return mesh;
      }
      let node: TransformNode | null = scene.getTransformNodeByUniqueId(
        box.uniqueId
      );
      if (node) {
        return node;
      }
    }
    return null;
  }
  static toHexColor(color: ModelColor) {
    const format = (num: number) => num.toString(16).padStart(2, "0");
    return `#${format(color.r)}${format(color.g)}${format(color.b)}${format(
      (color.a || 1) * 255
    )}`;
  }

  static rem2Px(rem: number) {
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    return rem * rootFontSize;
  }

  /**
   * 将rem单位转换为场景尺寸的百分比
   *
   * 此函数的目的是将rem单位的尺寸值转换为相对于当前窗口宽度的百分比
   * 它首先需要获取根元素（html元素）的字体大小，以便计算出rem对应的像素值
   * 然后，它将这个像素值转换为相对于窗口宽度的百分比，用于在不同屏幕尺寸上保持一致的视觉效果
   *
   * @param rem rem单位的尺寸值，通常用于表示CSS中的长度和尺寸
   * @returns 返回相对于当前屏幕宽度的百分比，表示rem单位尺寸的场景尺寸  （3D模型的视角宽度以显示器为参考划分为100份，也就是初始视场中相当于屏幕宽度的内容宽度为100）
   */
  static rem2SceneSzie(rem: number) {
    // 获取根元素（html元素）的字体大小，单位为像素
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    // 将rem值转换为对应的像素值
    const px = rem * rootFontSize;
    // 计算并返回相对于窗口宽度的百分比
    return (px * 100) / window.screen.width;
  }
}
