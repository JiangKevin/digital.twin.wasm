<!-- template -->
<template>
    <div class="main_container_content_max blur_div_95">
        <!--  -->
        <div class="main_container_toolbar_no_pm"></div>
        <div class="main_container_content">
            <v-layout full-height>
                <div id="terminal" ref="terminal"></div>
            </v-layout>
        </div>
        <div class="main_container_status_no_pm">
            <span id="resouse_log_output"></span>
        </div>
        <!--  -->
    </div>
</template>
<!--  script  -->
<script setup>
import { ref, onMounted, onUnmounted, onUpdated, onActivated } from "vue";
import { fm_addScript, fm_addScript_for_dtwin, fm_delScript, open_rbfx_code_file, saveCodeToFile, busy_div_control, saveShapeSTL, loadSTEPorIGES } from "@/plugins/base.js";
import { useStoreForFiles } from "@/stores/globle.js";
const mainStore_files = useStoreForFiles();
import "@/assets/js/xterm/xterm.css";
import "@/assets/js/xterm/xterm.js";
// import { Terminal } from "@xterm/xterm";
// import { WebLinksAddon } from "@xterm/addon-web-links";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

//
onMounted(() => {
    //
    let terminal = new Terminal({
        rendererType: "canvas", //渲染类型
        rows: 40, //行数
        cols: 100, // 不指定行数，自动回车后光标从下一行开始
        convertEol: true, //启用时，光标将设置为下一行的开头
        // scrollback: 50, //终端中的回滚量
        disableStdin: false, //是否应禁用输入
        // cursorStyle: "underline", //光标样式
        cursorBlink: true, //光标闪烁
        theme: {
            foreground: "#ECECEC", //字体
            background: "#000000", //背景色
            cursor: "help", //设置光标
            lineHeight: 20,
        },
    });
    terminal.open(document.getElementById("terminal"));
    // 换行并输入起始符 $
    terminal.prompt = (_) => {
        terminal.write("\r\n\x1b[33m$\x1b[0m ");
    };
    terminal.prompt();
    // canvas背景全屏
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    fitAddon.fit();
    window.addEventListener("resize", resizeScreen);
    function resizeScreen() {
        try {
            // 窗口大小改变时，触发xterm的resize方法使自适应
            fitAddon.fit();
        } catch (e) {
            console.log("e", e.message);
        }
    }

    //
    FM_GLOBAL.TERMINAL = terminal;
    runFakeTerminal();
});

//
function runFakeTerminal() {
    let terminal = FM_GLOBAL.TERMINAL;
    if (terminal._initialized) return;
    // 初始化
    terminal._initialized = true;
    terminal.writeln("This is Web Terminal of Modb; Good Good Study, Day Day Up.");
    terminal.prompt();
    // 添加事件监听器，支持输入方法
    terminal.onKey((e) => {
        const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;
        if (e.domEvent.keyCode === 13) {
            terminal.prompt();
        } else if (e.domEvent.keyCode === 8) {
            // back 删除的情况
            if (terminal._core.buffer.x > 2) {
                terminal.write("\b \b");
            }
        } else if (printable) {
            terminal.write(e.key);
        }
        console.log(1, "print", e.key);
    });
    terminal.onData((key) => {
        // 粘贴的情况
        if (key.length > 1) terminal.write(key);
    });
}
</script>

<!--  style  -->
<style scoped>
#terminal {
    padding: 8px;
    width: 100%;
    height: 100%;
}
/*  */
</style>
