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
        // console.log("+- From js: " + js_url + " Download.");
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
        // console.log("+- From js: " + js_url + " is Download.");
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
async function writeFile(fileHandle, contents) {
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
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
//
export function busy_div_control(div_name, is_view) {
    var select_div = document.getElementById(div_name);
    if (select_div) {
        select_div.style = "";
        select_div.style.display = "";
        if (is_view) {
            select_div.style.display = "block";
        } else {
            select_div.style.visibility = "hidden";
            select_div.style.display = "none";
        }
    }
}
//
export function clear_busy_log(div_name) {
    var select_div = document.getElementById(div_name);
    if (select_div) {
        select_div.value = "";
    }
}
// --------------------------------------------------------------------------------

export const loadFileAsync = (file) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
};

export const loadSTEPorIGES = async (openCascade, inputFile, addFunction, scene) => {
    await loadFileAsync(inputFile).then(async (fileText) => {
        // 文件是原生还是扩展
        var nativeOrExtended = {};
        //
        const fileType = (() => {
            switch (inputFile.name.toLowerCase().split(".").pop()) {
                case "step":
                case "stp": {
                    nativeOrExtended.type = "native";
                    nativeOrExtended.extend_file_type = "step";
                    return "step";
                }
                case "iges":
                case "igs": {
                    nativeOrExtended.type = "native";
                    nativeOrExtended.extend_file_type = "iges";
                    return "iges";
                }
                case "stl": {
                    nativeOrExtended.type = "extend";
                    nativeOrExtended.extend_file_type = "stl";
                    return "stl";
                }
                default: {
                    return undefined;
                }
            }
        })();
        // Writes the uploaded file to Emscripten's Virtual Filesystem
        openCascade.FS.createDataFile("/", `file.$ { fileType }`, fileText, true, true);

        // Choose the correct OpenCascade file parsers to read the CAD file
        var reader = null;
        var readShape = null;
        var readResult = null;
        var wasm_filename = "/" + inputFile.name;

        //
        if (nativeOrExtended.type == "native") {
            if (fileType === "step") {
                reader = new openCascade.STEPControl_Reader_1();
            } else if (fileType === "iges") {
                reader = new openCascade.IGESControl_Reader_1();
            } else {
                console.error("opencascade.js can't parse this extension! (yet)");
                return;
            }
            //
            readResult = reader.ReadFile(`file.$ { fileType }`); // Read the file
            //
            if (readResult === openCascade.IFSelect_ReturnStatus.IFSelect_RetDone) {
                console.log("file loaded successfully!     Converting to OCC now...");
                const numRootsTransferred = reader.TransferRoots(new openCascade.Message_ProgressRange_1()); // Translate all transferable roots to OpenCascade
                const stepShape = reader.OneShape(); // Obtain the results of translation in one OCCT shape
                console.log(inputFile.name + " converted successfully!  Triangulating now...");

                // Out with the old, in with the new!
                scene.remove(scene.getObjectByName("shape"));
                await addFunction(openCascade, stepShape, scene);
                console.log(inputFile.name + " triangulated and added to the scene!");

                // Remove the file when we're done (otherwise we run into errors on reupload)
                openCascade.FS.unlink(`/ file.$ { fileType }`);
            } else {
                console.error("Something in OCCT went wrong trying to read " + inputFile.name);
            }
        } else {
            if (fileType === "stl") {
                reader = new openCascade.StlAPI_Reader();
                readShape = new openCascade.TopoDS_Shape();
            } else {
                console.error("opencascade.js can't parse this extension! (yet)");
                return;
            }
            //
            if (reader.Read(readShape, `file.$ { fileType }`)) {
                console.log(inputFile.name + " loaded successfully!     Converting to OCC now...");
                // Out with the old, in with the new!
                scene.remove(scene.getObjectByName("shape"));
                await addFunction(openCascade, readShape, scene);
                console.log(inputFile.name + " triangulated and added to the scene!");

                // Remove the file when we're done (otherwise we run into errors on reupload)
                openCascade.FS.unlink(`/ file.$ { fileType }`);
            } else {
                console.error("Something in OCCT went wrong trying to read " + inputFile.name);
            }
        }
    });
};

