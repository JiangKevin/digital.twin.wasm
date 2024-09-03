import { createRouter, createWebHistory } from "vue-router";
import AppTemplate from "@/components/AppTemplate";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "wsdt",
    },
    {
      path: "/wsdt/",
      component: AppTemplate,
      children: [
        {
          path: "",
          name: "wsdt",
          component: () => import("@/views/wasm_editor"),
        },
      ],
    },
    {
      path: "/csdt/",
      component: AppTemplate,
      children: [
        {
          path: "",
          name: "csdt",
          component: () => import("@/views/cascad_editor"),
        },
      ],
    },
    {
      path: "/login/",
      children: [
        {
          path: "",
          name: "Login",
          component: () => import("@/views/login"),
        },
      ],
    },
  ],
});

export default router;
