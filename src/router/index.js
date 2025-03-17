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
  },

];

const router = createRouter({
  mode: history,
  // base:process.env.BASE_URL,
  history: createWebHistory(),
  routes,
});

export default router;
