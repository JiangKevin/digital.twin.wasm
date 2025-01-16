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
    var menu_navigation_item = ref("All Proejcts");
    //
    var menu_items = [
        { text: "All Proejcts", icon: "mdi-folder", active: true, disabled: false, route: "/all_project", sub: [] },
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
            text: "Model Editor",
            icon: "mdi-map-marker-distance",
            active: false,
            disabled: false,
            route: "/cascad_editor",
            sub: [
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
        {
            text: "Term Terminal",
            icon: "mdi-console-network",
            active: false,
            disabled: false,
            route: "/xterm",
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
    var card_items_selection = [];
    //
    var user_info = { username: "admin", password: "", token: "", image: avatarImgUrl, email: "kevin.jiang@fmbj.com.cn", fullname: "Kevin Jiang" };
    var modelUrl = "";
    var is_show_viewport = false;
    //
    var instruction = {
        path: "./Data",
        path_len: 2,
        dictate: "",
        parameter: "",
        result: "",
    };
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
    return { instruction, menu_items, menu_editor_items, menu_help_items, drawer, rail, user_info, editor_log, login_log, reset_menu_status, menu_navigation_item, yn_show_code_contain, yn_show_code_btn, is_busy, card_items_selection, card_items, menu_exit_items, modelUrl, is_show_viewport };
});
//
export const useStoreForProject = defineStore("project", () => {
    var drawer = ref(false);
    var project_log = ref("");
    var user_project_list = [];
    var project_list = [];
    var project_selected_to_modify = {};
    var project_info = { name: "demo", wizard: "template", info: "This is new project.", resource: [] };
    var resource_info = { project: "demo", resource: [] };
    var res_import_commond_list = ["model", "anim", "scene", "node", "dump", "lod"];
    var res_import_commond_info = { command: "model", parameter: "-l" };
    var res_import_des_info = { desPath: "Textures" };

    var project_modify_type = ref("");
    var wizard_list = [];

    //
    return { drawer, project_log, user_project_list, project_list, project_selected_to_modify, project_info, project_modify_type, wizard_list, resource_info, res_import_commond_list, res_import_commond_info, res_import_des_info };
});
//
export const useStoreForFiles = defineStore("files", () => {
    var files_log = ref("");
    var win_height = ref(0);
    var win_width = ref(0);

    //
    var folder_and_files = [];
    var selected_folder_path = "./";
    var selected_folder_and_files = [];
    var selected_zip_files = [];
    var copy_folder_and_files = [];
    //
    var is_right_files_drawer = ref(false);
    var is_right_files_del_drawer = ref(false);
    var is_right_files_zip_drawer = ref(false);
    var is_right_files_unzip_drawer = ref(false);
    var is_right_files_copy_drawer = ref(false);
    var is_right_files_paste_drawer = ref(false);
    var is_right_files_newFolder_drawer = ref(false);
    //
    var to_create_new_folder = "NewFolder";
    var to_zip_name = "tmp";
    var to_unzip_name = "tmp";

    //
    return { files_log, folder_and_files, selected_folder_path, selected_folder_and_files, is_right_files_copy_drawer, is_right_files_drawer, is_right_files_del_drawer, is_right_files_zip_drawer, is_right_files_unzip_drawer, is_right_files_paste_drawer, is_right_files_newFolder_drawer, to_create_new_folder, copy_folder_and_files, to_zip_name, to_unzip_name, win_width, win_height };
});
