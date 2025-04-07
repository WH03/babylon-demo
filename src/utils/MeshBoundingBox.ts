import * as BABYLON from 'babylonjs';

/**
 * 获取模型的边界信息
 * @param mesh - 需要获取边界信息的模型
 * @returns 包含边界信息的对象，包括 boundingBox、centerPoint、width、height 和 depth
 */
function meshBoundingBoxInfo(mesh: BABYLON.Mesh) {
    if (!mesh) {
        console.error('无效的 mesh 对象');
        return null;
    }
    // 获取模型的层次包围盒
    const boundingBox = mesh.getHierarchyBoundingVectors();
    // 获取模型的包围盒中心点
    const centerPoint = mesh.getBoundingInfo().boundingBox.center;

    // 计算包围盒的尺寸
    const width = boundingBox.max.x - boundingBox.min.x; // 宽度
    const height = boundingBox.max.y - boundingBox.min.y; // 高度
    const depth = boundingBox.max.z - boundingBox.min.z; // 深度

    // 输出尺寸信息
    // console.log('width: ', width);
    // console.log('height: ', height);
    // console.log('depth: ', depth);

    // 返回边界信息
    return {
        boundingBox,
        centerPoint,
        width,
        height,
        depth,
    };
}

export default meshBoundingBoxInfo;



