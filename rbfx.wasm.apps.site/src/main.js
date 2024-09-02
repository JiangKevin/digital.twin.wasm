import { createApp } from "vue";
import { createPinia } from "pinia";
import vuetify from "@/plugins/vuetify";
import { loadFonts } from "@/plugins/webfontloader";

import "./css/style.css";
import App from "./App.vue";
//
loadFonts();
const app = createApp(App);
// add plugin
app.use(createPinia());
app.use(vuetify);
//
createApp(App).mount("#app");
