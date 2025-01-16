<!-- template -->
<template>
    <div class="main_container_content_max blur_div_95">
        <!--  -->
        <div class="main_container_toolbar_no_pm">
            <!--  -->
            <button class="toolbar_btn_wide" @click="view_toolbox()">
                <i class="mdi-arrow-up mdi"></i>
            </button>
            <v-divider vertical class="divider_vertical"></v-divider>
            <!--  -->
            <button class="toolbar_btn">
                <i class="mdi-folder-plus mdi"></i>
            </button>
            <v-divider vertical class="divider_vertical"></v-divider>
        </div>
        <div class="main_container_content">
            <v-layout full-height>
                <v-main class="main_contain_models">
                    <!--  -->
                </v-main>
                <v-navigation-drawer
                    location="right"
                    permanent
                    temporary
                    width="400"
                    v-model="mainStore_models.is_right_models_drawer"
                >
                </v-navigation-drawer>
            </v-layout>
        </div>
        <div class="main_container_status_no_pm">
            <span id="resouse_log_output">{{
                mainStore_models.models_log
            }}</span>
        </div>
        <!--  -->
    </div>
</template>
<!--  script  -->
<script setup>
import { ref, onMounted, onUnmounted, onUpdated, onActivated } from "vue";
import {
    fm_addScript,
    fm_addScript_for_dtwin,
    fm_delScript,
    open_rbfx_code_file,
    saveCodeToFile,
    busy_div_control,
    saveShapeSTL,
    loadSTEPorIGES,
} from "@/plugins/base.js";
import { useStoreForModels } from "@/stores/globle.js";
const mainStore_models = useStoreForModels();
//
//
function view_toolbox() {
    mainStore_models.is_right_models_drawer = true;
}
//
onMounted(() => {
    //
});
</script>

<!--  style  -->
<style scoped>
.main_contain_models {
    padding: 4px;
    padding-right: 0px;
}
/*  */
</style>
