import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/BaseScene",
    name: "BaseScene",
    meta: { title: "创建图形" },
    component: () => import("../views/BaseScene/index.vue"),
  },
  {
    path: "/model",
    name: "model",
    meta: { title: "模型" },
    component: () => import("../views/model/index.vue"),
  },
  {
    path: "/interaction",
    name: "interaction",
    meta: { title: "交互事件" },
    component: () => import("../views/interaction/index.vue"),
  }, {
    path: "/animate",
    name: "animate",
    meta: { title: "动画" },
    component: () => import("../views/animate/index.vue"),
  }, {
    path: "/getConter",
    name: "getConter",
    meta: { title: "中心点" },
    component: () => import("../views/getConter/index.vue"),
  }, {
    path: "/texture",
    name: "texture",
    meta: { title: "纹理贴图" },
    component: () => import("../views/texture/index.vue"),
  }, {
    path: "/modelList",
    name: "modelList",
    meta: { title: "模型列表" },
    component: () => import("../views/modelList/index.vue"),
  },

];

const router = createRouter({
  mode: history,
  // base:process.env.BASE_URL,
  history: createWebHistory(),
  routes,
});

export default router;
