<!-- template -->
<template>
    <div class="main_container">
        <v-window v-model="mainStore_menu.menu_navigation_item">
            <v-window-item value="Editor Help">
                <help_view></help_view>
            </v-window-item>
            <v-window-item value="Term Terminal">
                <term_view></term_view>
            </v-window-item>
            <v-window-item value="All Proejcts">
                <project_view></project_view>
            </v-window-item>
            <v-window-item value="Files Browse">
                <file_view></file_view>
            </v-window-item>
            <v-window-item value="CAD Editor">
                <cascad_editor></cascad_editor>
            </v-window-item>
            <v-window-item value="Model Editor">
                <model_editor></model_editor>
            </v-window-item>
            <v-window-item value="Scene Editor">
                <wasm_editor></wasm_editor>
            </v-window-item>
            <v-window-item value="CASCADE Editor">
                <cascade_wasm_editor></cascade_wasm_editor>
            </v-window-item>
        </v-window>
        <!-- code editor div -->
        <div class="resizable blur_div_80"
            :class="code_div_class_select(mainStore_menu.yn_show_code_contain, mainStore_menu.rail, mainStore_menu.yn_show_code_btn)"
            id="vs_code_contain">
            <!--  -->
            <div class="main_container_toolbar_no_top_padding">
                <!--  -->
                <button class="toolbar_btn_wide" @click="code_div_show_ck"><i class="mdi-crowd mdi"></i></button>
                <v-divider vertical class="divider_vertical"></v-divider>
                <div class="left_toolbar_container">
                    <!--  -->
                    <button class="toolbar_btn" @click="run_code_for_editor"><i class="mdi-play mdi"></i></button>
                    <v-divider vertical class="divider_vertical"></v-divider>
                    <!--  -->
                    <div class="toolbar_btn_label">
                        <input id="rbfx-code-file" name="rbfx-code-file" type="file" accept=".js"
                            style="display: none" />
                        <label for="rbfx-code-file" title="Load code from File"><i
                                class="mdi-folder-open mdi"></i></label>
                    </div>
                    <v-divider vertical class="divider_vertical"></v-divider>
                    <!--  -->
                    <button class="toolbar_btn" @click="save_code_ck"><i class="mdi-content-save mdi"></i></button>
                    <v-divider vertical class="divider_vertical"></v-divider>
                </div>
                <div class="middl_toolbar_container">
                    <div class="flex_div" v-show="mainStore_menu.menu_navigation_item == 'CAD Editor'">
                        <!--  -->
                        <div class="toolbar_btn_label" v-show="mainStore_menu.is_show_viewport">
                            <input id="step-file" name="step-file" type="file"
                                accept=".iges,.step,.igs,.stp,.fbx,.obj,.stl" style="display: none" />
                            <label for="step-file" title="Load Model from File"><i
                                    class="mdi-cloud-upload mdi"></i></label>
                        </div>
                        <v-divider vertical class="divider_vertical"></v-divider>
                        <!--  -->
                        <button class="toolbar_btn" @click="down_load_modle_file"><i
                                class="mdi-cloud-download mdi"></i></button>
                        <v-divider vertical class="divider_vertical"></v-divider>
                    </div>
                </div>
                <div class="right_toolbar_container">
                    <div class="flex_div" v-show="mainStore_menu.menu_navigation_item == 'Scene Editor'">
                        <!--  -->
                        <v-divider vertical class="divider_vertical"></v-divider>
                        <button class="toolbar_btn"><i class="mdi-arrow-collapse-horizontal mdi"
                                @click="code_editor_laout_ck(0)"></i></button>
                        <!--  -->
                        <v-divider vertical class="divider_vertical"></v-divider>
                        <button class="toolbar_btn"><i class="mdi-arrow-expand-horizontal mdi"
                                @click="code_editor_laout_ck(1)"></i></button>
                        <!--  -->
                        <v-divider vertical class="divider_vertical"></v-divider>
                        <button class="toolbar_btn"><i class="mdi-stretch-to-page-outline mdi"
                                @click="code_editor_laout_ck(2)"></i></button>
                        <!--  -->
                        <v-divider vertical class="divider_vertical"></v-divider>
                        <button class="toolbar_btn_m" @click="code_editor_laout_ck(3)"><i
                                class="mdi-align-horizontal-distribute mdi"></i></button>
                    </div>
                    <div class="flex_div" v-show="mainStore_menu.menu_navigation_item == 'CAD Editor'">
                        <!--  -->
                        <v-divider vertical class="divider_vertical"></v-divider>
                        <button class="toolbar_btn"><i class="mdi-arrow-expand-horizontal mdi"
                                @click="code_editor_laout_ck(2)"></i></button>
                        <!--  -->
                        <v-divider vertical class="divider_vertical"></v-divider>
                        <button class="toolbar_btn"><i class="mdi-stretch-to-page-outline mdi"
                                @click="code_editor_laout_ck(0)"></i></button>
                        <!--  -->
                        <v-divider vertical class="divider_vertical"></v-divider>
                        <button class="toolbar_btn_m" @click="code_editor_laout_ck(1)"><i
                                class="mdi-align-horizontal-distribute mdi"></i></button>
                    </div>
                </div>
            </div>
            <!--  -->
            <iframe id="vs_code_frame" src="./code.html" class="code_contain_frame" frameBorder="0"></iframe>
            <!--  -->
            <div class="main_container_status_no_bottom_padding">
                <span id="rbfx-output"></span>
            </div>
        </div>
        <div
            :class="code_div_class_select_noshow(mainStore_menu.yn_show_code_contain, mainStore_menu.rail, mainStore_menu.yn_show_code_btn)">
            <button class="toolbar_btn_wide" @click="code_div_show_ck"><i class="mdi-crowd mdi"></i></button>
        </div>
        <!-- busy div  -->
        <div id="other_log" :class="busy_div_class_select(mainStore_menu.rail)">
            <v-progress-circular indeterminate :size="128" :width="8" class="output_progress_div"
                color="pink"></v-progress-circular>
            <textarea id="story" name="story" rows="8" class="output_wasm"></textarea>
        </div>
    </div>
