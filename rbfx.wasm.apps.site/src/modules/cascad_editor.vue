<!-- template -->
<template>
    <div class="main_container_toolbar">ADFADS</div>
    <div class="main_container_content">
        <!-- <div id="cas_cad_container"></div> -->
    </div>
    <div class="main_container_status"><span>asdfasdf</span></div>
</template>
<!--  script  -->
<script setup>
import { ref, onMounted, onUnmounted, onUpdated, onActivated } from "vue";
import { fm_addScript, fm_addScript_for_dtwin, fm_delScript, open_rbfx_code_file, saveCodeToFile, busy_div_control } from "@/plugins/base.js";

//
onMounted(() => {
    busy_div_control("other_log", true);
});
</script>

<!--  style  -->
<style scoped></style>
