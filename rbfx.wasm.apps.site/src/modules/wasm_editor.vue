<!-- template -->
<template>
    <div class="main_container_toolbar blur_div">
        <v-divider vertical class="divider_vertical"></v-divider>
        <button class="toolbar_btn_wide" @click="code_div_show_ck"><i class="mdi-crowd mdi"></i><v-tooltip activator="parent" content-class="toolbar_btn_tooltip" opacity="0.1" location="end">Open Digital Twin Code Editor</v-tooltip></button>
        <v-divider vertical class="divider_vertical"></v-divider>
    </div>
    <div class="main_container_content">
        <canvas id="canvas" oncontextmenu="event.preventDefault()"></canvas>
    </div>
    <div class="main_container_status blur_div">
        <span id="output">asdfasdf</span>
    </div>
</template>
<!--  script  -->
<script setup>
import { ref, onMounted, onUnmounted, onUpdated, onActivated } from "vue";
import { useStoreForMenu } from "@/stores/globle.js";
const mainStore_menu = useStoreForMenu();
//
import { fm_addScript, fm_delScript } from "@/plugins/base.js";
//
onMounted(() => {
    console.log("+- From js: is_load_rbfx_wasm = " + is_load_rbfx_wasm);
    var log_span = document.getElementById("output");
    //
    if (!is_load_rbfx_wasm) {
        Module = {
            preRun: [],
            postRun: [],
            print: (function () {
                return function (text) {
                    console.log("+- From c++: " + text);
                    log_span.innerText = "+- From c++: " + text;
                };
            })(),
            printErr: (function () {
                return function (text) {
                    console.log("[ERROR] +- From c++: " + text);
                    log_span.innerText = "[ERROR] +- From c++: " + text;
                };
            })(),
            canvas: document.getElementById("canvas"),
        };
        //
        fm_addScript("./data.js", true, false);
        fm_addScript("./common.js", true, false);
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
});
//
function code_div_show_ck()
{
    mainStore_menu.yn_show_code_contain = !mainStore_menu.yn_show_code_contain;
}
</script>
<!--  style  -->
<style scoped>
#canvas {
    width: 100%;
    height: calc(100vh - 88px);
}
</style>
