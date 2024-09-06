//
const FM_ = {};
//
FM_.Clear = function () {
    // call
    FM_GLOBAL.DTWIN_EDITOR._Clear();
};
//
FM_.CreateChild = function (name) {
    // to wasm heap
    var lengthBytes_for_name = lengthBytesUTF8(name) + 1;
    var string_on_wasm_heap_for_name = _malloc(lengthBytes_for_name);
    stringToUTF8(name, string_on_wasm_heap_for_name, lengthBytes_for_name);
    // call
    FM_GLOBAL.DTWIN_EDITOR._CreateChild(string_on_wasm_heap_for_name);
    // free
    _free(string_on_wasm_heap_for_name);
};
//
FM_.RemoveChild = function (name) {
    // to wasm heap
    var lengthBytes_for_name = lengthBytesUTF8(name) + 1;
    var string_on_wasm_heap_for_name = _malloc(lengthBytes_for_name);
    stringToUTF8(name, string_on_wasm_heap_for_name, lengthBytes_for_name);
    // call
    FM_GLOBAL.DTWIN_EDITOR._RemoveChild(string_on_wasm_heap_for_name);
    // free
    _free(string_on_wasm_heap_for_name);
};
//
FM_.set_node_enbled = function (name, enble) {
    // to wasm heap
    var lengthBytes_for_name = lengthBytesUTF8(name) + 1;
    var string_on_wasm_heap_for_name = _malloc(lengthBytes_for_name);
    stringToUTF8(name, string_on_wasm_heap_for_name, lengthBytes_for_name);
    // call
    FM_GLOBAL.DTWIN_EDITOR._set_node_enbled(string_on_wasm_heap_for_name, enble);
    // free
    _free(string_on_wasm_heap_for_name);
};
//
FM_.set_node_position = function (name, x, y, z) {
    // to wasm heap
    var lengthBytes_for_name = lengthBytesUTF8(name) + 1;
    var string_on_wasm_heap_for_name = _malloc(lengthBytes_for_name);
    stringToUTF8(name, string_on_wasm_heap_for_name, lengthBytes_for_name);
    // call
    FM_GLOBAL.DTWIN_EDITOR._set_node_position(string_on_wasm_heap_for_name, x, y, z);
    // free
    _free(string_on_wasm_heap_for_name);
};
//
FM_.set_node_direction = function (name, x, y, z) {
    // to wasm heap
    var lengthBytes_for_name = lengthBytesUTF8(name) + 1;
    var string_on_wasm_heap_for_name = _malloc(lengthBytes_for_name);
    stringToUTF8(name, string_on_wasm_heap_for_name, lengthBytes_for_name);
    // call
    FM_GLOBAL.DTWIN_EDITOR._set_node_direction(string_on_wasm_heap_for_name, x, y, z);
    // free
    _free(string_on_wasm_heap_for_name);
};
//
FM_.set_node_scale = function (name, x, y, z) {
    // to wasm heap
    var lengthBytes_for_name = lengthBytesUTF8(name) + 1;
    var string_on_wasm_heap_for_name = _malloc(lengthBytes_for_name);
    stringToUTF8(name, string_on_wasm_heap_for_name, lengthBytes_for_name);
    // call
    FM_GLOBAL.DTWIN_EDITOR._set_node_scale(string_on_wasm_heap_for_name, x, y, z);
    // free
    _free(string_on_wasm_heap_for_name);
};
//
FM_.create_child_by_node = function (node_name, child_name) {
    // to wasm heap
    var lengthBytes_for_node_name = lengthBytesUTF8(node_name) + 1;
    var string_on_wasm_heap_for_node_name = _malloc(lengthBytes_for_node_name);
    stringToUTF8(node_name, string_on_wasm_heap_for_node_name, lengthBytes_for_node_name);

    var lengthBytes_for_child_name = lengthBytesUTF8(child_name) + 1;
    var string_on_wasm_heap_for_child_name = _malloc(lengthBytes_for_child_name);
    stringToUTF8(child_name, string_on_wasm_heap_for_child_name, lengthBytes_for_child_name);

    // call
    FM_GLOBAL.DTWIN_EDITOR._create_child_by_node(string_on_wasm_heap_for_node_name, string_on_wasm_heap_for_child_name);
    // free
    _free(string_on_wasm_heap_for_node_name);
    _free(string_on_wasm_heap_for_child_name);
};
//
FM_.remove_node_by_name = function (name) {
    // to wasm heap
    var lengthBytes_for_name = lengthBytesUTF8(name) + 1;
    var string_on_wasm_heap_for_name = _malloc(lengthBytes_for_name);
    stringToUTF8(name, string_on_wasm_heap_for_name, lengthBytes_for_name);
    // call
    FM_GLOBAL.DTWIN_EDITOR._remove_node_by_name(string_on_wasm_heap_for_name);
    // free
    _free(string_on_wasm_heap_for_name);
};

