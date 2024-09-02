import { createApp } from "vue";
import { createPinia } from "pinia";
import vuetify from "@/plugins/vuetify";
import { loadFonts } from "@/plugins/webfontloader";
// 
import "./css/style.css";
import App from "./App.vue";
import router from './router/router'
//
loadFonts();
const app = createApp(App);
// add plugin
app.use(createPinia());
app.use(router)
app.use(vuetify);
//
app.mount('#app')
