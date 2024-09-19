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
// import Stomp from "@/assets/js/stomp/stomp.min.js";
// import { Client } from "@stomp/stompjs";
import { io, Manager } from "socket.io-client";
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
        // console.log(1, "print", e.key);
    });
    FM_GLOBAL.TERMINAL.onData((key) => {
        // 粘贴的情况
        if (key.length > 1) {
            FM_GLOBAL.TERMINAL.write(key);
        }
    });
}
//
function initXterm() {
    var space = 58;
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
    // FM_GLOBAL.TERMINAL.writeln('This is Web Terminal of Modb; Good Good Study, Day Day Up.')
    FM_GLOBAL.TERMINAL.prompt();
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
    // FM_GLOBAL.STOMPCLIENT = new Client({
    //     brokerURL: "wss://192.168.254.108:3001/wss",
    //     onConnect: () => {
    //         initXterm();
    //         //
    //         FM_GLOBAL.STOMPCLIENT.subscribe("/topic/test01", (message) => console.log(`Received: ${message.body}`));
    //         FM_GLOBAL.STOMPCLIENT.publish({ destination: "/topic/test01", body: "First Message" });
    //     },
    // });
    // FM_GLOBAL.STOMPCLIENT.activate();
    // // 建立连接对象
    // let sockUrl = "ws://127.0.0.1:8086/web-terminal";
    // let socket = new WebSocket(sockUrl);
    // // 获取STOMP子协议的客户端对象
    // FM_GLOBAL.STOMPCLIENT = Stomp.over(socket);
    // // 向服务器发起websocket连接
    // this.stompClient.connect(
    //     {},
    //     (res) => {
    //         initXterm();
    //         FM_GLOBAL.STOMPCLIENT.subscribe("/topic/1024", (frame) => {
    //             writeShell(frame.body);
    //         });
    //         sentFirst();
    //     },
    //     (err) => {
    //         console.log("失败：" + err);
    //     }
    // );
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
    FM_GLOBAL.SOCKET = io(endpoint_);
    //

    // FM_GLOBAL.SOCKET.on("hello", (arg) => {
    //     console.log(arg);
    // });

    // const manager = new Manager(endpoint_, {
    //     autoConnect: true,
    // });

    // FM_GLOBAL.SOCKET = manager.socket("/");

    // manager.open((err) => {
    //     if (err) {
    //         // an error has occurred
    //     } else {
    //         console.log("+- From js: socket manager ok.");
    //         initXterm();
    //     }
    // });

    FM_GLOBAL.SOCKET.on("connect", () => {
        console.log("+- From js: socket ok.");
        initXterm();
    });
    FM_GLOBAL.SOCKET.on("hello", (arg) => {
        console.log(arg);
    });
}
//
function sendShell(data) {
    let _bar = {
        operate: "command",
        command: data,
        userId: 1024,
    };
    FM_GLOBAL.STOMPCLIENT.send("/msg", {}, JSON.stringify(_bar));
}
//
function writeShell(data) {
    FM_GLOBAL.TERMINAL.write(data);
}
// 连接建立，首次发送消息连接 ssh
function sentFirst() {
    let _bar = {
        operate: "connect",
        host: "***",
        port: 22,
        username: "***",
        password: "***",
        userId: 1024,
    };
    FM_GLOBAL.STOMPCLIENT.send("/msg", {}, JSON.stringify(_bar));
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
