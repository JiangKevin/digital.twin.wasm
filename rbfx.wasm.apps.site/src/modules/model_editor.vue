<!-- template -->
<template>
    <div class="main_container_content_max blur_div_95">
        <!--  -->
        <div class="main_container_toolbar_no_pm">
            <!--  -->
            <button class="toolbar_btn_wide" @click="view_toolbox()">
                <i class="mdi-arrow-up mdi"></i>
            </button>
            <v-divider vertical class="divider_vertical"></v-divider>
            <!--  -->
            <button class="toolbar_btn">
                <i class="mdi-folder-plus mdi"></i>
            </button>
            <v-divider vertical class="divider_vertical"></v-divider>
        </div>
        <div class="main_container_content">
            <v-layout full-height>
                <v-main class="main_contain_models">
                    <div id="container"></div>
                </v-main>
                <v-navigation-drawer location="right" permanent temporary width="400" v-model="mainStore_models.is_right_models_drawer"> </v-navigation-drawer>
            </v-layout>
        </div>
        <div class="main_container_status_no_pm">
            <span id="resouse_log_output">{{ mainStore_models.models_log }}</span>
        </div>
        <!--  -->
    </div>
</template>
<!--  script  -->
<script setup>
import { ref, onMounted, onUnmounted, onUpdated, onActivated } from "vue";
import { fm_addScript, fm_addScript_for_dtwin, fm_delScript, open_rbfx_code_file, saveCodeToFile, busy_div_control, saveShapeSTL, loadSTEPorIGES } from "@/plugins/base.js";
import { useStoreForModels, useStoreForMenu } from "@/stores/globle.js";
const mainStore_models = useStoreForModels();
const mainStore_menu = useStoreForMenu();
//
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
//
let container;
let container_width = window.innerWidth - 63,
    container_height = window.innerHeight - 8;
let camera, scene, renderer;
const splineHelperObjects = [];
let splinePointsLength = 4;
const positions = [];
const point = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const onUpPosition = new THREE.Vector2();
const onDownPosition = new THREE.Vector2();
const geometry = new THREE.BoxGeometry(20, 20, 20);
let transformControl;
const ARC_SEGMENTS = 200;
const splines = {};
const params = {
    uniform: true,
    tension: 0.5,
    centripetal: true,
    chordal: true,
    addPoint: addPoint,
    removePoint: removePoint,
    exportSpline: exportSpline,
};
// 期初renderer
function init_renderer() {
    container = document.getElementById("container");
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container_width, container_height - 44);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    FM_GLOBAL.MODEL_EDITOR_RENDER = renderer;
    is_load_model_editor = true;
}
// 期初运动灯光
function init_spot_light() {
    const light = new THREE.SpotLight(0xffffff, 4.5);
    light.position.set(0, 1500, 200);
    light.angle = Math.PI * 0.2;
    light.decay = 0;
    light.castShadow = true;
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 2000;
    light.shadow.bias = -0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    return light;
}
// 期初环境灯光
function init_ambient_light() {
    const light = new THREE.AmbientLight(0xf0f0f0, 3);
    return light;
}
//
function init_camera() {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / container_height, 1, 10000);
    camera.position.set(0, 250, 1000);
}
//
function init_scene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    //
    scene.add(camera);
    //
    scene.add(init_spot_light());
    scene.add(init_ambient_light());
    //
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    planeGeometry.rotateX(-Math.PI / 2);
    const planeMaterial = new THREE.ShadowMaterial({
        color: 0x000000,
        opacity: 0.2,
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -200;
    plane.receiveShadow = true;
    scene.add(plane);

    const helper = new THREE.GridHelper(4000, 100);
    helper.position.y = -199;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add(helper);
    //
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.damping = 0.2;
    //
    transformControl = new TransformControls(camera, renderer.domElement);
    scene.add(transformControl.getHelper());
}
//
// function
//
function init() {
    init_renderer();
    //
    init_camera();
    //
    init_scene();
    //
    controls.addEventListener("change", render);
    //
    transformControl.addEventListener("change", render);
    transformControl.addEventListener("dragging-changed", function (event) {
        controls.enabled = !event.value;
    });
    transformControl.addEventListener("objectChange", function () {
        updateSplineOutline();
    });

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onWindowResize);
    //
    FM_GLOBAL.CONTAINER.on("CONTAINER SIZE CHANGE", (arg) => {
        onWindowResize(arg);
    });
    /*******
     * Curves
     *********/

    for (let i = 0; i < splinePointsLength; i++) {
        addSplineObject(positions[i]);
    }

    positions.length = 0;

    for (let i = 0; i < splinePointsLength; i++) {
        positions.push(splineHelperObjects[i].position);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(ARC_SEGMENTS * 3), 3));

    let curve = new THREE.CatmullRomCurve3(positions);
    curve.curveType = "catmullrom";
    curve.mesh = new THREE.Line(
        geometry.clone(),
        new THREE.LineBasicMaterial({
            color: 0xff0000,
            opacity: 0.35,
        })
    );
    curve.mesh.castShadow = true;
    splines.uniform = curve;

    curve = new THREE.CatmullRomCurve3(positions);
    curve.curveType = "centripetal";
    curve.mesh = new THREE.Line(
        geometry.clone(),
        new THREE.LineBasicMaterial({
            color: 0x00ff00,
            opacity: 0.35,
        })
    );
    curve.mesh.castShadow = true;
    splines.centripetal = curve;

    curve = new THREE.CatmullRomCurve3(positions);
    curve.curveType = "chordal";
    curve.mesh = new THREE.Line(
        geometry.clone(),
        new THREE.LineBasicMaterial({
            color: 0x0000ff,
            opacity: 0.35,
        })
    );
    curve.mesh.castShadow = true;
    splines.chordal = curve;

    for (const k in splines) {
        const spline = splines[k];
        scene.add(spline.mesh);
    }

    load([new THREE.Vector3(289.76843686945404, 452.51481137238443, 56.10018915737797), new THREE.Vector3(-53.56300074753207, 171.49711742836848, -14.495472686253045), new THREE.Vector3(-91.40118730204415, 176.4306956436485, -6.958271935582161), new THREE.Vector3(-383.785318791128, 491.1365363371675, 47.869296953772746)]);

    render();
}

