<!-- template -->
<template>
    <div class="main_container_toolbar blur_div">
        <v-divider vertical class="divider_vertical"></v-divider>
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
    <div class="main_container_content">
        <canvas id="canvas" oncontextmenu="event.preventDefault()"></canvas>
    </div>
    <div class="main_container_status blur_div">
        <span id="rbfx-output"></span>
    </div>
</template>
<!--  script  -->
<script setup>
import { ref, onMounted, onUnmounted, onUpdated, onActivated } from "vue";
import { useStoreForMenu } from "@/stores/globle.js";
const mainStore_menu = useStoreForMenu();
//
import { fm_addScript, fm_addScript_for_dtwin, fm_delScript, open_rbfx_code_file, saveCodeToFile, busy_div_control } from "@/plugins/base.js";
//
onMounted(() => {
    // console.log("+- From js: is_load_rbfx_wasm = " + is_load_rbfx_wasm);
    var log_span = document.getElementById("rbfx-output");
    busy_div_control("other_log", true);
    //
    if (!is_load_rbfx_wasm) {
        //
        Module = {
            preRun: [],
            postRun: get_variables,
            print: (function () {
                return function (text) {
                    console.log("+- From c++: " + text);
                    log_span.innerText = "+- From c++: " + text;
                    FM_GLOBAL.LOG.value = FM_GLOBAL.LOG.value + "+- From c++: " + text + "\n";
                    FM_GLOBAL.LOG.scrollTop = FM_GLOBAL.LOG.scrollHeight;
                };
            })(),
            printErr: (function () {
                return function (text) {
                    console.log("[ERROR] +- From c++: " + text);
                    log_span.innerText = "[ERROR] +- From c++: " + text;
                    FM_GLOBAL.LOG.value = FM_GLOBAL.LOG.value + "[ERROR] +- From c++: " + text + "\n";
                    FM_GLOBAL.LOG.scrollTop = FM_GLOBAL.LOG.scrollHeight;
                };
            })(),
            canvas: document.getElementById("canvas"),
        };
        //
        fm_addScript("./data.js", true, false);
        fm_addScript_for_dtwin("./common.js", true, false, FM_GLOBAL.DTWIN_EDITOR);
        //
        is_load_rbfx_wasm = true;
    }
    //
    var elem = document.getElementById("canvas");
    elem.addEventListener(
        "click",
        function () {
            console.log("+- focus.");
            elem.focus();
        },
        false
    );
    //
    open_rbfx_code_file(FM_GLOBAL.MONACO_EDITOR, log_span);
});
//
function code_div_show_ck() {
    mainStore_menu.yn_show_code_contain = !mainStore_menu.yn_show_code_contain;
}
function get_variables() {
    FM_GLOBAL.DTWIN_EDITOR = Module;
    fm_addScript("./runtime/basic/digital_twin_wrap.js", true, false);
}
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
function save_code_ck() {
    var log_span = document.getElementById("rbfx-output");
    saveCodeToFile(FM_GLOBAL.MONACO_EDITOR.getValue(), log_span);
}
</script>
<!--  style  -->
<style scoped>
#canvas {
    width: 100%;
    height: calc(100vh - 88px);
}
</style>
