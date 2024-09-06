export var Module = {};
//0-arraybuffer 1text
export function fm_download(url, resposeType) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = resposeType;
        xhr.onload = function () {
            console.log(xhr.response);
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            reject(e);
        };
        xhr.send(null);
    });
}
//
export function fm_addScriptToDom(scriptCode) {
    return new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        var blob = new Blob([scriptCode], {
            type: "application/javascript",
        });
        var objectUrl = URL.createObjectURL(blob);
        script.src = objectUrl;
        script.onload = function () {
            console.log("added js script to dom");
            script.onload = script.onerror = null; // Remove these onload and onerror handlers, because these capture the inputs to the Promise and the input function, which would leak a lot of memory!
            URL.revokeObjectURL(objectUrl); // Free up the blob. Note that for debugging purposes, this can be useful to comment out to be able to read the sources in debugger.
            resolve();
        };
        script.onerror = function (e) {
            script.onload = script.onerror = null; // Remove these onload and onerror handlers, because these capture the inputs to the Promise and the input function, which would leak a lot of memory!
            URL.revokeObjectURL(objectUrl);
            console.error("script failed to add to dom: " + e);
            reject(e.message || "(out of memory?)");
        };
        document.body.appendChild(script);
    });
}
//
export function fm_addScript(js_url, async, m) {
    var script = document.createElement("script");
    if (m) {
        script.setAttribute("type", "module");
    }
    if (async) {
        script.setAttribute("async", "");
    }
    script.setAttribute("src", js_url);

    script.onload = function (obj) {
        console.log("+- From js: " + js_url + " is Download.");
        // console.log(obj);
    };
    document.body.appendChild(script);
}
export function fm_addScript_for_dtwin(js_url, async, m, object) {
    var script = document.createElement("script");
    if (m) {
        script.setAttribute("type", "module");
    }
    if (async) {
        script.setAttribute("async", "");
    }
    script.setAttribute("src", js_url);
    //
    script.onload = function (obj) {
        console.log("+- From js: " + js_url + " is Download.");
        // console.log(Module);
    };
    script.onDOMContentLoaded = function (obj) {
        console.log("+- From js: " + js_url + " is DOMContentLoaded.");
        // console.log(Module);
    };

    //
    document.body.appendChild(script);
}
//
export function init_dt_wasm() {
    var div_canvas = document.getElementById("canvas");
    if (div_canvas) {
        console.log(div_canvas);
        /// html 里面关闭esc
        document.onkeydown = killesc;
        function killesc() {
            if (window.event.keyCode == 27) {
                console.log("The ESC Pressed.");
                window.event.keyCode = 0;
                window.event.returnValue = false;
            }
        }
        //
        Module = {
            preRun: [],
            postRun: [],
            print: (function () {
                var element = document.getElementById("output");
                if (element) {
                    element.value = "";
                }
                return function (text) {
                    if (arguments.length > 1) {
                        text = Array.prototype.slice.call(arguments).join(" ");
                    }
                    console.log(text);
                    if (element) {
                        element.value += text + "\n";
                        element.scrollTop = element.scrollHeight; // focus on bottom
                    }
                };
            })(),
            printErr: function (text) {
                if (arguments.length > 1) {
                    text = Array.prototype.slice.call(arguments).join(" ");
                }
                if (0) {
                    dump(text + "\n");
                } else {
                    console.error(text);
                }
            },
            canvas: (function () {
                var canvas = document.getElementById("canvas");
                canvas.addEventListener(
                    "webglcontextlost",
                    function (e) {
                        alert("WebGL context lost. You will need to reload the page.");
                        e.preventDefault();
                    },
                    false
                );
                return canvas;
            })(),
            setStatus: function (text) {
                if (!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: "" };
                if (text === Module.setStatus.text) {
                    return;
                }
                var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
                var now = Date.now();
                if (m && now - Date.now() < 10) return; // if this is a progress update, skip it if too soon
                // if (m) {
                //   console.log("__");
                //   text = m[1];
                //   progressElement.value = parseInt(m[2]) * 100;
                //   progressElement.max = parseInt(m[4]) * 100;
                //   progressElement.hidden = false;
                //   spinnerElement.hidden = false;
                //   other_centerElement.hidden = false;
                // } else {
                //   progressElement.value = null;
                //   progressElement.max = null;
                //   progressElement.hidden = true;
                //   if (!text) {
                //     spinnerElement.hidden = true;
                //     other_centerElement.hidden = true;
                //   }
                // }
                // statusElement.innerHTML = text;
            },
            totalDependencies: 0,
            monitorRunDependencies: function (left) {
                this.totalDependencies = Math.max(this.totalDependencies, left);
                Module.setStatus(left ? "Preparing... (" + (this.totalDependencies - left) + "/" + this.totalDependencies + ")" : "All downloads complete.");
            },
        };

        //
        Module.setStatus("Downloading...");
        //
        window.onerror = function () {
            Module.setStatus("Exception thrown, see JavaScript console");
            // spinnerElement.style.display = "none";
            Module.setStatus = function (text) {
                if (text) {
                    Module.printErr("[post-exception status] " + text);
                }
            };
        };
        //
        Module["preRun"].push(function () {
            Module["addRunDependency"]("IndexedDB");
            FS.mkdir("/IndexedDB");
            // FS.mount(IDBFS, {}, "/IndexedDB");
            FS.syncfs(true, function (err) {
                if (err) {
                    console.error(err);
                }
                Module["removeRunDependency"]("IndexedDB");
            });
        });

        //
        Module.getPreloadedPackage = function (remotePackageName, remotePackageSize) {
            console.log("Runtime asking for remote package " + remotePackageName + ", expected size " + remotePackageSize + "bytes.");
            return Module["downloadedData"];
        };
    }
}
//
export function simple_wasm(Module) {
    Module = {
        preRun: [],
        postRun: [],
        print: (function () {
            return function (text) {
                console.log("+- From c++: " + text);
            };
        })(),
        canvas: document.getElementById("canvas"),
    };
    //
    Module["preRun"].push(function () {
        Module["addRunDependency"]("IndexedDB");
        FS.mkdir("/IndexedDB");
        // FS.mount(IDBFS, {}, "/IndexedDB");
        FS.syncfs(true, function (err) {
            if (err) {
                console.error(err);
            }
            Module["removeRunDependency"]("IndexedDB");
        });
    });
}
//
export function fm_delScript(js_url) {
    var script = Array.from(document.getElementsByTagName("script")).find(function (script) {
        var src = script.getAttribute("src");
        return src && src.startsWith(js_url);
    });
    if (script) {
        script.remove();
    }
}
//
export function open_rbfx_code_file(editor, log_span) {
    var open_file_input = document.getElementById("rbfx-code-file");
    //
    if (open_file_input) {
        open_file_input.addEventListener("input", async (event) => {
            try {
                var code = await event.srcElement.files[0].text();
                editor.setValue(code);
                log_span.innerText = "+-  Load File: " + event.srcElement.files[0].name;
            } catch (e) {
                log_span.innerText = "+-  " + e.message;
            } finally {
            }
        });
    }
}
//
export function open_cascad_code_file(editor, log_span) {
    var open_file_input = document.getElementById("cascade-code-file");
    //
    if (open_file_input) {
        open_file_input.addEventListener("input", async (event) => {
            try {
                var code = await event.srcElement.files[0].text();
                editor.setValue(code);
                log_span.innerText = "+-  Load File: " + event.srcElement.files[0].name;
            } catch (e) {
                log_span.innerText = "+-  " + e.message;
            } finally {
            }
        });
    }
}
//
async function getNewFileHandle(desc, mime, ext, open = false) {
    const options = {
        types: [
            {
                description: desc,
                accept: {
                    [mime]: ["." + ext],
                },
            },
        ],
    };
    if (open) {
        return await window.showOpenFilePicker(options);
    } else {
        return await window.showSaveFilePicker(options);
    }
}
//
async function downloadFile(data, name, mime, ext) {
    const blob = new Blob([data], { type: mime });
    const a = document.createElement("a");
    a.download = name + "." + ext;
    a.style.display = "none";
    a.href = window.URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(a.href);
}
//
export const saveCodeToFile = async (code, log_span) => {
    //
    if (window.showSaveFilePicker) {
        const fileHandle = await getNewFileHandle("files", "text/plain", "js");
        writeFile(fileHandle, code).then(() => {
            log_span.innerText = "Saved code to " + fileHandle.name;
        });
    } else {
        await downloadFile(result, "Untitled", "model/txt", "js");
    }
};
