import { createRouter, createWebHistory } from "vue-router";
import AppTemplate from "@/components/AppTemplate";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "home",
    },
    {
      path: "/home/",
      component: AppTemplate,
      children: [
        {
          path: "",
          name: "Home",
          component: () => import("@/views/wasm_editor"),
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
