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
import { WebglAddon } from '@xterm/addon-webgl';
//
onMounted(() => {
    initSocket();
    initXterm("");
});
//
function runFakeTerminal() {
    if (FM_GLOBAL.TERMINAL._initialized) {
        return;
    }
    // 初始化
    FM_GLOBAL.TERMINAL._initialized = true;
    //
    setTimeout(() => {
        FM_GLOBAL.TERMINAL.clear();
        FM_GLOBAL.TERMINAL.prompt();
    }, "1000");

    // 添加事件监听器，支持输入方法
    FM_GLOBAL.TERMINAL.onKey((e) => {
        const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;
        if (e.domEvent.keyCode === 13) {
            //
            if (FM_GLOBAL.SOCKET) {
                if (mainStore_menu.instruction.dictate != "") {
                    // console.log(mainStore_menu.instruction.dictate)
                    if (mainStore_menu.instruction.dictate == "clear" || mainStore_menu.instruction.dictate == "reset") {
                        FM_GLOBAL.TERMINAL.clear();
                        FM_GLOBAL.TERMINAL.prompt();
                    } else {
                        FM_GLOBAL.SOCKET.emit("DICTATE", mainStore_menu.instruction.dictate);
                    }
                }
            }
            //
            if (mainStore_menu.instruction.dictate == "") {
                FM_GLOBAL.TERMINAL.prompt();
            }
            //
            mainStore_menu.instruction.dictate = "";

        } else if (e.domEvent.keyCode === 8) {
            // back 删除的情况
            if (FM_GLOBAL.TERMINAL._core.buffer.x > mainStore_menu.instruction.path_len) {
                FM_GLOBAL.TERMINAL.write("\b \b");
                mainStore_menu.instruction.dictate = mainStore_menu.instruction.dictate.slice(0, -1);
            }
        } else if (printable) {
            FM_GLOBAL.TERMINAL.write(e.key);
            mainStore_menu.instruction.dictate += e.key;
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
function format_now() {
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);
    // const formattedTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    const formattedTime = hours + ":" + minutes + ":" + seconds;
    //
    return formattedTime;
}
function format_path() {
    return mainStore_menu.instruction.path;
}
//
function initXterm(webSocket) {
    var space = 56;
    var lineHeight = 15;
    var w_space = 8;
    var row_count;
    var col_count;
    if (mainStore_menu.rail) {
        col_count = parseInt((window.innerWidth - 55 - w_space) / lineHeight);
    } else {
        col_count = parseInt((window.innerWidth - 255 - w_space) / lineHeight);
    }
    row_count = parseInt((window.innerHeight - space) / lineHeight);
    // console.log(row_count);
    // console.log(col_count);

    //
    FM_GLOBAL.TERMINAL = new Terminal({
        rendererType: "canvas", //渲染类型
        rows: row_count, //行数
        cols: col_count, // 不指定行数，自动回车后光标从下一行开始
        convertEol: true, //启用时，光标将设置为下一行的开头
        // scrollback: 50, //终端中的回滚量
        disableStdin: true, //是否应禁用输入
        cursorStyle: "underline", //光标样式
        cursorBlink: true, //光标闪烁
        lineHeight: 1.0,
        fontSize: 13,
        altClickMovesCursor: false,
        // theme:"xtermjs",
        theme: {
            foreground: "#ff6300", //字体
            background: "#00000000", //背景色
            selectionForeground: "#ff00aa",
            selectionBackgroundTransparent: "#4558ff",
        },
    });
    // canvas背景全屏
    const fitAddon = new FitAddon();
    FM_GLOBAL.TERMINAL.loadAddon(fitAddon);

    // 
    setTimeout(() => {
        fitAddon.fit();
    }, "1000");
    // 
    FM_GLOBAL.TERMINAL.loadAddon(new WebglAddon());
    // 
    if ((webSocket != "")) {
        const attachAddon = new AttachAddon(webSocket);
        FM_GLOBAL.TERMINAL.loadAddon(attachAddon);
    }
    //
    FM_GLOBAL.TERMINAL.open(document.getElementById("terminal"));
    // 换行并输入起始符 $
    FM_GLOBAL.TERMINAL.prompt = (_) => {
        var prompt_str = "\r\n\x1b[33m⚡[" + format_now() + "][" + format_path() + "]$:\x1b[0m ";
        mainStore_menu.instruction.path_len = prompt_str.length;
        FM_GLOBAL.TERMINAL.write(prompt_str);
    };
    //
    FM_GLOBAL.TERMINAL.clear();
    FM_GLOBAL.TERMINAL.prompt();
    //
    window.addEventListener("resize", resizeScreen);
    function resizeScreen() {
        try {
            // 窗口大小改变时，触发xterm的resize方法使自适应
            fitAddon.fit(space);
            term_fit(space, w_space);
            FM_GLOBAL.TERMINAL.scrollToBottom();
        } catch (e) {
            console.log("e", e.message);
        }
    }
    //
    runFakeTerminal();
    //
    term_fit(space, w_space);
}
//
function term_fit(space, w_space) {
    var xterm_screen = document.querySelector(".xterm-screen");
    if (xterm_screen) {
        if (mainStore_menu.rail) {
            xterm_screen.style.width = window.innerWidth - 55 - w_space + "px";
            xterm_screen.style.height = window.innerHeight - space + "px";
        } else {
            xterm_screen.style.width = window.innerWidth - 255 - w_space + "px";
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
        console.log("+- From js: Socket ok.");
    });
    //
    FM_GLOBAL.SOCKET.on("DICTAT RESULT", (arg) => {
        console.log(arg)
        if (arg != "") {
            if (arg.startsWith("path") != -1) {
                var paths = arg.split(":");
                console.log(paths)
                mainStore_menu.instruction.path = paths[1]
                FM_GLOBAL.TERMINAL.prompt();
            }
            else {
                FM_GLOBAL.TERMINAL.write("\r\n");
                FM_GLOBAL.TERMINAL.write(arg.replace(/\r\n/g, ""));
                FM_GLOBAL.TERMINAL.prompt();
            }
        }
        else {
            FM_GLOBAL.TERMINAL.prompt();
        }
    });
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
    margin-top: 8px;
    margin-bottom: 8px;
    margin-left: 8px;
    margin-right: 8px;
    width: 100%;
    height: calc(100% - 8px);
}
</style>
