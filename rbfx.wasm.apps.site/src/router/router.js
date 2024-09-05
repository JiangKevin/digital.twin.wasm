import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import AppTemplate from "@/components/AppTemplate";
//
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/main_contain",
        },
        {
            path: "/main_contain",
            component: AppTemplate,
            children: [
                {
                    path: "",
                    name: "main_contain",
                    component: () => import("@/views/FmContain"),
                },
            ],
        },
        {
            path: "/login",
            name: "login",
            component: () => import("@/views/login"),
        },
    ],
});

export default router;
