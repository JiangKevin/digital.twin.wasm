import { createRouter, createWebHistory,createWebHashHistory } from "vue-router";
import AppTemplate from "@/components/AppTemplate";
//
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/digital_twin_editor",
    },
    {
      path: "/digital_twin_editor",
      component: AppTemplate,
      children: [
        {
          path: "/",
          name: "digital_twin_editor",
          component: () => import("@/views/wasm_editor"),
        },
      ],
    },
    {
      path: "/cascad_editor",
      component: AppTemplate,
      children: [
        {
          path: "",
          name: "cascad_editor",
          component: () => import("@/views/cascad_editor"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login"),
    },
    {
      path: "/all_project",
      component: AppTemplate,
      children: [
        {
          path: "",
          name: "all_project",
          component: () => import("@/views/wasm_editor"),
        },
      ],
    },
    {
      path: "/files_browse",
      component: AppTemplate,
      children: [
        {
          path: "",
          name: "files_browse",
          component: () => import("@/views/wasm_editor"),
        },
      ],
    },
  ],
});

export default router;