//
FM_.create_component_by_node = function (node_name, type_name) {
    // to wasm heap
    var lengthBytes_for_node_name = lengthBytesUTF8(node_name) + 1;
    var string_on_wasm_heap_for_node_name = _malloc(lengthBytes_for_node_name);
    stringToUTF8(node_name, string_on_wasm_heap_for_node_name, lengthBytes_for_node_name);

    var lengthBytes_for_type_name = lengthBytesUTF8(type_name) + 1;
    var string_on_wasm_heap_for_type_name = _malloc(lengthBytes_for_type_name);
    stringToUTF8(type_name, string_on_wasm_heap_for_type_name, lengthBytes_for_type_name);

    // call
    FM_GLOBAL.DTWIN_EDITOR._create_component_by_node(string_on_wasm_heap_for_node_name, string_on_wasm_heap_for_type_name);
    // free
    _free(string_on_wasm_heap_for_node_name);
    _free(string_on_wasm_heap_for_type_name);
};
//
FM_.remove_component_by_node = function (node_name, type_name) {
    // to wasm heap
    var lengthBytes_for_node_name = lengthBytesUTF8(node_name) + 1;
    var string_on_wasm_heap_for_node_name = _malloc(lengthBytes_for_node_name);
    stringToUTF8(node_name, string_on_wasm_heap_for_node_name, lengthBytes_for_node_name);

    var lengthBytes_for_type_name = lengthBytesUTF8(type_name) + 1;
    var string_on_wasm_heap_for_type_name = _malloc(lengthBytes_for_type_name);
    stringToUTF8(type_name, string_on_wasm_heap_for_type_name, lengthBytes_for_type_name);

    // call
    FM_GLOBAL.DTWIN_EDITOR._remove_component_by_node(string_on_wasm_heap_for_node_name, string_on_wasm_heap_for_type_name);
    // free
    _free(string_on_wasm_heap_for_node_name);
    _free(string_on_wasm_heap_for_type_name);
};

//
FM_.set_component_attr_by_node = function (node_name, com_type_name, attr_type_name, attr_value) {
    // to wasm heap
    var lengthBytes_for_node_name = lengthBytesUTF8(node_name) + 1;
    var string_on_wasm_heap_for_node_name = _malloc(lengthBytes_for_node_name);
    stringToUTF8(node_name, string_on_wasm_heap_for_node_name, lengthBytes_for_node_name);

    var lengthBytes_for_com_type_name = lengthBytesUTF8(com_type_name) + 1;
    var string_on_wasm_heap_for_com_type_name = _malloc(lengthBytes_for_com_type_name);
    stringToUTF8(com_type_name, string_on_wasm_heap_for_com_type_name, lengthBytes_for_com_type_name);

    var lengthBytes_for_attr_type_name = lengthBytesUTF8(attr_type_name) + 1;
    var string_on_wasm_heap_for_attr_type_name = _malloc(lengthBytes_for_attr_type_name);
    stringToUTF8(attr_type_name, string_on_wasm_heap_for_attr_type_name, lengthBytes_for_attr_type_name);

    var lengthBytes_for_attr_value = lengthBytesUTF8(attr_value) + 1;
    var string_on_wasm_heap_for_attr_value = _malloc(lengthBytes_for_attr_value);
    stringToUTF8(attr_value, string_on_wasm_heap_for_attr_value, lengthBytes_for_attr_value);

    // call
    FM_GLOBAL.DTWIN_EDITOR._set_component_attr_by_node(string_on_wasm_heap_for_node_name, string_on_wasm_heap_for_com_type_name, string_on_wasm_heap_for_attr_type_name, string_on_wasm_heap_for_attr_value);
    // free
    _free(string_on_wasm_heap_for_node_name);
    _free(string_on_wasm_heap_for_com_type_name);
    _free(string_on_wasm_heap_for_attr_type_name);
    _free(string_on_wasm_heap_for_attr_value);
};
//
FM_.call_component_default_init_by_node = function (node_name, com_type_name) {
    // to wasm heap
    var lengthBytes_for_node_name = lengthBytesUTF8(node_name) + 1;
    var string_on_wasm_heap_for_node_name = _malloc(lengthBytes_for_node_name);
    stringToUTF8(node_name, string_on_wasm_heap_for_node_name, lengthBytes_for_node_name);

    var lengthBytes_for_com_type_name = lengthBytesUTF8(com_type_name) + 1;
    var string_on_wasm_heap_for_com_type_name = _malloc(lengthBytes_for_com_type_name);
    stringToUTF8(com_type_name, string_on_wasm_heap_for_com_type_name, lengthBytes_for_com_type_name);

    // call
    FM_GLOBAL.DTWIN_EDITOR._call_component_default_init_by_node(string_on_wasm_heap_for_node_name, string_on_wasm_heap_for_com_type_name);
    // free
    _free(string_on_wasm_heap_for_node_name);
    _free(string_on_wasm_heap_for_com_type_name);
};
//
FM_.call_component_default_method_by_node = function (node_name, com_type_name) {
    // to wasm heap
    var lengthBytes_for_node_name = lengthBytesUTF8(node_name) + 1;
    var string_on_wasm_heap_for_node_name = _malloc(lengthBytes_for_node_name);
    stringToUTF8(node_name, string_on_wasm_heap_for_node_name, lengthBytes_for_node_name);

    var lengthBytes_for_com_type_name = lengthBytesUTF8(com_type_name) + 1;
    var string_on_wasm_heap_for_com_type_name = _malloc(lengthBytes_for_com_type_name);
    stringToUTF8(com_type_name, string_on_wasm_heap_for_com_type_name, lengthBytes_for_com_type_name);

    // call
    FM_GLOBAL.DTWIN_EDITOR._call_component_default_method_by_node(string_on_wasm_heap_for_node_name, string_on_wasm_heap_for_com_type_name);
    // free
    _free(string_on_wasm_heap_for_node_name);
    _free(string_on_wasm_heap_for_com_type_name);
};

