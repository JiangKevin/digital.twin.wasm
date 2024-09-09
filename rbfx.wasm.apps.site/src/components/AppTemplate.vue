<!-- template -->
<template>
    <v-layout full-height>
        <v-navigation-drawer v-model="mainStore_menu.drawer" :rail="mainStore_menu.rail" permanent class="blur_div">
            <v-list>
                <v-list-item :subtitle="mainStore_menu.user_info.email" :title="mainStore_menu.user_info.fullname">
                    <template v-slot:prepend>
                        <v-avatar>
                            <v-img cover :src="mainStore_menu.user_info.image" @click="view_manu_ck"></v-img>
                        </v-avatar>
                    </template>
                    <template v-slot:append>
                        <v-btn icon="mdi-exit-to-app" size="small" variant="text" @click="logout_ck"></v-btn>
                    </template>
                </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <!--  -->
            <v-list density="compact" nav>
                <v-list-item v-for="(item, i) in mainStore_menu.menu_items" :key="i" :value="item" :active="item.active" :disabled="item.disabled" @click="route_ck(item)">
                    <template v-slot:prepend>
                        <v-icon :icon="item.icon"></v-icon>
                    </template>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item>
            </v-list>
            <!--  -->
            <v-divider></v-divider>
            <v-list density="compact" nav>
                <v-list-item v-for="(item, i) in mainStore_menu.menu_editor_items" :key="i" :value="item" :active="item.active" :disabled="item.disabled" @click="route_ck(item)">
                    <template v-slot:prepend>
                        <v-icon :icon="item.icon"></v-icon>
                    </template>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item>
            </v-list>

            <!--  -->
            <v-divider></v-divider>
            <v-container class="menu_group_items_contain">
                <v-item-group v-model="mainStore_menu.card_itemss_selection" multiple class="menu_group_items">
                    <v-row class="menu_group_items_row">
                        <v-col v-for="(item, i) in mainStore_menu.card_items" :key="i" class="menu_group_items_col">
                            <v-item v-slot="{ isSelected, toggle }">
                                <v-btn :icon="item.icon" rounded="0"></v-btn>
                            </v-item>
                        </v-col>
                    </v-row>
                </v-item-group>
            </v-container>
            <!--  -->
            <div class="menu_list_fixed">
                <v-divider></v-divider>
                <v-list density="compact" nav>
                    <v-list-item v-for="(item, i) in mainStore_menu.menu_help_items" :key="i" :value="item" :active="item.active" :disabled="item.disabled" @click="route_ck(item)">
                        <template v-slot:prepend>
                            <v-icon :icon="item.icon"></v-icon>
                        </template>
                        <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item>
                </v-list>
            </div>
            <!--  -->
            <div class="fm_main_log_contain">
                <v-divider></v-divider>
                <img :src="logo_src_select(mainStore_menu.rail)" :class="logo_class_select(mainStore_menu.rail)" />
            </div>
            <!--  -->
        </v-navigation-drawer>
        <!--  -->
        <v-main>
            <RouterView></RouterView>
            <!-- code editor div -->
            <div class="resizable" :class="code_div_class_select(mainStore_menu.yn_show_code_contain, mainStore_menu.rail)" id="vs_code_contain" x>
                <!--  -->
                <div class="main_container_toolbar_no_top_padding">
                    <!--  -->
                    <button class="toolbar_btn_wide" @click="code_div_show_ck"><i class="mdi-crowd mdi"></i><v-tooltip activator="parent" content-class="toolbar_btn_tooltip" opacity="0.1" location="end">Open Digital Twin Code Editor</v-tooltip></button>
                    <v-divider vertical class="divider_vertical"></v-divider>
                    <!--  -->
                    <button class="toolbar_btn" @click="run_code_for_editor"><i class="mdi-play mdi"></i><v-tooltip activator="parent" content-class="toolbar_btn_tooltip" opacity="0.1" location="end">Run Digital Twin Code</v-tooltip></button>
                    <v-divider vertical class="divider_vertical"></v-divider>
                    <!--  -->
                    <input id="rbfx-code-file" name="rbfx-code-file" type="file" accept=".js" style="display: none" />
                    <label for="rbfx-code-file" title="Load code from File" class="toolbar_btn_label"><i class="mdi-folder-open mdi"></i><v-tooltip activator="parent" content-class="toolbar_btn_tooltip" opacity="0.1" location="end">Open Code File</v-tooltip></label>
                    <v-divider vertical class="divider_vertical"></v-divider>
                    <!--  -->
                    <button class="toolbar_btn" @click="save_code_ck"><i class="mdi-content-save mdi"></i><v-tooltip activator="parent" content-class="toolbar_btn_tooltip" opacity="0.1" location="end">Save Code File</v-tooltip></button>
                    <v-divider vertical class="divider_vertical"></v-divider>
                </div>
                <!--  -->
                <iframe id="vs_code_frame" src="./code.html" class="code_contain_frame" frameBorder="0"></iframe>
                <!--  -->
                <div class="main_container_status_no_bottom_padding">
                    <span id="rbfx-output"></span>
                </div>
            </div>
            <div :class="code_div_class_select_noshow(mainStore_menu.yn_show_code_contain, mainStore_menu.rail)">
                <button class="toolbar_btn_wide" @click="code_div_show_ck"><i class="mdi-crowd mdi"></i></button>
            </div>
            <!-- busy div  -->
            <div id="other_log" :class="busy_div_class_select(mainStore_menu.rail)">
                <v-progress-circular indeterminate :size="128" :width="8" class="output_progress_div" color="pink"></v-progress-circular>
                <textarea id="story" name="story" rows="8" class="output_wasm"></textarea>
            </div>
        </v-main>
        <!--  -->
    </v-layout>
