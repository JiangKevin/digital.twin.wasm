import { createApp } from "vue";
import { createPinia } from "pinia";
import vuetify from "@/plugins/vuetify";
import { loadFonts } from "@/plugins/webfontloader";
//
import App from "./App.vue";
import router from "./router/router";
// import { fm_addScript } from "@/plugins/base.js";

//
import "@/assets/css/main.css";
//
loadFonts();
const app = createApp(App);
// add plugin
app.use(createPinia());
app.use(router);
app.use(vuetify);

//
app.mount("#app");
// 
// fm_addScript("./data.js", false, true);
// fm_addScript("./common.js", false, true);
