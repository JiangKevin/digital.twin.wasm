<!-- template -->
<template>
    <div class="main_container_content_max blur_div_95">
        <!--  -->
        <div class="main_container_toolbar_no_pm">
            <!--  -->
            <button class="toolbar_btn_wide" @click="top_button_go_path(mainStore_files.selected_folder_path)"><i class="mdi-arrow-up mdi"></i></button>
            <v-divider vertical class="divider_vertical"></v-divider>
            <!--  -->
            <button class="toolbar_btn" @click="create_new_folder"><i class="mdi-folder-plus mdi"></i></button>
            <v-divider vertical class="divider_vertical"></v-divider>
            <!--  -->
            <button class="toolbar_btn" @click=""><i class="mdi-check-all mdi"></i></button>
            <v-divider vertical class="divider_vertical"></v-divider>
            <!--  -->
            <button class="toolbar_btn" @click=""><i class="mdi-broom mdi"></i></button>
            <v-divider vertical class="divider_vertical"></v-divider>
            <!--  -->
            <button class="toolbar_btn" @click=""><i class="mdi-folder-zip mdi"></i></button>
            <v-divider vertical class="divider_vertical"></v-divider>
            <!--  -->
            <button class="toolbar_btn" @click=""><i class="mdi-folder-zip-outline mdi"></i></button>
            <v-divider vertical class="divider_vertical"></v-divider>
            <!--  -->
            <button class="toolbar_btn" @click=""><i class="mdi-content-copy mdi"></i></button>
            <v-divider vertical class="divider_vertical"></v-divider>
            <!--  -->
            <button class="toolbar_btn" @click=""><i class="mdi-content-paste mdi"></i></button>
            <v-divider vertical class="divider_vertical"></v-divider>
            <!--  -->
            <button class="toolbar_btn" @click=""><i class="mdi-delete mdi"></i></button>
            <v-divider vertical class="divider_vertical"></v-divider>
            <!--  -->
            <span>{{ mainStore_files.selected_folder_path }}</span>
        </div>
        <div class="main_container_content">
            <v-layout full-height>
                <v-main class="main_contain_files">
                    <v-item-group multiple>
                        <v-row dense>
                            <v-col v-for="n in mainStore_files.folder_and_files" cols="12" md="2">
                                <v-item>
                                    <v-card class="mx-auto opacity-70 fm_not_select" :color="n.selected ? 'fm_card_select' : 'fm_card'" rounded="0" density="compact">
                                        <template v-slot:title>
                                            <span class="fm_file_card_tittle">{{ n.name }}</span>
                                        </template>
                                        <template v-slot:subtitle>
                                            <span class="fm_file_card_subtittle">{{ n.uptime }}</span>
                                        </template>
                                        <template v-slot:prepend>
                                            <v-avatar @click="folder_or_files_click(n)" class="fm_card_prepend_avatar">
                                                <v-icon :icon="get_icon_for_file_type(n)"></v-icon>
                                                <v-tooltip activator="parent" content-class="fm_tool_card_tooltip" opacity="0.1" location="end" v-if="is_folder_type(n)">Click to enter this folder</v-tooltip>
                                            </v-avatar>
                                        </template>
                                        <template v-slot:append>
                                            <v-avatar class="fm_card_append_avatar_for_check" size="36">
                                                <div v-if="get_no_top_folder(n)">
                                                    <v-checkbox v-model="n.selected" @click="folder_or_files_check_click(n)"></v-checkbox>
                                                </div>
                                            </v-avatar>
                                        </template>
                                    </v-card>
                                </v-item>
                            </v-col>
                        </v-row>
                    </v-item-group>
                </v-main>
                <v-navigation-drawer location="right" permanent temporary width="400" v-model="mainStore_files.is_right_files_drawer">
                    <!--  -->
                    <div v-show="mainStore_files.is_right_files_newFolder_drawer" class="r_modify_div">
                        <v-text-field label="New Folder Name" variant="outlined" v-model="mainStore_files.to_create_new_folder" rounded="0" density="compact">
                            <template v-slot:prepend>
                                <v-avatar class="fm_card_prepend_avatar_no_hover">
                                    <v-icon icon="mdi-folder-plus"></v-icon>
                                </v-avatar>
                            </template>
                        </v-text-field>
                        <div class="submit_contain">
                            <v-card-actions class="fm_v_card_actions">
                                <v-btn class="ml-auto submit_btn" variant="elevated" rounded="0" text="New Folder" @click=""></v-btn>
                                <v-btn class="ml-auto submit_btn" variant="elevated" rounded="0" text="Close" @click="close_files_drawer"></v-btn>
                            </v-card-actions>
                        </div>
                    </div>
                </v-navigation-drawer>
            </v-layout>
        </div>
        <div class="main_container_status_no_pm">
            <span id="resouse_log_output">{{ mainStore_files.files_log }}</span>
        </div>
        <!--  -->
    </div>
