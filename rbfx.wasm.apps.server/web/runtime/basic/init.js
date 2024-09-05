//
function run_code(code) {
    eval(code);
}
//
// const monaco_config = {
//     value: "",
//     acceptSuggestionOnCommitCharacter: true, // 接受关于提交字符的建议
//     acceptSuggestionOnEnter: "on", // 接受输入建议 "on" | "off" | "smart"
//     accessibilityPageSize: 10, // 辅助功能页面大小 Number 说明：控制编辑器中可由屏幕阅读器读出的行数。警告：这对大于默认值的数字具有性能含义。
//     theme: "fm-theme",
//     accessibilitySupport: "on", // 辅助功能支持 控制编辑器是否应在为屏幕阅读器优化的模式下运行。
//     autoClosingBrackets: "always", // 是否自动添加结束括号(包括中括号) "always" | "languageDefined" | "beforeWhitespace" | "never"
//     autoClosingDelete: "always", // 是否自动删除结束括号(包括中括号) "always" | "never" | "auto"
//     autoClosingOvertype: "always", // 是否关闭改写 即使用insert模式时是覆盖后面的文字还是不覆盖后面的文字 "always" | "never" | "auto"
//     autoClosingQuotes: "always", // 是否自动添加结束的单引号 双引号 "always" | "languageDefined" | "beforeWhitespace" | "never"
//     colorDecorators: false, // 呈现内联色彩装饰器和颜色选择器
//     comments: {
//         ignoreEmptyLines: true, // 插入行注释时忽略空行。默认为真。
//         insertSpace: true, // 在行注释标记之后和块注释标记内插入一个空格。默认为真。
//     }, // 注释配置
//     copyWithSyntaxHighlighting: true, // 是否应将语法突出显示复制到剪贴板中 即 当你复制到word中是否保持文字高亮颜色
//     cursorBlinking: "Solid", // 光标动画样式
//     cursorSmoothCaretAnimation: true, // 是否启用光标平滑插入动画  当你在快速输入文字的时候 光标是直接平滑的移动还是直接"闪现"到当前文字所处位置
//     cursorStyle: "UnderlineThin", // "Block"|"BlockOutline"|"Line"|"LineThin"|"Underline"|"UnderlineThin" 光标样式
//     cursorSurroundingLines: 0, // 光标环绕行数 当文字输入超过屏幕时 可以看见右侧滚动条中光标所处位置是在滚动条中间还是顶部还是底部 即光标环绕行数 环绕行数越大 光标在滚动条中位置越居中
//     cursorSurroundingLinesStyle: "all", // "default" | "all" 光标环绕样式
//     cursorWidth: 4, // <=25 光标宽度
//     minimap: {
//         enabled: false, // 是否启用预览图
//     }, // 预览图设置
//     folding: true, // 是否启用代码折叠
//     overviewRulerBorder: true, // 是否应围绕概览标尺绘制边框
//     language: "javascript",
//     lineNumbers: "on",
//     autoClosingOvertype: "true",
//     autoIndent: "true",
//     automaticLayout: true,
//     renderLineHighlight: "all",
//     codeLensFontSize: 12,
// };
// //
// function add_monaco_editor() {
//     var script = document.createElement("script");
//     script.setAttribute("src", "./runtime/js/monaco-editor/min/vs/loader.js");

//     script.onload = function (obj) {
//         require.config({ paths: { vs: "./runtime/js/monaco-editor/min/vs" } });
//         require(["vs/editor/editor.main"], function () {
//             //
//             FM_GLOBAL.MONACO = window.monaco;
//             //
//             FM_GLOBAL.MONACO.editor.defineTheme("fm-theme", {
//                 base: "vs-dark",
//                 inherit: true,
//                 rules: [{ token: "comment", foreground: "008000", fontStyle: "italic" }],
//                 colors: {
//                     "editor.lineHighlightBackground": "#0000008c",
//                 },
//             });

//             FM_GLOBAL.MONACO.editor.setTheme("fm-theme");
//         });
//     };
//     document.body.appendChild(script);
// }
// add_monaco_editor();
