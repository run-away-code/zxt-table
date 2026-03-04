import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/zxt-table",
  },
  {
    path: "/zxt-table",
    name: "ZxtTable",
    component: () => import("../examples/views/ZxtTableExample.vue"),
    meta: { title: "ZxtTable 基础表格" },
  },
  {
    path: "/zxt-grid",
    name: "ZxtGrid",
    component: () => import("../examples/views/ZxtGridExample.vue"),
    meta: { title: "ZxtGrid 可配置表格" },
  },
  {
    path: "/zxt-grid-demo",
    name: "ZxtGridDemo",
    component: () => import("../examples/ZxtGridDemo.vue"),
    meta: { title: "ZxtGrid 独立 Demo" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
