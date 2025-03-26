import { Scene, Vector3, Animation, Nullable, Mesh } from "babylonjs";

import {
  AnimationManager,
  AnimationMove,
  AnimationRotation,
  AnimationScaling,
  BabylonNodeObject,
} from "./type";
import { ModelUtil } from "./ModelUtil";

class AnimationManagerImpl implements AnimationManager {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }
  public move(params: AnimationMove) {
    const { box, duration = 0, to } = params;
    const { x = 0, y = 0, z = 0 } = to;
    const node = ModelUtil.getBabylonNodeIfNeed(this.scene, box);
    if (node) {
      const end = new Vector3(x, y, z);
      if (duration > 0) {
        this.positionAnimation(
          node,
          duration,
          node.position.clone(),
          end,
          (node) => {
            params.onComplete?.call(null, node);
          }
        );
      } else {
        node.position = end;
      }
    } else {
      console.warn(
        `Cannot move model or node with ${box} because it does not exist in the scene.`
      );
    }
  }

  public scaling(params: AnimationScaling) {
    const originalNode: Nullable<BabylonNodeObject> =
      ModelUtil.getBabylonNodeIfNeed(this.scene, params.box);

    if (originalNode) {
      const { duration = 0, to = { x: 1, y: 1, z: 1 }, from } = params;
      const fromVector3 = from
        ? new Vector3(from.x, from.y, from.z)
        : originalNode.absoluteScaling.clone();
      const toVector3 = new Vector3(to.x, to.y, to.z);

      if (duration > 0) {
        this.scalingAnimation(
          originalNode,
          duration,
          fromVector3,
          toVector3,
          (node) => {
            params.onComplete?.call(null, node);
          }
        );
      } else {
        originalNode.scaling = toVector3;
      }
    } else {
      console.warn(
        `Cannot scaling model or node with ${params.box} because it does not exist in the scene.`
      );
    }
  }

  public rotation(params: AnimationRotation) {
    const { box, duration = 0, to } = params;
    const { x = 0, y = 0, z = 0 } = to;
    const end = new Vector3(x, y, z);

    const originalNode = ModelUtil.getBabylonNodeIfNeed(this.scene, box);
    if (originalNode) {
      if (duration > 0) {
        this.rotationAnimation(
          originalNode,
          duration,
          originalNode.rotation,
          end,
          (node) => {
            params.onComplete?.call(null, node);
          }
        );
      } else {
        originalNode.rotation = end;
      }
    } else {
      console.warn(
        `Cannot rotation model or node with  ${box} because it does not exist in the scene.`
      );
    }
  }

  private positionAnimation<T extends BabylonNodeObject>(
    // box: T,
    box: Mesh | T,
    duration: number,
    start: Vector3,
    end: Vector3,
    onComplete?: (node: T) => void
  ) {
    const animation = new Animation(
      `${box.id}_positionAnimation`,
      "position",
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    animation.setKeys([
      { frame: 0, value: start },
      { frame: (duration * 30) / 1000, value: end },
    ]);
    box.animations.push(animation);
    this.scene.beginAnimation(box, 0, (duration * 30) / 1000, false, 1, () => {
      const index = box.animations.indexOf(animation);
      if (index !== -1) {
        box.animations.splice(index, 1);
      }
      box.position = end;
      onComplete?.call(null, box);
    });
  }

  private scalingAnimation<T extends BabylonNodeObject>(
    box: T,
    duration: number,
    start: Vector3,
    end: Vector3,
    onComplete?: (box: T) => void
  ) {
    const animation = new Animation(
      `${box.id}_scalingAnimation`,
      "scaling",
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    animation.setKeys([
      { frame: 0, value: start },
      { frame: (duration / 1000) * 30, value: end },
    ]);
    box.animations.push(animation);
    this.scene.beginAnimation(box, 0, (duration / 1000) * 30, false, 1, () => {
      // const index = box.animations.indexOf(animation);
      // if (index !== -1) {
      // box.animations.splice(index, 1);
      // }
      box.scaling = end;
      onComplete?.call(null, box);
    });
  }

  private rotationAnimation<T extends BabylonNodeObject>(
    box: T,
    duration: number,
    start: Vector3,
    end: Vector3,
    onComplete?: (box: T) => void
  ) {
    const animation = new Animation(
      `${box.id}_rotationAnimation`,
      "rotation",
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    animation.setKeys([
      { frame: 0, value: start },
      { frame: (duration / 1000) * 30, value: end },
    ]);
    box.animations.push(animation);
    this.scene.beginAnimation(box, 0, (duration / 1000) * 30, false, 1, () => {
      const index = box.animations.indexOf(animation);
      if (index !== -1) {
        box.animations.splice(index, 1);
      }
      box.rotation = new Vector3(
        end.x % (Math.PI * 2),
        end.y % (Math.PI * 2),
        end.z % (Math.PI * 2)
      );
      onComplete?.call(null, box);
    });
  }
  reset() { }
}
export const newInstance = (scene: Scene): AnimationManager => {
  return new AnimationManagerImpl(scene);
};