</template>
<!--  script  -->
<script setup>
import { ref, onMounted, onUnmounted, onUpdated, onActivated } from "vue";
import { fm_addScript, fm_addScript_for_dtwin, fm_delScript, open_rbfx_code_file, saveCodeToFile, busy_div_control, saveShapeSTL, loadSTEPorIGES } from "@/plugins/base.js";
import { useStoreForFiles } from "@/stores/globle.js";
const mainStore_files = useStoreForFiles();
//
function getFilesList(path) {
    axios
        .get("/all_folder_and_files?path=" + path)
        .then((response) => {
            if (path == "./") {
                mainStore_files.folder_and_files = response.data;
            } else {
                mainStore_files.folder_and_files = response.data;
            }
            //
            mainStore_files.selected_folder_path = path;
            mainStore_files.selected_folder_and_files = [];
        })
        .catch((error) => {
            console.error(error);
        });
}
//
function get_icon_for_file_type(item) {
    if (item.type == "folder") {
        return "mdi-folder";
    } else {
        return "mdi-file";
    }
}
//
function is_folder_type(item) {
    return item.type == "folder";
}
//
function get_no_top_folder(item) {
    // console.log(item)
    if (item.filePath == "./Data" || item.filePath == "./Upload") {
        return false;
    } else {
        return true;
    }
}
//
function folder_or_files_click(item) {
    if (item.type == "folder") {
        getFilesList(item.filePath);
        mainStore_files.selected_folder_path = item.filePath;
        if (mainStore_files.is_right_files_copy_drawer != true) {
            mainStore_files.selected_folder_and_files = [];
        }
    }
}
//
function get_array_split_path(path) {
    var array = path.split("/");
    return array;
}
//
function top_button_go_path(path) {
    if (path == "./") {
        getFilesList("./");
    } else if (path == "./Data") {
        getFilesList("./");
    } else if (path == "./Upload") {
        getFilesList("./");
    } else {
        var path_array = get_array_split_path(path);
        var new_path = "";
        for (var i = 0; i < path_array.length - 1; i++) {
            new_path = new_path + path_array[i] + "/";
        }
        new_path = new_path.slice(0, -1);
        getFilesList(new_path);
    }
    //
    if (mainStore_files.is_right_files_copy_drawer != true) {
        mainStore_files.selected_folder_and_files = [];
    }
}
function close_files_drawer() {
    mainStore_files.is_right_files_drawer = false;
    mainStore_files.is_right_files_del_drawer = false;
    mainStore_files.is_right_files_zip_drawer = false;
    mainStore_files.is_right_files_unzip_drawer = false;
    mainStore_files.is_right_files_copy_drawer = false;
    mainStore_files.is_right_files_paste_drawer = false;
    mainStore_files.is_right_files_newFolder_drawer = false;
}
//
function create_new_folder() {
    //
    if (mainStore_files.selected_folder_path != "./") {
        close_files_drawer();
        mainStore_files.is_right_files_drawer = true;
        mainStore_files.is_right_files_newFolder_drawer = true;
    }
}
//
onMounted(() => {
    getFilesList("./");
});
</script>

<!--  style  -->
<style scoped>
.main_contain_files {
    padding: 8px;
    padding-right: 0px;
}
.fm_not_select {
    user-select: none !important;
}
.fm_not_select:hover {
    user-select: none !important;
    background: #6200ea !important;
}
.fm_file_card_tittle {
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: xx-small;
}
.fm_file_card_subtittle {
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: x-small;
}
.fm_card_prepend_avatar {
    background: #291fb5 !important;
}
.fm_card_prepend_avatar:hover {
    background: #eaa800 !important;
}
/*  */
.r_modify_div {
    margin: 0;
    border-left: 1px solid var(--fm_toolbar_boder);
    height: 100%;
    padding-left: 10px;
    padding-right: 8px;
    padding-top: 20px;
    background-color: var(--fm_toolbar);
}
.fm_card_append_avatar_for_check {
    background: #291fb500 !important;
    text-align: center;
    margin: 0px;
    padding-top: 22px;
}
.fm_card_prepend_avatar_no_hover {
    background: #291fb5 !important;
}
.submit_btn {
    height: 24px;
    width: 50%;
    border: none;
    font-size: 12px !important;
    color: white !important;
    background-color: #cf1415;
    border-radius: 0px !important;
    text-align: center;
}
.submit_contain {
    width: 100%;
    position: absolute;
    bottom: 2px;
    left: 0px;
}
.fm_v_card_actions {
    padding: 0rem;
}
</style>
