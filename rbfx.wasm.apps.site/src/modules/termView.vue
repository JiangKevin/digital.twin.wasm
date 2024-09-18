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
import { useStoreForMenu } from "@/stores/globle.js";
const mainStore_menu = useStoreForMenu();
import "@/assets/js/xterm/xterm.css";
import "@/assets/js/xterm/xterm.js";
// import { Terminal } from "@xterm/xterm";
// import { WebLinksAddon } from "@xterm/addon-web-links";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

//
onMounted(() => {
    //
    FM_GLOBAL.TERMINAL = new Terminal({
        rendererType: "canvas", //渲染类型
        rows: 40, //行数
        cols: 100, // 不指定行数，自动回车后光标从下一行开始
        convertEol: true, //启用时，光标将设置为下一行的开头
        // scrollback: 50, //终端中的回滚量
        disableStdin: false, //是否应禁用输入
        cursorStyle: "underline", //光标样式
        cursorBlink: true, //光标闪烁
        theme: {
            foreground: "#ECECEC", //字体
            background: "#000000", //背景色
            cursor: "help", //设置光标
            lineHeight: 14,
        },
    });
    // canvas背景全屏
    const fitAddon = new FitAddon();
    FM_GLOBAL.TERMINAL.loadAddon(fitAddon);
    fitAddon.fit();
    //
    FM_GLOBAL.TERMINAL.open(document.getElementById("terminal"));
    // 换行并输入起始符 $
    FM_GLOBAL.TERMINAL.prompt = (_) => {
        FM_GLOBAL.TERMINAL.write("\r\n\x1b[33m$\x1b[0m ");
    };
    //
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
    runFakeTerminal();
    //
    var xterm_screen = document.querySelector(".xterm-screen");
    if (xterm_screen) {
        if (mainStore_menu.rail) {
            console.log("adsfasdf");
            xterm_screen.style.width = window.innerWidth - 55 - 16 + "px";
            xterm_screen.style.height = window.innerHeight - 16 + "px";
        } else {
            xterm_screen.style.width = window.innerWidth - 255 - 16 + "px";
            xterm_screen.style.height = window.innerHeight - 16 + "px";
        }
    }
});

//
function runFakeTerminal() {
    if (FM_GLOBAL.TERMINAL._initialized) return;
    // 初始化
    FM_GLOBAL.TERMINAL._initialized = true;
    FM_GLOBAL.TERMINAL.writeln("-------------------------------------------------");
    FM_GLOBAL.TERMINAL.writeln("-------------------------------------------------");
    FM_GLOBAL.TERMINAL.writeln("-------------------------------------------------");

    FM_GLOBAL.TERMINAL.prompt();
    // 添加事件监听器，支持输入方法
    FM_GLOBAL.TERMINAL.onKey((e) => {
        const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;
        if (e.domEvent.keyCode === 13) {
            FM_GLOBAL.TERMINAL.prompt();
        } else if (e.domEvent.keyCode === 8) {
            // back 删除的情况
            if (FM_GLOBAL.TERMINAL._core.buffer.x > 2) {
                FM_GLOBAL.TERMINAL.write("\b \b");
            }
        } else if (printable) {
            FM_GLOBAL.TERMINAL.write(e.key);
        }
        console.log(1, "print", e.key);
    });
    FM_GLOBAL.TERMINAL.onData((key) => {
        // 粘贴的情况
        if (key.length > 1) {
            FM_GLOBAL.TERMINAL.write(key);
        }
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
