<!-- template -->
<template>
    <div class="main_container_content_max blur_div_95">
        <!--  -->
        <iframe src="./runtime/markdown/help.md" id="mark_down_frame" name="mark_down_frame" class="fm_markdown_iframe"></iframe>
        <iframe id="mark_down_view" name="mark_down_view" class="fm_markdown_iframe_view" scrolling="auto" style="overflow-x: scroll"></iframe>
        <!--  -->
    </div>
</template>
<!--  script  -->
<script setup>
import { ref, onMounted, onUnmounted, onUpdated, onActivated } from "vue";
import { fm_addScript, fm_addScript_for_dtwin, fm_delScript, open_rbfx_code_file, saveCodeToFile, busy_div_control, clear_busy_log } from "@/plugins/base.js";
import markdownit from "markdown-it";
import { useStoreForMenu } from "@/stores/globle.js";
const mainStore_menu = useStoreForMenu();
//
FM_GLOBAL.MARKDOWN = markdownit({
    html: true,
    xhtmlOut: true,
    breaks: false,
    langPrefix: "language-",
    linkify: false,
    typographer: false,
    quotes: "“”‘’",
    highlight: function (/*str, lang*/) {
        return "";
    },
});

//
onMounted(() => {
    if (mainStore_menu.is_logined) {
        busy_div_control("other_log", true);
        clear_busy_log("story");
        setTimeout(() => {
            var md = window.frames["mark_down_frame"];
            var md_view = window.frames["mark_down_view"];
            md_view.document.body.innerHTML = "<link rel='stylesheet' href='./runtime/css/fm_markdown.css' /> \n" + FM_GLOBAL.MARKDOWN.render(md.document.body.innerText);
            busy_div_control("other_log", false);
        }, 3000);
    }
});
</script>

<!--  style  -->
<style scoped></style>
