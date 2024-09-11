<!-- template -->
<template>
    <div id="login_div">
        <div class="fm_main_login_div">
            <form>
                <div class="fm_main_login_form">
                    <div class="fm_main_login_form_left">
                        <v-img :width="200" aspect-ratio="1/1" cover :src="logoImgUrl" class="logo_img animate__animated animate__rubberBand"></v-img>
                    </div>
                    <div class="fm_main_login_form_right">
                        <div class="fm_main_login_form_right_contain">
                            <v-text-field label="Admin User" variant="outlined" v-model="mainStore_menu.user_info.username" autocomplete="off"></v-text-field>
                            <v-text-field label="Password" variant="outlined" v-model="mainStore_menu.user_info.password" autocomplete="off" type="password"></v-text-field>
                            <div>
                                <v-btn @click="login"> Sign in </v-btn>
                                <span>{{ mainStore_menu.login_log }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<!--  script  -->
<script setup>
import { ref, onMounted, onUnmounted, onUpdated, onActivated } from "vue";
//
import { useStoreForMenu } from "@/stores/globle.js";
const mainStore_menu = useStoreForMenu();
import logoImgUrl from "@/assets/img/logo_1.png";
import "@/assets/css/animate/animate.min.css";
//
import "@/assets/js/sha256/sha256.min.js";
import "@/assets/js/other/axios.min.js";
import router from "@/router/router";
function login() {
    mainStore_menu.user_info.password = sha256(mainStore_menu.user_info.password);
    axios
        .post("/login", mainStore_menu.user_info)
        .then((response) => {
            if (response.status == 200) {
                mainStore_menu.login_log = "";
                mainStore_menu.user_info = response.data.user_info;
                mainStore_menu.is_logined = true;
                reload = true;
                //
                router.push({ path: "/main_contain", replace: true });
            } else {
                mainStore_menu.login_log = response.data.message;
                //
            }
        })
        .catch((error) => {
            mainStore_menu.login_log = error.response.data.message;
        });
}
onMounted(() => {
    // console.log("+- From js: is_load_rbfx_wasm= " + is_load_rbfx_wasm);
    if (is_load_rbfx_wasm || is_load_cad_wasm || mainStore_menu.user_info.token != "" || mainStore_menu.is_logined || reload) {
        console.log("+- Refresh or Reload.");
        window.location.reload();
    }
});
//
</script>

<!--  style  -->
<style scoped>
.login_div {
    width: calc(100% - 80px);
    height: calc(100vh - 80px);
    margin: 40px;
    position: relative;
}
.fm_main_login_div {
    width: calc(100% - 80px);
    height: calc(100vh - 80px);
    margin: 40px;
    position: relative;
}
.fm_main_login_form {
    width: 1600px;
    height: 200px;
    display: table;
    position: absolute; /*重要*/ /*子类绝对布局必填*/
    top: 0; /*重要*/
    bottom: 0; /*重要*/
    left: 0; /*重要*/
    right: 0; /*重要*/
    margin: auto; /*重要*/

    background-color: rgba(255, 255, 255, 0.71); /*红背景色*/
    border-radius: 14px;
    backdrop-filter: blur(14px);
}
.fm_main_login_form_left {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    width: 50%;
    height: 100%;
}
.fm_main_login_form_right {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    width: 50%;
    height: 100%;
    background-color: #0a0a0a1c;
}
.fm_main_login_form_right_contain {
    height: 100%;
    width: 100%;
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 80px;
    padding-bottom: 80px;
    color: #080808b5;
}
.fm_main_login_form_right_contain div {
    text-align: left;
}
.fm_main_login_form_right_contain div > span {
    text-align: left;
    font-size: 13px;
    margin-left: 20px;
    color: #b800dd;
}
.logo_img {
    /* animation: 2s infinite; */
    animation-iteration-count: infinite;
    margin-left: 300px;
    margin-right: 300px;
}
</style>
