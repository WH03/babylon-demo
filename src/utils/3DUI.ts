// // htmlMesh 创建方法
// function createHtmlMeshFromTemplate(htmlContent, cssText, width = 4, height = 3, position = new Vector3(0, 0, 0)) {
//     const htmlRenderer = new HtmlMeshRenderer(baseScene.scene);
//     const htmlMesh = new HtmlMesh(baseScene.scene, "html-overlay-mesh", {
//         captureOnPointerEnter: true,
//         isCanvasOverlay: true,
//     });

//     const container = document.createElement("div");
//     container.className = "htmlDom";
//     container.innerHTML = htmlContent;

//     const style = document.createElement("style");
//     style.textContent = cssText;
//     container.prepend(style);

//     htmlMesh.setContent(container, width, height);
//     htmlMesh.material.diffuseColor = new Color4.FromHexString("#0f1f42");
//     htmlMesh.position = position;
//     htmlMesh.billboardMode = TransformNode.BILLBOARDMODE_ALL;

//     // 把 DOM 节点挂载到 mesh 对象上，便于后续操作
//     htmlMesh.domRoot = container;

//     return htmlMesh;
// }
