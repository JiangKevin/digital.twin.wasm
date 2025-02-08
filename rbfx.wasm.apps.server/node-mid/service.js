const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const project = require("./project.js");
const axios = require("axios");
var os = require("os");
var pty = require("node-pty");
var ServerConfig = JSON.parse(fs.readFileSync(path.join(__dirname, `../config.json`), "utf8"));
const wasm_rcs = require("../web/ResourceConversionSevice/ResourceConversionSevice.js");
//
const uuid = require("uuid-v4");
var vt2geojson = require("@mapbox/vt2geojson");
// var pbf_ = require("pbf");
// import Pbf from 'pbf';

// var concat = require("concat-stream");
// var vt = require("@mapbox/vector-tile");
//////////////////////////////////////
const FM_ = {};
FM_.inited = false;
FM_.dictates = [
    {
        cmd: "help",
        directions: "Description of supported console commands。",
    },
    {
        cmd: "ls",
        directions: "List all files or directories in the current directory。",
    },
    {
        cmd: "cd",
        directions: "Directory Relocation。",
    },
    {
        cmd: "rm",
        directions: "The rm command allows you to remove a file or directory whose name you pass it.Note: Different from the Linux rm command.-d:del folder.",
    },
];
FM_.path = "./Data";
FM_.basePath = path.resolve(FM_.path);

