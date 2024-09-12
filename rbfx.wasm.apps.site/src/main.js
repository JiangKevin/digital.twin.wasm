import { createApp } from "vue";
import { createPinia } from "pinia";
import vuetify from "@/plugins/vuetify";
import App from "./App.vue";
import router from "./router/router";
//
import "@/assets/css/main.css";
// import "@/assets/css/editor.main.css";
//
import { fm_addScript, fm_delScript } from "@/plugins/base.js";

//

const app = createApp(App);
// add plugin
app.use(createPinia());
app.use(router);
app.use(vuetify);
//
fm_addScript("./runtime/basic/init.js", false, false);
//
app.mount("#app");