function addSplineObject(position) {
    const material = new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff,
    });
    const object = new THREE.Mesh(geometry, material);

    if (position) {
        object.position.copy(position);
    } else {
        object.position.x = Math.random() * 1000 - 500;
        object.position.y = Math.random() * 600;
        object.position.z = Math.random() * 800 - 400;
    }

    object.castShadow = true;
    object.receiveShadow = true;
    scene.add(object);
    splineHelperObjects.push(object);
    return object;
}

function addPoint() {
    splinePointsLength++;

    positions.push(addSplineObject().position);

    updateSplineOutline();

    render();
}

function removePoint() {
    if (splinePointsLength <= 4) {
        return;
    }

    const point = splineHelperObjects.pop();
    splinePointsLength--;
    positions.pop();

    if (transformControl.object === point) transformControl.detach();
    scene.remove(point);

    updateSplineOutline();

    render();
}

function updateSplineOutline() {
    for (const k in splines) {
        const spline = splines[k];

        const splineMesh = spline.mesh;
        const position = splineMesh.geometry.attributes.position;

        for (let i = 0; i < ARC_SEGMENTS; i++) {
            const t = i / (ARC_SEGMENTS - 1);
            spline.getPoint(t, point);
            position.setXYZ(i, point.x, point.y, point.z);
        }

        position.needsUpdate = true;
    }
}

function exportSpline() {
    const strplace = [];

    for (let i = 0; i < splinePointsLength; i++) {
        const p = splineHelperObjects[i].position;
        strplace.push(`new THREE.Vector3(${p.x}, ${p.y}, ${p.z})`);
    }

    console.log(strplace.join(",\n"));
    const code = "[" + strplace.join(",\n\t") + "]";
    prompt("copy and paste code", code);
}

function load(new_positions) {
    while (new_positions.length > positions.length) {
        addPoint();
    }

    while (new_positions.length < positions.length) {
        removePoint();
    }

    for (let i = 0; i < positions.length; i++) {
        positions[i].copy(new_positions[i]);
    }

    updateSplineOutline();
}

function render() {
    splines.uniform.mesh.visible = params.uniform;
    splines.centripetal.mesh.visible = params.centripetal;
    splines.chordal.mesh.visible = params.chordal;
    renderer.render(scene, camera);
}

function onPointerDown(event) {
    onDownPosition.x = event.clientX;
    onDownPosition.y = event.clientY;
}

function onPointerUp(event) {
    onUpPosition.x = event.clientX;
    onUpPosition.y = event.clientY;

    if (onDownPosition.distanceTo(onUpPosition) === 0) {
        transformControl.detach();
        render();
    }
}

function onPointerMove(event) {
    pointer.x = (event.clientX / container_width) * 2 - 1;
    pointer.y = -(event.clientY / container_height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(splineHelperObjects, false);

    if (intersects.length > 0) {
        const object = intersects[0].object;

        if (object !== transformControl.object) {
            transformControl.attach(object);
        }
    }
}

function onWindowResize() {
    if (!mainStore_menu.rail) {
        container_width = window.innerWidth - 263;
    } else {
        container_width = window.innerWidth - 63;
    }
    //
    camera.aspect = container_width / container_height;
    camera.updateProjectionMatrix();
    renderer.setSize(container_width, container_height);
    render();
}
//
function view_toolbox() {
    mainStore_models.is_right_models_drawer = !mainStore_models.is_right_models_drawer;
}
//
onMounted(() => {
    init();
});
</script>

<!--  style  -->
<style scoped>
.main_contain_models {
    padding: 4px;
    padding-right: 0px;
}
/*  */
.lil-gui.autoPlace {
    max-height: 100%;
    position: fixed;
    right: 0px;
    top: 24;
    z-index: 1001;
}
</style>