</template>
<!--  script  -->
<script setup>
import { ref, onMounted, onUnmounted, onUpdated, onActivated } from "vue";
import { useStoreForMenu } from "@/stores/globle.js";
const mainStore_menu = useStoreForMenu();
//
import { fm_addScript, fm_addScript_for_dtwin, fm_delScript, open_rbfx_code_file, saveCodeToFile, busy_div_control, saveShapeSTL, loadSTEPorIGES, saveShapeGLB } from "@/plugins/base.js";
//
import cascad_editor from "@/modules/cascad_editor";
import wasm_editor from "@/modules/wasm_editor";
import help_view from "@/modules/help";
import project_view from "@/modules/projectView";
import file_view from "@/modules/fileView";
import term_view from "@/modules/termView";
import model_editor from "@/modules/model_editor";
import cascade_wasm_editor from "@/modules/cascade_wasm_editor";

//
function code_div_class_select(is_view, rail, is_show_btn) {
    var rt = "";
    //
    if (is_show_btn) {
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
    } else {
        rt = " hide_div ";
    }
    //
    return rt;
}
//
function code_div_class_select_noshow(is_view, rail, is_show_btn) {
    var rt = "";
    //
    if (is_show_btn) {
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
    } else {
        rt = " hide_div ";
    }
    //
    return rt;
}
//
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
function code_editor_laout_ck(layout) {
    var vs_code_contain = document.getElementById("vs_code_contain");
    //
    if (mainStore_menu.menu_navigation_item == "Scene Editor") {
        //
        if (layout == 0) {
            var rbfx_w = FM_GLOBAL.DTWIN_EDITOR._AdjustmentLaout(2);
            var w;
            if (mainStore_menu.rail) {
                w = window.innerWidth - rbfx_w - 55 - 1;
            } else {
                w = window.innerWidth - rbfx_w - 255 - 1;
            }
            vs_code_contain.style.width = w + "px";
        } else if (layout == 1) {
            var rbfx_w = FM_GLOBAL.DTWIN_EDITOR._AdjustmentLaout(1);
            var w;
            if (mainStore_menu.rail) {
                w = window.innerWidth - rbfx_w - 55 - 1;
            } else {
                w = window.innerWidth - rbfx_w - 255 - 1;
            }
            vs_code_contain.style.width = w + "px";
        } else if (layout == 2) {
            var rbfx_w = FM_GLOBAL.DTWIN_EDITOR._AdjustmentLaout(0);
            var w;
            if (mainStore_menu.rail) {
                w = window.innerWidth - rbfx_w - 55 - 1;
            } else {
                w = window.innerWidth - rbfx_w - 255 - 1;
            }
            vs_code_contain.style.width = w + "px";
        } else if (layout == 3) {
            var rbfx_w = FM_GLOBAL.DTWIN_EDITOR._AdjustmentLaout(3);
            var w;
            if (mainStore_menu.rail) {
                w = window.innerWidth - rbfx_w - 55 - 1;
            } else {
                w = window.innerWidth - rbfx_w - 255 - 1;
            }
            vs_code_contain.style.width = "600px";
        }
    } else if (mainStore_menu.menu_navigation_item == "CAD Editor") {
        //
        if (layout == 0) {
            var rbfx_w = 300;
            var w;
            if (mainStore_menu.rail) {
                w = window.innerWidth - rbfx_w - 55 - 1;
            } else {
                w = window.innerWidth - rbfx_w - 255 - 1;
            }
            vs_code_contain.style.width = w + "px";
        } else if (layout == 1) {
            vs_code_contain.style.width = "600px";
        } else if (layout == 2) {
            var w;
            if (mainStore_menu.rail) {
                w = window.innerWidth / 2 - 55 - 1;
            } else {
                w = window.innerWidth / 2 - 255 - 1;
            }
            vs_code_contain.style.width = w + "px";
        }
    }
}
//
function down_load_modle_file() {
    if (FM_GLOBAL.CAD_SCENE) {
        saveShapeSTL(FM_GLOBAL.CAD_SCENE);
    }
    //
    if (!mainStore_menu.is_show_viewport) { saveShapeGLB(FM_GLOBAL.OPENCASCADE); }

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
        mainStore_menu.modelUrl = FM_GLOBAL.modelUrl
        log_span.innerText = "+-  Run ok. ";
        FM_GLOBAL.LOG.value = FM_GLOBAL.LOG.value + "+- From code editor: Run ok. " + "\n";
    } catch (e) {
        // console.log(e);

        log_span.innerText = "+-  " + e.message;
        FM_GLOBAL.LOG.value = FM_GLOBAL.LOG.value + "+- From code editor: Run ok. " + e.message + "\n";
        console.log(e.message);
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
onMounted(() => {
    busy_div_control("other_log", false);
    //
    if (FM_GLOBAL.TWEAKPANLE) {
        FM_GLOBAL.TWEAKPANLE.hidden = true;
    }
});
</script>
<!--  style  -->
<style scoped>
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
</style>
