<!-- template -->
<template>
    <div class="main_container_toolbar">
        <v-divider vertical class="divider_vertical"></v-divider>
        <button class="toolbar_btn" @click="code_ck"><i class="mdi-crowd mdi"></i><v-tooltip activator="parent" content-class="toolbar_btn_tooltip" opacity="0.1" location="end">Open Digital Twin Code Editor</v-tooltip></button>
        <v-divider vertical class="divider_vertical"></v-divider>
    </div>
    <div class="main_container_content">
        <canvas id="canvas" oncontextmenu="event.preventDefault()"></canvas>
    </div>
    <div class="main_container_status">
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
    //
    if (!is_load_rbfx_wasm) {
        Module = {
            preRun: [],
            postRun: [],
            print: (function () {
                return function (text) {
                    console.log("+- From c++: " + text);
                };
            })(),
            printErr: (function () {
                return function (text) {
                    console.log("[ERROR]+- From c++: " + text);
                };
            })(),
            canvas: document.getElementById("canvas"),
        };
        //
        Module["preRun"].push(function () {
            Module["addRunDependency"]("IndexedDB");
            FS.mkdir("/IndexedDB");
            // FS.mount(IDBFS, {}, "/IndexedDB");
            FS.syncfs(true, function (err) {
                if (err) {
                    console.error(err);
                }
                Module["removeRunDependency"]("IndexedDB");
            });
        });
        fm_addScript("./data.js", true, false);
        fm_addScript("./common.js", true, false);
        //
        is_load_rbfx_wasm = true;
    }
});
//
function code_ck() {}
</script>
<!--  style  -->
<style scoped>
#canvas {
    width: 100%;
    height: calc(100vh - 88px);
}
</style>
