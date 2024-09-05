import { createApp } from "vue";
import { createPinia } from "pinia";
import vuetify from "@/plugins/vuetify";
import { loadFonts } from "@/plugins/webfontloader";
//
import App from "./App.vue";
import router from "./router/router";
//
import "@/assets/css/main.css";
//
import "@/assets/js/monaco-editor/min/vs/loader.js";
//
// require.config({ paths: { vs: "@/assets/js/monaco-editor/min/vs" } });
// // 将monaco变量赋值为全局变量
// require(["vs/editor/editor.main"], function () {
//     //
//     FM_GLOBAL.MONACO = window.monaco;
//     //
//     FM_GLOBAL.MONACO.editor.defineTheme("fm-theme", {
//         base: "vs-dark",
//         inherit: true,
//         rules: [{ token: "comment", foreground: "008000", fontStyle: "italic" }],
//         colors: {
//             "editor.lineHighlightBackground": "#0000008c",
//         },
//     });

//     FM_GLOBAL.MONACO.editor.setTheme("fm-theme");
// });
//
loadFonts();
const app = createApp(App);
// add plugin
app.use(createPinia());
app.use(router);
app.use(vuetify);

//
app.mount("#app");

