<!-- template -->
<template>
    <div class="main_container">
        <v-window v-model="mainStore_menu.menu_navigation_item">
            <v-window-item value="Scene Editor">
                <wasm_editor></wasm_editor>
            </v-window-item>
            <v-window-item value="CAD Editor">
                <cascad_editor></cascad_editor>
            </v-window-item>
        </v-window>
    </div>
</template>
<!--  script  -->
<script setup>
import { useStoreForMenu } from "@/stores/globle.js";
const mainStore_menu = useStoreForMenu();
//
import cascad_editor from "@/views/cascad_editor";
import wasm_editor from "@/views/wasm_editor";
</script>
<!--  style  -->
<style scoped></style>