</template>
<!--  script  -->
<script setup>
import { RouterView } from "vue-router";
//
import { ref, onMounted, onUnmounted, onUpdated, onActivated } from "vue";
import { useStoreForMenu } from "@/stores/globle.js";
const mainStore_menu = useStoreForMenu();
import logoImgUrl_1 from "@/assets/img/logo_1.png";
import logoImgUrl_2 from "@/assets/img/logo_2.png";
import "@/assets/css/animate/animate.min.css";
//
import { fm_addScript, fm_addScript_for_dtwin, fm_delScript, open_rbfx_code_file, saveCodeToFile, busy_div_control } from "@/plugins/base.js";
//
import router from "@/router/router";
function route_ck(item) {
    mainStore_menu.reset_menu_status();
    mainStore_menu.card_items = item.sub;
    item.active = true;
    //
    if (mainStore_menu.is_logined) {
        console.log(item.text);
        mainStore_menu.menu_navigation_item = item.text;
    } else {
        router.push({ path: "login", replace: true });
    }
}
//
function view_manu_ck() {
    mainStore_menu.rail = !mainStore_menu.rail;
}
//
function logout_ck() {
    mainStore_menu.is_logined = false;
    mainStore_menu.user_info.username = "";
    mainStore_menu.user_info.password = "";
    mainStore_menu.user_info.token = "";
    mainStore_menu.user_info.image = "";
    mainStore_menu.user_info.email = "";
    mainStore_menu.user_info.fullname = "";
    //
    if (is_load_rbfx_wasm) {
        FM_GLOBAL.DTWIN_EDITOR._Stop();
    } //
    fm_delScript("./data.js");
    fm_delScript("./common.js");
    router.push({ path: "login", replace: true });
}
//
function code_div_show_ck() {
    mainStore_menu.yn_show_code_contain = !mainStore_menu.yn_show_code_contain;
}
//
function run_code_for_editor() {
    var log_span = document.getElementById("rbfx-output");
    try {
        run_code(FM_GLOBAL.MONACO_EDITOR.getValue());
        log_span.innerText = "+-  Run ok. ";
    } catch (e) {
        log_span.innerText = "+-  " + e.message;
    } finally {
        //
    }
}
//
function save_code_ck() {
    var log_span = document.getElementById("rbfx-output");
    saveCodeToFile(FM_GLOBAL.MONACO_EDITOR.getValue(), log_span);
}
//
function logo_class_select(is_view) {
    if (is_view) {
        return "fm_main_log_min animate__animated animate__rubberBand";
    } else {
        return "fm_main_log animate__animated animate__rubberBand";
    }
}
//
function logo_src_select(is_view) {
    if (is_view) {
        return logoImgUrl_2;
    } else {
        return logoImgUrl_1;
    }
}
//
function code_div_class_select(is_view, rail) {
    var rt = "";
    //
    if (rail) {
        rt = rt + " code_contain_no_left ";
    } else {
        rt = rt + " code_contain_have_left ";
    }
    if (is_view) {
        rt = rt + " show_div ";
    } else {
        rt = rt + " hide_div ";
    }
    //
    return rt;
}
//
function code_div_class_select_noshow(is_view, rail) {
    var rt = "";
    //
    if (rail) {
        rt = rt + " code_contain_no_left_min ";
    } else {
        rt = rt + " code_contain_have_left_min ";
    }
    if (is_view) {
        rt = rt + " hide_div ";
    } else {
        rt = rt + " show_div ";
    }
    //
    return rt;
}
function busy_div_class_select(rail) {
    var rt = "";
    //
    if (rail) {
        rt = rt + " busy_contain_no_left ";
    } else {
        rt = rt + " busy_contain_have_left ";
    }
    //
    return rt;
}
//
onMounted(() => {
    busy_div_control("other_log", false);
    if (mainStore_menu.is_logined != true) {
        router.push({ path: "login", replace: true });
    }
    //
    var code_frame = document.getElementById("vs_code_frame");
    if (code_frame) {
        code_frame.onload = function () {
            console.log("+- From js: frame loaded.");
            FM_GLOBAL.MONACO_EDITOR = window.frames["vs_code_frame"].contentWindow.FM_GLOBAL.editor;
            console.log(FM_GLOBAL.MONACO_EDITOR);
        };
    }
    //
    FM_GLOBAL.LOG = document.getElementById("story");
});
//
function frame_load() {
    console.log("+- From js: frame loaded.");
}
</script>
<!--  style  -->
<style scoped>
.fm_main_log_contain {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 86px;
    text-align: center;
    background-image: url("../assets/img/solar-1.gif");
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    /* background-size: cover; */
    /* background-size:120% 100%; */
    background-size: 200% 180%;
}
.fm_main_log {
    animation-iteration-count: infinite;
    width: 180px;
    margin: 0px;
    padding: 0px;
    text-align: center;
    margin-top: 10px;
}
.fm_main_log_min {
    width: 40px;
    height: 74px;
    animation-iteration-count: infinite;
    padding: 0;
    text-align: center;
    margin: 2px 0px 2px 0px;
    line-height: 74px;
}
.resizable {
    overflow: auto;
    resize: horizontal;
    min-width: 600px;
}
.output_wasm {
    background-color: rgba(0, 0, 255, 0);
    border: none;
    color: aliceblue;
    font-size: 11px;
    width: calc(100% - 16px);
    outline: none;
    resize: none;
    height: calc(100% - 16px);
    margin: 8px;
    padding: 0px;
    /* position: fixed;
    top: 0px; */
    /* right: 6px; */
}
.output_wasm::-webkit-scrollbar {
    width: 0;
    height: 0;
}
.output_progress_div {
    position: fixed;
    top: calc(50% - 64px);
    left: calc(50% - 64px);
}
.menu_group_items {
    padding: 2px;
}
.menu_group_items_row {
    flex-grow: 0;
    margin: 0px;
    padding-left: 4px;
    padding-right: 4px;
    padding-top: 4px;
    padding-bottom: 0px;
}
.menu_group_items_col {
    flex-grow: 0;
    margin: 0px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}
.menu_group_items_contain {
    padding: 0px;
    margin: 0px;
}
.menu_list_fixed {
    position: fixed;
    bottom: 87px;
    width: 100%;
}
</style>