//
FM_.set_node_attr = function (node_name, attr_type_name, attr_value) {
    // to wasm heap
    var lengthBytes_for_node_name = lengthBytesUTF8(node_name) + 1;
    var string_on_wasm_heap_for_node_name = _malloc(lengthBytes_for_node_name);
    stringToUTF8(node_name, string_on_wasm_heap_for_node_name, lengthBytes_for_node_name);

    var lengthBytes_for_attr_type_name = lengthBytesUTF8(attr_type_name) + 1;
    var string_on_wasm_heap_for_attr_type_name = _malloc(lengthBytes_for_attr_type_name);
    stringToUTF8(attr_type_name, string_on_wasm_heap_for_attr_type_name, lengthBytes_for_attr_type_name);

    var lengthBytes_for_attr_value = lengthBytesUTF8(attr_value) + 1;
    var string_on_wasm_heap_for_attr_value = _malloc(lengthBytes_for_attr_value);
    stringToUTF8(attr_value, string_on_wasm_heap_for_attr_value, lengthBytes_for_attr_value);

    // call
    FM_GLOBAL.DTWIN_EDITOR._set_node_attr(string_on_wasm_heap_for_node_name, string_on_wasm_heap_for_attr_type_name, string_on_wasm_heap_for_attr_value);
    // free
    _free(string_on_wasm_heap_for_node_name);
    _free(string_on_wasm_heap_for_attr_type_name);
    _free(string_on_wasm_heap_for_attr_value);
};
//
FM_.SetupViewport = function (camera_node_name) {
    // to wasm heap
    var lengthBytes_for_camera_node_name = lengthBytesUTF8(camera_node_name) + 1;
    var string_on_wasm_heap_for_camera_node_name = _malloc(lengthBytes_for_camera_node_name);
    stringToUTF8(camera_node_name, string_on_wasm_heap_for_camera_node_name, lengthBytes_for_camera_node_name);
    // call
    FM_GLOBAL.DTWIN_EDITOR._SetupViewport(string_on_wasm_heap_for_camera_node_name);
    // free
    _free(string_on_wasm_heap_for_camera_node_name);
};
//
FM_.LoadSceneFromFile = function (fileName) {
    // to wasm heap
    var lengthBytes_for_fileName = lengthBytesUTF8(fileName) + 1;
    var string_on_wasm_heap_for_fileName = _malloc(lengthBytes_for_fileName);
    stringToUTF8(fileName, string_on_wasm_heap_for_fileName, lengthBytes_for_fileName);
    // call
    FM_GLOBAL.DTWIN_EDITOR._LoadSceneFromFile(string_on_wasm_heap_for_fileName);
    // free
    _free(string_on_wasm_heap_for_fileName);
};
