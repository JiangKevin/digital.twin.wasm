import { ref, computed } from "vue";
import { defineStore } from "pinia";
import avatarImgUrl from "@/assets/img/85.jpg";
//
export const useStoreForMenu = defineStore("menu", () => {
    var drawer = ref(true);
    var rail = ref(false);
    var is_logined = ref(true);
    var login_log = ref("");
    var yn_show_code_contain = ref(false);
    //
    var menu_navigation_item = ref("All Proejcts");
    //
    var menu_items = [
        { text: "All Proejcts", icon: "mdi-folder", active: false, disabled: false, route: "/all_project" },
        { text: "Files Browse", icon: "mdi-view-list", active: false, disabled: false, route: "/files_browse" },
    ];
    var menu_editor_items = [
        { text: "CAD Editor", icon: "mdi-ruler-square-compass", active: false, disabled: false, route: "/cascad_editor" },
        { text: "Scene Editor", icon: "mdi-microsoft-xbox-controller", active: false, disabled: false, route: "/digital_twin_editor" },
    ];
    var menu_help_items = [{ text: "Editor Help", icon: "mdi-progress-question", active: false, disabled: false, route: "/help" }];
    //
    var user_info = { username: "admin", password: "", token: "", image: avatarImgUrl, email: "kevin.jiang@fmbj.com.cn", fullname: "Kevin Jiang" };
    //
    function reset_menu_status() {
        for (var i = 0; i < menu_items.length; i++) {
            menu_items[i].active = false;
        }
        for (var i = 0; i < menu_editor_items.length; i++) {
            menu_editor_items[i].active = false;
        }
        for (var i = 0; i < menu_help_items.length; i++) {
            menu_help_items[i].active = false;
        }
    }
    //
    return { menu_items, menu_editor_items, menu_help_items, drawer, rail, user_info, reset_menu_status, menu_navigation_item, yn_show_code_contain };
});
//
export const useStoreForHome = defineStore("home", () => {
    const count = ref(0);
    //

    //
    const doubleCount = computed(() => count.value * 2);
    function increment() {
        count.value++;
    }

    return { count, doubleCount, increment };
});
//
export const useStoreForLogin = defineStore("login", () => {
    const count = ref(0);
    //

    //
    const doubleCount = computed(() => count.value * 2);
    function increment() {
        count.value++;
    }

    return { count, doubleCount, increment };
});
