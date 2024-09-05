<!-- template -->
<template>
    <v-layout full-height>
        <v-navigation-drawer v-model="mainStore_menu.drawer" :rail="mainStore_menu.rail" permanent>
            <v-list>
                <v-list-item :subtitle="mainStore_menu.user_info.email" :title="mainStore_menu.user_info.fullname">
                    <template v-slot:prepend>
                        <v-avatar>
                            <v-img cover :src="mainStore_menu.user_info.image" @click="view_manu_ck"></v-img>
                        </v-avatar>
                    </template>
                    <template v-slot:append>
                        <v-btn icon="mdi-exit-to-app" size="small" variant="text" @click="logout_ck"></v-btn>
                    </template>
                </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <!--  -->
            <v-list density="compact" nav>
                <v-list-item v-for="(item, i) in mainStore_menu.menu_items" :key="i" :value="item" :active="item.active" :disabled="item.disabled" @click="route_ck(item)">
                    <template v-slot:prepend>
                        <v-icon :icon="item.icon"></v-icon>
                    </template>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item>
            </v-list>
            <!--  -->
            <v-divider></v-divider>
            <v-list density="compact" nav>
                <v-list-item v-for="(item, i) in mainStore_menu.menu_editor_items" :key="i" :value="item" :active="item.active" :disabled="item.disabled" @click="route_ck(item)">
                    <template v-slot:prepend>
                        <v-icon :icon="item.icon"></v-icon>
                    </template>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item>
            </v-list>
            <!--  -->
            <v-divider></v-divider>
            <v-list density="compact" nav>
                <v-list-item v-for="(item, i) in mainStore_menu.menu_help_items" :key="i" :value="item" :active="item.active" :disabled="item.disabled" @click="route_ck(item)">
                    <template v-slot:prepend>
                        <v-icon :icon="item.icon"></v-icon>
                    </template>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item>
            </v-list>
            <!--  -->
            <div class="fm_main_log_contain"><v-divider></v-divider><v-img :width="180" aspect-ratio="1/1" cover :src="logoImgUrl" class="animate__animated animate__rubberBand" :class="logo_class_Select(mainStore_menu.rail)"></v-img></div>
            <!--  -->
        </v-navigation-drawer>
        <!--  -->
        <v-main>
            <FmContain></FmContain>
        </v-main>
        <!--  -->
    </v-layout>
</template>
<!--  script  -->
<script setup>
import { RouterView } from "vue-router";
import FmContain from "@/views/FmContain";
//
import { ref, onMounted, onUnmounted, onUpdated, onActivated } from "vue";
import { useStoreForMenu } from "@/stores/globle.js";
const mainStore_menu = useStoreForMenu();
import logoImgUrl from "@/assets/img/logo_outlined.png";
import "@/assets/css/animate/animate.min.css";
import { fm_delScript } from "@/plugins/base.js";
//
import router from "@/router/router";
function route_ck(item) {
    mainStore_menu.reset_menu_status();
    item.active = true;
    //
    if (mainStore_menu.is_logined) {
        console.log(item.text);
        // router.push({ path: item.route, replace: true });
        mainStore_menu.menu_navigation_item = item.text;
    } else {
        router.push({ path: "login", replace: true });
    }
}
//
function view_manu_ck() {
    mainStore_menu.rail = !mainStore_menu.rail;
}
//
function logout_ck() {
    mainStore_menu.logout();
    is_load_rbfx_wasm = false;
    Module._Stop();
    Module = {};
    console.log(Module)
    fm_delScript("./data.js")
    fm_delScript("./common.js")
    //
    router.push({ path: "login", replace: true });
}
//
function logo_class_Select(is_view) {
    if (!is_view) {
        return "fm_main_log ";
    } else {
        ("fm_main_log_min ");
    }
}
//
onMounted(() => {
    if (mainStore_menu.is_logined != true) {
        router.push({ path: "login", replace: true });
    }
});
</script>
<!--  style  -->
<style scoped>
.fm_main_log_contain {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    background-image: url("../assets/img/solar-1.gif");
}
.fm_main_log {
    animation-iteration-count: infinite;
    margin-top: 20px;
    margin-left: 40px;
    margin-bottom: 20px;
}
.fm_main_log_min {
    animation-iteration-count: infinite;
    margin: 0px;
    padding: 0px;
}
</style>
