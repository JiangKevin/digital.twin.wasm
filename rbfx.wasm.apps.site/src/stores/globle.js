import { ref, computed } from "vue";
import { defineStore } from "pinia";
import avatarImgUrl from "@/assets/img/85.jpg";
//
export const useStoreForMenu = defineStore("menu", () => {
    var drawer = ref(true);
    var rail = ref(true);
    var is_logined = ref(true);
    var is_busy = ref(false);
    var yn_show_code_contain = ref(false);
    var yn_show_code_btn = ref(false);

    //
    var login_log = ref("");
    var editor_log = ref("");
    var menu_navigation_item = ref("Editor Help");
    //
    var menu_items = [
        { text: "All Proejcts", icon: "mdi-folder", active: false, disabled: false, route: "/all_project", sub: [] },
        { text: "Files Browse", icon: "mdi-view-list", active: false, disabled: false, route: "/files_browse", sub: [] },
    ];
    var menu_editor_items = [
        {
            text: "CAD Editor",
            icon: "mdi-ruler-square-compass",
            active: false,
            disabled: false,
            route: "/cascad_editor",
            sub: [
                {
                    icon: "mdi-crowd",
                },
                {
                    icon: "mdi-crowd",
                },
                {
                    icon: "mdi-crowd",
                },
                {
                    icon: "mdi-crowd",
                },
                {
                    icon: "mdi-crowd",
                },
            ],
        },
        {
            text: "Scene Editor",
            icon: "mdi-microsoft-xbox-controller",
            active: false,
            disabled: false,
            route: "/digital_twin_editor",
            sub: [
                {
                    icon: "mdi-crowd",
                },
            ],
        },
    ];
    var menu_help_items = [{ text: "Editor Help", icon: "mdi-progress-question", active: false, disabled: false, route: "/help", sub: [] }];
    var menu_exit_items = [{ text: "Exit Application", icon: "mdi-exit-to-app", active: false, disabled: false, route: "/login", sub: [] }];

    //
    var card_items = [];
    var card_itemss_selection = [];
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
        for (var i = 0; i < menu_exit_items.length; i++) {
            menu_exit_items[i].active = false;
        }
    }
    //
    return { menu_items, menu_editor_items, menu_help_items, drawer, rail, user_info, editor_log, login_log, reset_menu_status, menu_navigation_item, yn_show_code_contain, yn_show_code_btn, is_busy, card_itemss_selection, card_items, menu_exit_items };
});
//
export const useStoreForProject = defineStore("project", () => {
    var drawer = ref(false);
    var project_log = ref("");
    var user_project_list = [];
    var project_list = [];
    var project_selected_to_modify = {};
    var project_info = { name: "demo", wizard: "template", info: "This is new project.", resource: [] };
    var project_modify_type = ref("");

    //
    return { drawer, project_log, user_project_list, project_list, project_selected_to_modify, project_info, project_modify_type };
});
