<!-- template -->
<template>
    <div class="main_container_content_max blur_div_95">
        <!--  -->
        <div class="main_container_toolbar_no_pm"></div>
        <div class="main_container_content">
            <v-layout full-height>
                <div class="main_contain_term">
                    <div id="terminal" ref="terminal"></div>
                </div>
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
// import "@/assets/js/xterm/xterm.js";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { AttachAddon } from "@xterm/addon-attach";
import { io, Manager } from "socket.io-client";
var cmd = "";
//
onMounted(() => {
    initSocket();
});
//
function runFakeTerminal() {
    if (FM_GLOBAL.TERMINAL._initialized) {
        return;
    }
    // 初始化
    FM_GLOBAL.TERMINAL._initialized = true;
    // FM_GLOBAL.TERMINAL.writeln("                .+*   .");
    // FM_GLOBAL.TERMINAL.writeln("               =##*  .#=.");
    // FM_GLOBAL.TERMINAL.writeln("             =####*  .*+*=.");
    // FM_GLOBAL.TERMINAL.writeln("           =######*  .*+++*.");
    // FM_GLOBAL.TERMINAL.writeln("         -*#######*  .*++++* ");
    // FM_GLOBAL.TERMINAL.writeln("       -*##########  .*+++++++*-");
    // FM_GLOBAL.TERMINAL.writeln("     .*####*-.#**#*  .*+++++**++*-");
    // FM_GLOBAL.TERMINAL.writeln("   : .#*##*          .*++++++++++*+ ");
    // FM_GLOBAL.TERMINAL.writeln(" :*% .####*-------:  .*+++#*++++++* .-");
    // FM_GLOBAL.TERMINAL.writeln("*#*# .#############  .*++++++#*+++* -*+:");
    // FM_GLOBAL.TERMINAL.writeln(".=#% .#####+++++++=  .*++++ =-*+++* -++#- ");
    // FM_GLOBAL.TERMINAL.writeln("   = .#*##*          .*++++  .*+++* -#=.");
    // FM_GLOBAL.TERMINAL.writeln("     .####*          .*++++  :*+++* ..");
    // FM_GLOBAL.TERMINAL.writeln("      .+##*          .*++++  :*++*=");
    // FM_GLOBAL.TERMINAL.writeln("        .+*          .*++++  :**+:");
    // FM_GLOBAL.TERMINAL.writeln("                     .*++++  .+:");
    // FM_GLOBAL.TERMINAL.writeln("                     .*+++* ");
    // FM_GLOBAL.TERMINAL.writeln("                     .*++*+");
    // FM_GLOBAL.TERMINAL.writeln("                     .*++-");
    // FM_GLOBAL.TERMINAL.writeln("                     .#-");
    // FM_GLOBAL.TERMINAL.writeln("Welcome to xterm.js");
    // FM_GLOBAL.TERMINAL.writeln("This is a local terminal emulation, without a real terminal in the back-end.");
    // FM_GLOBAL.TERMINAL.writeln("Type some keys and commands to play around.");
    // FM_GLOBAL.TERMINAL.writeln("");
    // FM_GLOBAL.TERMINAL.prompt();
    // 添加事件监听器，支持输入方法
    FM_GLOBAL.TERMINAL.onKey((e) => {
        const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;
        if (e.domEvent.keyCode === 13) {
            //
            if (FM_GLOBAL.SOCKET) {
                if (cmd != "") {
                    FM_GLOBAL.SOCKET.emit("DICTATE", cmd);
                }
            }
            //
            if (cmd == "") {
                FM_GLOBAL.TERMINAL.prompt();
            }
            cmd = "";
        } else if (e.domEvent.keyCode === 8) {
            // back 删除的情况
            if (FM_GLOBAL.TERMINAL._core.buffer.x > 2) {
                FM_GLOBAL.TERMINAL.write("\b \b");
            }
        } else if (printable) {
            FM_GLOBAL.TERMINAL.write(e.key);
            cmd += e.key;
        }
    });
    FM_GLOBAL.TERMINAL.onData((key) => {
        // 粘贴的情况
        if (key.length > 1) {
            FM_GLOBAL.TERMINAL.write(key);
        }
    });
}
//
function initXterm(webSocket) {
    var space = 56;
    var row_count;
    var col_count;
    if (mainStore_menu.rail) {
        col_count = parseInt((window.innerWidth - 55 - 16) / 17);
    } else {
        col_count = parseInt((window.innerWidth - 255 - 16) / 17);
    }
    row_count = parseInt((window.innerHeight - space) / 17);
    console.log(row_count);
    console.log(col_count);

    //
    FM_GLOBAL.TERMINAL = new Terminal({
        rendererType: "canvas", //渲染类型
        rows: row_count, //行数
        cols: col_count, // 不指定行数，自动回车后光标从下一行开始
        convertEol: true, //启用时，光标将设置为下一行的开头
        // scrollback: 50, //终端中的回滚量
        disableStdin: false, //是否应禁用输入
        cursorStyle: "underline", //光标样式
        cursorBlink: true, //光标闪烁
        theme: {
            foreground: "#ECECEC", //字体
            background: "#00000000", //背景色
            cursor: "help", //设置光标
            lineHeight: 12,
        },
    });
    // canvas背景全屏
    const fitAddon = new FitAddon();
    FM_GLOBAL.TERMINAL.loadAddon(fitAddon);
    fitAddon.fit();
    if ((webSocket = "")) {
        const attachAddon = new AttachAddon(webSocket);
        FM_GLOBAL.TERMINAL.loadAddon(attachAddon);
    }
    //
    FM_GLOBAL.TERMINAL.open(document.getElementById("terminal"));
    // 换行并输入起始符 $
    FM_GLOBAL.TERMINAL.prompt = (_) => {
        FM_GLOBAL.TERMINAL.write("\r\n\x1b[33m$\x1b[0m ");
    };
    // FM_GLOBAL.TERMINAL.writeln('This is Web Terminal of Modb; Good Good Study, Day Day Up.')
    FM_GLOBAL.TERMINAL.prompt();
    //
    window.addEventListener("resize", resizeScreen);
    function resizeScreen() {
        try {
            // 窗口大小改变时，触发xterm的resize方法使自适应
            fitAddon.fit(space);
            term_fit();
        } catch (e) {
            console.log("e", e.message);
        }
    }
    //
    runFakeTerminal();
    //
    term_fit();
}
//
function term_fit(space) {
    var xterm_screen = document.querySelector(".xterm-screen");
    if (xterm_screen) {
        if (mainStore_menu.rail) {
            xterm_screen.style.width = window.innerWidth - 55 - 16 + "px";
            xterm_screen.style.height = window.innerHeight - space + "px";
        } else {
            xterm_screen.style.width = window.innerWidth - 255 - 16 + "px";
            xterm_screen.style.height = window.innerHeight - space + "px";
        }
    }
}
//
function initSocket() {
    var newType = true;
    //
    var protocol_ = window.location.protocol;
    var host_ = window.location.host;
    var endpoint_;
    if (protocol_ == "https:") {
        endpoint_ = "wss://" + host_;
    } else {
        endpoint_ = "ws://" + host_;
    }
    //
    FM_GLOBAL.SOCKET = io(endpoint_, {
        autoConnect: true,
    });
    //
    FM_GLOBAL.SOCKET.on("connect", () => {
        console.log("+- From js: socket ok.");
        initXterm("");
        console.log("+- From js: new FM_GLOBAL.SOCKET=");
        console.log(FM_GLOBAL.SOCKET);
    });
    //
    FM_GLOBAL.SOCKET.on("DICTAT RESULT", (arg) => {
        if (FM_GLOBAL.TERMINAL) {
            FM_GLOBAL.TERMINAL.write("\r\n");
            FM_GLOBAL.TERMINAL.write(arg);
            FM_GLOBAL.TERMINAL.prompt();
        }
    });
}
//
function runRealTerminal() {
    // addons.attach.instance = new AttachAddon(socket);
    // term.loadAddon(addons.attach.instance);
    // term._initialized = true;
    // initAddons(term);
    console.log("+- From js: old FM_GLOBAL.SOCKET=");
    console.log(FM_GLOBAL.SOCKET);
}
</script>

<!--  style  -->
<style scoped>
#terminal {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
}
.main_contain_term {
    padding: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    margin-left: 8px;
    margin-right: 8px;
    width: 100%;
    height: calc(100% - 16px);
}
</style>
