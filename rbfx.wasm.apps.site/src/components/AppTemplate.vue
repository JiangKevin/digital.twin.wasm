<!-- template -->
<template>
    <v-layout full-height>
        <v-navigation-drawer v-model="mainStore_menu.drawer" :rail="mainStore_menu.rail" permanent class="blur_div_80" style="user-select: none !important">
            <v-list>
                <v-list-item :subtitle="mainStore_menu.user_info.email" :title="mainStore_menu.user_info.fullname">
                    <template v-slot:prepend>
                        <v-avatar>
                            <v-img cover :src="mainStore_menu.user_info.image" @click="view_manu_ck"></v-img>
                        </v-avatar>
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
                <v-item-group v-model="mainStore_menu.card_items_selection" multiple class="menu_group_items">
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
                <!--  -->
                <v-divider></v-divider>
                <v-list density="compact" nav>
                    <v-list-item v-for="(item, i) in mainStore_menu.menu_exit_items" :key="i" :value="item" :active="item.active" :disabled="item.disabled" @click="route_ck(item)">
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
import { Pane } from "@/assets/js/Tweakpane/tweakpane.min.js";
import router from "@/router/router";
//
FM_GLOBAL.TWEAKPANLE = new Pane({
    title: "Parameters",
    expanded: false,
    hidden: true,
});
//
import { fm_addScript, fm_addScript_for_dtwin, fm_delScript, open_rbfx_code_file, saveCodeToFile, busy_div_control, clear_busy_log, saveShapeSTL, loadSTEPorIGES } from "@/plugins/base.js";

//
function route_ck(item) {
    mainStore_menu.reset_menu_status();
    mainStore_menu.card_items = item.sub;
    item.active = true;
    //
    if (item.text == "Exit Application") {
        logout_ck();
    } else if (item.text == "CAD Editor") {
        var vs_code_contain = document.getElementById("vs_code_contain");
        vs_code_contain.style.width = "600px";
        //
        mainStore_menu.yn_show_code_btn = true;
        if (!is_load_cad_wasm) {
            busy_div_control("other_log", true);
            clear_busy_log("story");
        }
        //
        if (FM_GLOBAL.TWEAKPANLE) {
            if (is_load_cad_wasm) {
                FM_GLOBAL.TWEAKPANLE.hidden = false;
            }
        }
    } else if (item.text == "Scene Editor") {
        var vs_code_contain = document.getElementById("vs_code_contain");
        vs_code_contain.style.width = "600px";
        //
        mainStore_menu.yn_show_code_btn = true;
        //
        if (!is_load_rbfx_wasm) {
            busy_div_control("other_log", true);
            clear_busy_log("story");
        }
        //
        if (FM_GLOBAL.TWEAKPANLE) {
            FM_GLOBAL.TWEAKPANLE.hidden = true;
        }
    } else if (item.text == "Editor Help") {
        mainStore_menu.yn_show_code_btn = false;
        //
        if (FM_GLOBAL.TWEAKPANLE) {
            FM_GLOBAL.TWEAKPANLE.hidden = true;
        }
    } else {
        //
        mainStore_menu.yn_show_code_btn = false;
        //
        if (FM_GLOBAL.TWEAKPANLE) {
            FM_GLOBAL.TWEAKPANLE.hidden = true;
        }
    }
    //
    if (mainStore_menu.is_logined) {
        mainStore_menu.menu_navigation_item = item.text;
    } else {
        router.push({ path: "login", replace: true });
    }
}
//
function view_manu_ck() {
    mainStore_menu.rail = !mainStore_menu.rail;
    if (is_load_cad_wasm) {
        var renderer_w;
        if (mainStore_menu.rail) {
            renderer_w = window.innerWidth - 55;
        } else {
            renderer_w = window.innerWidth - 255;
        }
        //
        if (FM_GLOBAL.CAD_RENDERER) {
            FM_GLOBAL.CAD_RENDERER.setSize(renderer_w, window.innerHeight);
        } //
    }
    //
    if (is_load_model_editor) {
        if (mainStore_menu.rail) {
            FM_GLOBAL.CONTAINER.emit("CONTAINER SIZE CHANGE", "Javascript 发布-订阅模式");
        } else {
            FM_GLOBAL.CONTAINER.emit("CONTAINER SIZE CHANGE", "Javascript 发布-订阅模式");
        }
    }
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
    }
    is_load_rbfx_wasm = false;
    is_load_cad_wasm = false;
    //
    fm_delScript("./common.data.js");
    fm_delScript("./common.js");
    fm_delScript("./CasCadEditor.data.js");
    fm_delScript("./CasCadEditor.js");
    fm_delScript("./runtime/basic/cascad_wrap.js");
    fm_delScript("./runtime/basic/digital_twin_wrap.js");
    //
    router.push({ path: "login", replace: true });
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
onMounted(() => {
    mainStore_menu.yn_show_code_btn = false;
    //
    if (mainStore_menu.is_logined != true) {
        router.push({ path: "login", replace: true });
    }
    //
    var code_frame = document.getElementById("vs_code_frame");
    if (code_frame) {
        code_frame.onload = function () {
            FM_GLOBAL.MONACO_EDITOR = window.frames["vs_code_frame"].contentWindow.FM_GLOBAL.editor;
            var log_span = document.getElementById("rbfx-output");
            open_rbfx_code_file(FM_GLOBAL.MONACO_EDITOR, log_span);
        };
    }
    //
    FM_GLOBAL.LOG = document.getElementById("story");
});
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
.logout_btn {
    width: 100%;
    min-width: 53px;
}
</style>