export const setupThreeJSViewport = () => {
    //
    var scene = new FM_GLOBAL.THREE.Scene();
    var camera = new FM_GLOBAL.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    var renderer = new FM_GLOBAL.THREE.WebGLRenderer({ antialias: true });
    const viewport = document.getElementById("viewport");
    //
    if (viewport) {
        renderer.setSize(window.innerWidth - 275, window.innerHeight - 124);
        viewport.appendChild(renderer.domElement);

        const light = new FM_GLOBAL.THREE.AmbientLight(0x404040);
        scene.add(light);
        const directionalLight = new FM_GLOBAL.THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0.5, 0.5, 0.5);
        scene.add(directionalLight);

        camera.position.set(0, 50, 100);

        const controls = new FM_GLOBAL.ORBITCONTROLS(camera, renderer.domElement);
        controls.screenSpacePanning = true;
        controls.target.set(0, 50, 0);
        controls.update();

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }
    return scene;
};
export const setupThreeJSCore = (rail) => {
    var cad_core = {};
    //
    var scene = new FM_GLOBAL.THREE.Scene();
    var camera = new FM_GLOBAL.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new FM_GLOBAL.THREE.WebGLRenderer({ antialias: true });
    //
    var renderer_w;
    if (rail) {
        renderer_w = (window.innerWidth - 55) / 2;
    } else {
        renderer_w = (window.innerWidth - 255) / 2;
    }
    //
    renderer.setSize(renderer_w, window.innerHeight);
    const light = new FM_GLOBAL.THREE.AmbientLight(0x404040);
    scene.add(light);
    const directionalLight = new FM_GLOBAL.THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0.5, 0.5, 0.5);
    scene.add(directionalLight);
    camera.position.set(0, 50, 100);
    const controls = new FM_GLOBAL.ORBITCONTROLS(camera, renderer.domElement);
    controls.screenSpacePanning = true;
    controls.target.set(0, 50, 0);
    controls.update();
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
    //
    cad_core.scene = scene;
    cad_core.renderer = renderer;
    //
    return cad_core;
};
// //
// export const addVisulizeShapeToScene = async (openCascade, shape, scene, shapeName) => {
//     const objectMat = new FM_GLOBAL.THREE.MeshStandardMaterial({
//         color: new FM_GLOBAL.THREE.Color(0.9, 0.9, 0.9),
//     });

//     let geometries = visualize(openCascade, shape);

//     let group = new FM_GLOBAL.THREE.Group();
//     geometries.forEach((geometry) => {
//         group.add(new FM_GLOBAL.THREE.Mesh(geometry, objectMat));
//     });

//     group.name = shapeName;
//     group.rotation.x = -Math.PI / 2;
//     scene.add(group);
// };
/**  Save the current shape to .obj */
export const saveShapeOBJ = async (scene) => {
    var objExporter = new FM_GLOBAL.THREE_OBJEXPORTER();
    let result = objExporter.parse(scene);
    //
    if (window.showSaveFilePicker) {
        const fileHandle = await getNewFileHandle("OBJ files", "text/plain", "obj");
        writeFile(fileHandle, result).then(() => {
            console.log("Saved OBJ to " + fileHandle.name);
        });
    } else {
        await downloadFile(result, "Untitled", "model/obj", "obj");
    }
};
/**  Save the current shape to an ASCII .stl */
export const saveShapeSTL = async (scene) => {
    var stlExporter = new FM_GLOBAL.THREE_STLEXPORTER();
    let result = stlExporter.parse(scene);
    //
    if (window.showSaveFilePicker) {
        const fileHandle = await getNewFileHandle("STl files", "text/plain", "stl");
        writeFile(fileHandle, result).then(() => {
            console.log("Saved STl to " + fileHandle.name);
        });
    } else {
        await downloadFile(result, "Untitled", "model/stl", "stl");
    }
};
export const saveShapeSTEP = async (filename = "CascadeStudioPart.step") => {
    let writer = new FM_GLOBAL.OPENCASCADE.STEPControl_Writer();
    // Convert to a .STEP File
    let transferResult = writer.Transfer(FM_GLOBAL.CAD_SCENE, 0);
    //
    if (window.showSaveFilePicker) {
        const fileHandle = await getNewFileHandle("STEP files", "text/plain", "step");
        writeFile(fileHandle, result).then(() => {
            console.log("Saved STEP to " + fileHandle.name);
        });
    } else {
        await downloadFile(result, "Untitled", "model/step", "step");
    }
};
export const saveShapeGLTF = async (scene) => {
    var gltfExporter = new FM_GLOBAL.THREE_GLTFEXPORTER();
    let result = gltfExporter.parse(scene);
    //
    if (window.showSaveFilePicker) {
        const fileHandle = await getNewFileHandle("GLTF files", "text/plain", "gltf");
        writeFile(fileHandle, result).then(() => {
            console.log("Saved GLTF to " + fileHandle.name);
        });
    } else {
        await downloadFile(result, "Untitled", "model/gltf", "gltf");
    }
};
export const saveCodeOfCad = async (code) => {
    //
    if (window.showSaveFilePicker) {
        const fileHandle = await getNewFileHandle("TXT files", "text/plain", "txt");
        writeFile(fileHandle, code).then(() => {
            console.log("Saved TXT to " + fileHandle.name);
        });
    } else {
        await downloadFile(result, "Untitled", "model/txt", "txt");
    }
};
