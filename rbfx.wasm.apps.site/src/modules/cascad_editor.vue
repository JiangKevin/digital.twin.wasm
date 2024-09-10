<!-- template -->
<template>
    <div class="main_container_content_max blur_div">
        <!--  -->
        <div id="viewport"></div>
        <!--  -->
    </div>
</template>
<!--  script  -->
<script setup>
import { ref, onMounted, onUnmounted, onUpdated, onActivated } from "vue";
import { fm_addScript, fm_addScript_for_dtwin, fm_delScript, open_rbfx_code_file, saveCodeToFile, busy_div_control, setupThreeJSCore } from "@/plugins/base.js";
import * as THREE from "@/assets/js/three/three.module.js";
import { OrbitControls } from "@/assets/js/three/OrbitControls.js";
import { initOpenCascade } from "@/assets/js/opencascade/fm.opencascade.Instantiation.js";
import { openCascadeHelper } from "@/plugins/openCascadeHelper.js";
import { Pane } from "@/assets/js/Tweakpane/tweakpane.min.js";
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
FM_GLOBAL.TWEAKPANLE = new Pane({
    title: "Parameters",
    expanded: false,
});
FM_GLOBAL.TWEAKPANLE.hidden = true;
//
onMounted(() => {
    busy_div_control("other_log", true);
    if (!is_load_cad_wasm) {
        var fm_cad_core = setupThreeJSCore();
        //
        FM_GLOBAL.CAD_SCENE = fm_cad_core.scene;
        FM_GLOBAL.CAD_RENDERER = fm_cad_core.renderer;
        //
        FM_GLOBAL.INITOPENCASCADE().then((openCascade) => {
            busy_div_control("other_log", false);
            //
            FM_GLOBAL.OPENCASCADE = openCascade;
            //
            const viewport = document.getElementById("viewport");
            if (viewport) {
                viewport.appendChild(FM_GLOBAL.CAD_RENDERER.domElement);
            }
            //
            fm_addScript("./runtime/basic/cascad_wrap.js", true, false);
            //
            is_load_cad_wasm = true;
        });
    }
});
</script>

<!--  style  -->
<style scoped></style>
