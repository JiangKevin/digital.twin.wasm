<!-- template -->
<template>
    <div class="main_container_content_max blur_div_95">
        <!--  -->
        <div id="viewport"></div>
        <!--  -->
    </div>
</template>
<!--  script  -->
<script setup>
import { ref, onMounted, onUnmounted, onUpdated, onActivated } from "vue";
import { fm_addScript, fm_addScript_for_dtwin, fm_delScript, open_rbfx_code_file, saveCodeToFile, busy_div_control, setupThreeJSCore, loadSTEPorIGES } from "@/plugins/base.js";
import { useStoreForMenu } from "@/stores/globle.js";
const mainStore_menu = useStoreForMenu();
//
import * as THREE from "@/assets/js/three/three.module.js";
import { OrbitControls } from "@/assets/js/three/OrbitControls.js";
import { initOpenCascade } from "@/assets/js/opencascade/fm.opencascade.Instantiation.js";
import { openCascadeHelper } from "@/plugins/openCascadeHelper.js";
import { OBJExporter } from "@/assets/js/three/OBJExporter.js";
import { STLExporter } from "@/assets/js/three/STLExporter.js";
import { GLTFExporter } from "@/assets/js/three/GLTFExporter.js";
//
FM_GLOBAL.THREE = THREE;
FM_GLOBAL.ORBITCONTROLS = OrbitControls;
FM_GLOBAL.INITOPENCASCADE = initOpenCascade;
FM_GLOBAL.OPENCASCADEHELPER = openCascadeHelper;
FM_GLOBAL.THREE_OBJEXPORTER = OBJExporter;
FM_GLOBAL.THREE_STLEXPORTER = STLExporter;
FM_GLOBAL.THREE_GLTFEXPORTER = GLTFExporter;

//
onMounted(() => {
    //
    mainStore_menu.yn_show_code_btn = true;
    //
    if (!is_load_cad_wasm) {
        var fm_cad_core = setupThreeJSCore(mainStore_menu.rail);
        //
        FM_GLOBAL.CAD_SCENE = fm_cad_core.scene;
        FM_GLOBAL.CAD_RENDERER = fm_cad_core.renderer;
        //
        FM_GLOBAL.INITOPENCASCADE().then((openCascade) => {
            //
            FM_GLOBAL.OPENCASCADE = openCascade;
            //
            const viewport = document.getElementById("viewport");
            if (viewport) {
                viewport.appendChild(FM_GLOBAL.CAD_RENDERER.domElement);
            }
            //
            document.getElementById("step-file").addEventListener("input", async (event) => {
                try {
                    await loadSTEPorIGES(openCascade, event.srcElement.files[0], addVisulizeShapeToScene, FM_GLOBAL.CAD_SCENE);
                } catch (e) {
                    // console.log(" +-  " + e.message);
                } finally {
                    //
                }
            });
            //
            window.addEventListener(
                "CASCAD_WRAP_LOADED",
                (e) => {
                    FM_GLOBAL.LOG.value = "+- From js: CASCAD wrap loaded.";
                    console.log("+- From js&c++: CASCAD wrap loaded.");
                    busy_div_control("other_log", false);
                },
                false
            );
            //
            fm_addScript("./runtime/basic/cascad_wrap.js", true, false);
            //
            is_load_cad_wasm = true;
            FM_GLOBAL.TWEAKPANLE.hidden = false;
        });
    }
});
</script>

<!--  style  -->
<style scoped>
#viewport {
    width: 100%;
    height: 100%;
}
#viewport canvas {
    width: 100%;
    height: 100vh;
}
</style>