///
function save_project(req, res) {
    if (req.query.Name) {
        var name = req.query.Name;
        var path = `Data/` + name;
        var zip_path = "tmp/";
        var zip_fileName = zip_path + name + ".zip";
        var file_name = path + "/" + name + ".zip";
        let data = req.body;
        // console.log(req);

        // 创建文件夹
        var isExisted = fs.existsSync(path);
        if (!isExisted) {
            fs.mkdirSync(path);
        }
        // 保存文件
        fs.writeFile(zip_fileName, data, (err) => {
            if (err) {
                console.error("File write err.");
            }
            // file written successfully
            // unzip
            project.unzip(zip_fileName, path);
            // 删除临时的zip文件
            fs.rmSync(zip_fileName, { recursive: true, force: true });
            // fs.unlink(zip_fileName, (err) => {
            //     if (err) throw err;
            //     console.log("delete file " + zip_fileName + " success!");
            // });
        });
        //
        // project.save_proejct_to_db(req, res);
    }

    res.send("Save project success.");
}
//
function import_project(req, res) {
    if (req.query.Name) {
        var name = req.query.Name;
        var projectType = req.query.Type;
        // project path
        var path;
        if (projectType == "PROJECT") {
            path = `Data/` + name;
        } else {
            path = `WizardProject/` + name;
        }
        //
        var zip_path = "tmp/";
        var zip_fileName = zip_path + name + ".zip";
        var file_name = path + "/" + name + ".json";
        let file_data;
        // 验证工程路径
        var isExisted = fs.existsSync(path);
        if (isExisted) {
            // 压缩工程路径到zip文件
            project.zipFolder(path, zip_fileName, function (err, msg) {
                console.log(err, msg);
                //

                fs.readFile(zip_fileName, (err, file_data) => {
                    if (err) {
                        console.error("File read err.");
                        res.send("Import project err.");
                    }
                    // console.log(data);
                    res.send(file_data);
                    // 删除临时的zip文件
                    fs.rmSync(zip_fileName, { recursive: true, force: true });
                    // fs.unlink(zip_fileName, (err) => {
                    //     if (err) throw err;
                    //     console.log("delete file " + zip_fileName + " success!");
                    // });
                });
            });
        } else {
            res.send("project is NULL.");
        }
    }
    return "";
}
//
function delete_project(req, res) {
    if (req.query.Name) {
        var name = req.query.Name;
        var projectType = req.query.Type;
        // project path
        var path;
        if (projectType == "PROJECT") {
            path = `Data/` + name;
        } else {
            path = `WizardProject/` + name;
        }
        // 验证工程路径
        fs.rmSync(path, { recursive: true, force: true });
        res.send("project Delete(" + path + ") success.");
    }
    return "";
}
//
function project_lists(req, res) {
    // wizard project paht
    var wizardPath = `WizardProject`;
    // project path
    var projectPath = `Data`;
    // 工程文件夹
    var p = project.getInfoProject(projectPath, "PROJECT", 1000);
    var w = project.getInfoProject(wizardPath, "WIZARD");
    var projectList = w.concat(p);
    res.send(projectList);
}
//
function project_wizard_lists(req, res) {
    // wizard project paht
    var wizardPath = `WizardProject`;
    // project path
    var projectPath = `Data`;
    // 工程文件夹
    var w = project.getInfoProject(wizardPath, "WIZARD");
    res.send(w);
}
//
function project_user_lists(req, res) {
    // wizard project paht
    var wizardPath = `WizardProject`;
    // project path
    var projectPath = `Data`;
    // 工程文件夹
    var p = project.getInfoProject(projectPath, "PROJECT", 1000);
    res.send(p);
}
//
function all_folder_and_files(req, res) {
    var father_data = { uid: 1, type: "folder", name: "./Data", uptime: "2024-4-7 15:15:32", selected: false, filePath: "./Data", children: [] };
    var father_upload = { uid: 1, type: "folder", name: "./Upload", uptime: "2024-4-7 15:15:32", selected: false, filePath: "./Upload", children: [] };

    let tree_upload = project.getFilesAndFoldersInDir_for_tree("./Upload", 100);
    let tree_data = project.getFilesAndFoldersInDir_for_tree("./Data", 10000);
    father_upload.children = tree_upload;
    father_data.children = tree_data;
    //
    var treeList = [];
    treeList = JSON.parse("[" + JSON.stringify(father_upload) + "," + JSON.stringify(father_data) + "]");
    res.send(treeList);
}
//
function folder_and_files_for_path(req, res) {
    if (req.query.path != "") {
        let tree = project.getFilesAndFoldersInDir_for_tree(req.query.path, 20000);
        res.send(tree);
    }
}
//
function delete_folder_or_file(req, res) {
    if (req.body.length > 0) {
        // console.log(req.body);
        for (i = 0; i < req.body.length; i++) {
            var path = req.body[i].filePath;
            fs.rmSync(path, { recursive: true, force: true });
        }
        //
        res.send("Delete file or folder success.");
    }
}
//
function zip_folder_or_file(req, res) {
    if (req.body.length > 0) {
        // console.log(req.body);
        var ret = project.zipFolderAndFiles(req.body, req.query.path, req.query.name, function (err, msg) {});
        //
        if (ret) {
            res.send("Zip file or folder success.");
        } else {
            res.send("Zip file or folder error.");
        }
    }
}
//
function unzip_folder_or_file(req, res) {
    if (req.body.length > 0) {
        // console.log(req.body);
        // 首选建立新文件夹
        var newTempPath = req.query.path + "/" + req.query.name;
        fs.mkdirSync(newTempPath, { recursive: true });

        for (i = 0; i < req.body.length; i++) {
            project.unzip(req.body[i].filePath, newTempPath + "/");
        }
        //
        res.send("UnZip file or folder success.");
    }
}
//
function paste_folder_or_file(req, res) {
    if (req.body.length > 0) {
        // console.log(req.body);
        for (i = 0; i < req.body.length; i++) {
            if (req.query.path != req.body[i].path) {
                if ((req.body[i].type = "folder")) {
                    fs.cpSync(req.body[i].filePath, req.query.path + "/" + req.body[i].name, { force: true, recursive: true });
                } else {
                    fs.copyFileSync(req.body[i].filePath, req.query.path + "/" + req.body[i].name);
                }
            }
        }
        //
        res.send("Paste file or folder success.");
    }
}
//
function create_new_folder(req, res) {
    if (req.query.path.length > 0) {
        var newTempPath = req.query.path + "/" + req.query.name;
        fs.mkdirSync(newTempPath, { recursive: true });
        //
        res.send("Create new folder success.");
    }
}
//
function ws_do(socket) {
    FM_.SOCKET = socket;
    socket.on("DICTATE", (arg) => {
        if (verifyDictate(arg)) {
            dictate_run(arg);
        } else {
            arg.result = "Invalid command.";
            FM_.SOCKET.emit("DICTAT RESULT", arg);
        }
    });
}
//
function verifyDictate(dictate) {
    for (var i = 0; i < FM_.dictates.length; i++) {
        if (FM_.dictates[i].cmd == dictate.dictate) {
            return true;
        }
    }
    //
    return false;
}
//
function dictate_run(dictate) {
    //
    if (dictate.dictate == "ls") {
        FM_.path = dictate.path;
        let tree_data = project.getFilesAndFoldersInDir_for_tree(FM_.path, 10000);
        var data = "";
        for (var i = 0; i < tree_data.length; i++) {
            data += tree_data[i].name + "\t";
        }
        dictate.result = data;
        //
        FM_.SOCKET.emit("DICTAT RESULT", dictate);
    } else if (dictate.dictate == "cd") {
        var tmp_path = dictate.path + "/" + dictate.parameter.trim();
        //
        if (fs.existsSync(tmp_path)) {
            const stat = fs.statSync(tmp_path);
            //
            if (stat.isDirectory()) {
                if (dictate.parameter.trim().length > 0) {
                    path_protection(tmp_path);
                    //
                    dictate.path = FM_.path;
                    dictate.result = "";
                    //
                    FM_.SOCKET.emit("DICTAT RESULT", dictate);
                } else {
                    FM_.path = "./Data";
                    dictate.path = FM_.path;
                    dictate.result = "";
                    FM_.SOCKET.emit("DICTAT RESULT", dictate);
                }
            } else {
                dictate.result = "The target directory is the file.";
                //
                FM_.SOCKET.emit("DICTAT RESULT", dictate);
            }
        } else {
            dictate.result = "Invalid command.";
            //
            FM_.SOCKET.emit("DICTAT RESULT", dictate);
        }
    } else if (dictate.dictate == "rm") {
        //
        if (dictate.parameter.trim().length > 0) {
            //  去掉两头的空格后，按照空格分割字符串
            var paras = dictate.parameter.replace(/^\s+|\s+$/g, "").split(" ");
            //
            if (paras[0] == "-d") {
                // 删除文件夹，不严重路径是否为空，全部删除下面的子文件夹与文件
                var del_ok = true;
                var del_paths = [];
                for (var i = 1; i < paras.length; i++) {
                    var tmp_path = dictate.path + "/" + paras[i].trim();
                    var del_path = path_protection_fix(tmp_path);
                    //
                    if (del_path == -1) {
                        del_ok = false;
                        dictate.result = "The folders were deleted error: " + tmp_path + "\n";
                        dictate.result += "Content protection in non-user folders.";
                        FM_.SOCKET.emit("DICTAT RESULT", dictate);

                        break;
                    }
                    if (del_path == -2) {
                        del_ok = false;
                        dictate.result = "The folders were deleted error: " + tmp_path + "\n";
                        dictate.result += "The target object is not a folder.";
                        FM_.SOCKET.emit("DICTAT RESULT", dictate);

                        break;
                    }
                    if (del_path == -3) {
                        del_ok = false;
                        dictate.result = "The folders were deleted error: " + tmp_path + "\n";
                        dictate.result += "The target object does not exist.";
                        FM_.SOCKET.emit("DICTAT RESULT", dictate);

                        break;
                    } else {
                        del_paths.push(del_path);
                    }
                }
                //
                if (del_ok == true) {
                    dictate.result = "The folders were deleted successfully: \n";
                    for (var i = 0; i < del_paths.length; i++) {
                        dictate.result += del_paths[i] + "\r\n";
                        fs.rmSync(del_paths[i], { recursive: true, force: true });
                    }
                    FM_.SOCKET.emit("DICTAT RESULT", dictate);
                    del_paths = [];
                }
            } else {
                // 删除文件
                var del_ok = true;
                var del_files = [];
                //
                for (var i = 0; i < paras.length; i++) {
                    var tmp_path = dictate.path + "/" + paras[i].trim();
                    var del_file = file_protection_fix(tmp_path);
                    //
                    if (del_file == -1) {
                        del_ok = false;
                        dictate.result = "The files were deleted error: " + tmp_path + "\n";
                        dictate.result += "Content protection in non-user folders.";
                        FM_.SOCKET.emit("DICTAT RESULT", dictate);

                        break;
                    }
                    if (del_file == -2) {
                        del_ok = false;
                        dictate.result = "The files were deleted error: " + tmp_path + "\n";
                        dictate.result += "The target object is not a file.";
                        FM_.SOCKET.emit("DICTAT RESULT", dictate);

                        break;
                    }
                    if (del_file == -3) {
                        del_ok = false;
                        dictate.result = "The files were deleted error: " + tmp_path + "\n";
                        dictate.result += "The target object does not exist.";
                        FM_.SOCKET.emit("DICTAT RESULT", dictate);

                        break;
                    } else {
                        del_files.push(del_file);
                    }
                }
                //
                if (del_ok == true) {
                    dictate.result = "The files were deleted successfully: \n";
                    for (var i = 0; i < del_files.length; i++) {
                        dictate.result += del_files[i] + "\r\n";
                        fs.rmSync(del_files[i], { recursive: true, force: true });
                    }
                    FM_.SOCKET.emit("DICTAT RESULT", dictate);
                    del_files = [];
                }
            }
        } else {
            dictate.result = "Command usage error, missing parameters or object to be deleted.";
            FM_.SOCKET.emit("DICTAT RESULT", dictate);
        }
    } else if (dictate.dictate == "help") {
        var data = "";
        for (var i = 0; i < FM_.dictates.length; i++) {
            data += FM_.dictates[i].cmd + "\t--\t" + FM_.dictates[i].directions + "\r\n";
        }
        dictate.result = data;
        FM_.SOCKET.emit("DICTAT RESULT", dictate);
    } else {
        dictate.result = "Invalid command.";
        //
        FM_.SOCKET.emit("DICTAT RESULT", dictate);
    }
}
// 保护路径，只能在./Data及其子路径下进行操作,影响当前目录
function path_protection(path_to_be_verified) {
    var new_path = path.resolve(path_to_be_verified);
    //
    if (new_path.indexOf(FM_.basePath) == -1) {
        FM_.path = "./Data";
    } else {
        FM_.path = new_path.replace(FM_.basePath, "./Data");
    }
}
//
function path_protection_fix(path_to_be_verified) {
    var new_path = path.resolve(path_to_be_verified);
    //
    if (new_path.indexOf(FM_.basePath) == -1) {
        return -1;
    } else {
        var del_path = new_path.replace(FM_.basePath, "./Data");
        //
        if (fs.existsSync(del_path)) {
            const stat = fs.statSync(del_path);
            //
            if (stat.isDirectory()) {
                return del_path;
            } else {
                return -2;
            }
        } else {
            return -3;
        }
    }
}
//
function file_protection_fix(path_to_be_verified) {
    var new_path = path.resolve(path_to_be_verified);
    //
    if (new_path.indexOf(FM_.basePath) == -1) {
        return -1;
    } else {
        var del_path = new_path.replace(FM_.basePath, "./Data");
        //
        if (fs.existsSync(del_path)) {
            const stat = fs.statSync(del_path);
            //
            if (stat.isFile()) {
                return del_path;
            } else {
                return -2;
            }
        } else {
            return -3;
        }
    }
}
//
function pbfTogeojson(req, res) {
    // console.log(req);
    if (req.query.layer.length <= 0) {
    }
    if (req.query.zoom.length <= 0) {
    }
    if (req.query.lon.length <= 0) {
    }
    if (req.query.lat.length <= 0) {
    }
    //
    // var base_url = "http://192.168.1.102:46598/data/";
    var base_url = ServerConfig.config.CustomMapServer.ip + ":" + ServerConfig.config.CustomMapServer.port + "/data/";

    var res_url = base_url + req.query.layer + "/" + req.query.zoom + "/" + req.query.lon + "/" + req.query.lat + ".pbf";
    //
    // console.log(res_url);
    var res_layer;
    // remote file
    vt2geojson(
        {
            uri: res_url,
            layer: res_layer,
        },
        function (err, result) {
            if (err) {
                res.send("PBF2Geojson error.");
            }
            // console.log(result); // => GeoJSON FeatureCollection
            res.send(result);
        }
    );
}
//
function make_graph_for_node(req, res) {
    //
    var json_data = req.body;
    //
    axios({
        method: "post",
        url: "http://" + ServerConfig.config.WasmBackstageServer.ip + ":" + ServerConfig.config.WasmBackstageServer.port + "/" + "make_graph_for_node",
        data: json_data,
    }).then(function (response) {
        var uuid_str = uuid();
        var stl_file = "./tmp/" + uuid_str + ".stl";
        var txt_file = "./tmp/" + uuid_str + ".txt";
        //
        if (response.data.length >= 0) {
            fs.writeFileSync(stl_file, response.data);
            //
            var wrcs_ = wasm_rcs();
            // ----------------------------------------------
            wrcs_.then((asset) => {
                var rcs_ = asset;
                //
                var ret = rcs_.ccall("DoRun", "int", ["int", "string"], [2, "stl2mdl" + "|" + uuid_str]);
                if (ret != 0) {
                    console.log("ResourceToMdlSevice run error.");
                    res.send("ResourceToMdlSevice error.");
                }
                //
                var mdl_name = uuid_str + ".mdl";
                var mdl_file = "./tmp/" + mdl_name;
                const data = fs.readFileSync(mdl_file);
                res.send(data);
                //
                fs.rmSync(mdl_file, { recursive: true, force: true });
                fs.rmSync(stl_file, { recursive: true, force: true });
                fs.rmSync(txt_file, { recursive: true, force: true });
            });
        } else {
            res.send("make_graph_for_node error.");
        }
    }).catch(function (error) {
        res.send("make_graph_for_node error.");
    }); 
}
//
function pbfTogeojsonForSevice(req, res) {
    //
    var base_url = ServerConfig.config.CustomMapServer.ip + ":" + ServerConfig.config.CustomMapServer.port + "/data/";
    var res_url = base_url + req.query.layer + "/" + req.query.zoom + "/" + req.query.x + "/" + req.query.y + ".pbf";
    var res_layer;
    //
    vt2geojson(
        {
            uri: res_url,
            layer: res_layer,
        },
        function (err, result) {
            if (err) {
                return "PBF2Geojson error.";
            }
            //
            var geojson_name = "./tmp/" + req.query.zoom + "-" + req.query.x + "-" + req.query.y + ".json";
            // console.log(result);
            fs.writeFileSync(geojson_name, JSON.stringify(result));
            //
            var wrcs_ = wasm_rcs();
            // ----------------------------------------------
            wrcs_.then((asset) => {
                var rcs_ = asset;
                //
                var ret = rcs_.ccall("DoRun", "int", ["int", "string"], [12, "json2mdl" + "|" + req.query.zoom + "|" + req.query.x + "|" + req.query.y + "|" + req.query.lon + "|" + req.query.lat + "|" + req.query.geo_scale + "|" + req.query.geo_h + "|" + req.query.is_filter + "|" + req.query.limit + "|" + req.query.filter_property + "|" + req.query.filter_value]);
                if (ret != 0) {
                    console.log("pbfTogeojsonForSevice run error.");
                    res.send("pbfTogeojsonForSevice error.");
                }
                //
                var mdl_file = "./tmp/" + req.query.zoom + "-" + req.query.x + "-" + req.query.y + ".mdl";
                //
                const data = fs.readFileSync(mdl_file);
                res.setHeader("Content-Type", "application/octet-stream");
                res.send(data);
            });
            // ----------------------------------------------
        }
    );
    //
    // var input = fs.createReadStream(process.argv[2]);
}
//
function ResourceToMdlSevice(req, res) {
    //
    var wrcs_ = wasm_rcs();
    // ----------------------------------------------
    wrcs_.then((asset) => {
        var rcs_ = asset;
        //
        var ret = rcs_.ccall("DoRun", "int", ["int", "string"], [2, "ply2mdl" + "|" + req.query.filename]);
        if (ret != 0) {
            console.log("ResourceToMdlSevice run error.");
            res.send("ResourceToMdlSevice error.");
        }
        //
        var mdl_file = "./tmp/" + req.query.filename + ".mdl";
        const data = fs.readFileSync(mdl_file);
        res.send(data);
    });
    // ----------------------------------------------
}
//////////////////////////////////////
//
//
//
//
//////////////////////////////////////
module.exports = {
    save_project,
    import_project,
    project_lists,
    delete_project,
    project_wizard_lists,
    project_user_lists,
    all_folder_and_files,
    folder_and_files_for_path,
    delete_folder_or_file,
    zip_folder_or_file,
    unzip_folder_or_file,
    paste_folder_or_file,
    create_new_folder,
    ws_do,
    pbfTogeojson,
    pbfTogeojsonForSevice,
    ResourceToMdlSevice,
    make_graph_for_node,
};
