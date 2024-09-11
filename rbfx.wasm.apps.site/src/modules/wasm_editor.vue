<!-- template -->
<template>
    <div class="main_container_content_max blur_div_95">
        <!--  -->
        <canvas id="canvas" oncontextmenu="event.preventDefault()"></canvas>
        <!--  -->
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
                    FM_GLOBAL.LOG.scrollTop = FM_GLOBAL.LOG.scrollHeight - 16;
                };
            })(),
            printErr: (function () {
                return function (text) {
                    console.log("[ERROR] +- From c++: " + text);
                    log_span.innerText = "[ERROR] +- From c++: " + text;
                    FM_GLOBAL.LOG.value = FM_GLOBAL.LOG.value + "[ERROR] +- From c++: " + text + "\n";
                    FM_GLOBAL.LOG.scrollTop = FM_GLOBAL.LOG.scrollHeight - 16;
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
});

function get_variables() {
    FM_GLOBAL.DTWIN_EDITOR = Module;
    fm_addScript("./runtime/basic/digital_twin_wrap.js", true, false);
}
</script>
<!--  style  -->
<style scoped>
#canvas {
    width: 100%;
    height: 100vh;
}
</style>
