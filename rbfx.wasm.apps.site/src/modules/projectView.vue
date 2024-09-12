<!-- template -->
<template>
    <div class="main_container_content_max blur_div_95">
        <!--  -->
        <div class="main_container_toolbar_no_pm">
            <!--  -->
            <button class="toolbar_btn_wide" @click="create_new_project_ck"><i class="mdi-folder-plus mdi"></i></button>
            <v-divider vertical class="divider_vertical"></v-divider>
        </div>
        <div class="main_container_content">
            <v-layout full-height>
                <v-main class="main_contain_project">
                    <v-item-group>
                        <v-row dense>
                            <v-col v-for="n in mainStore_project.user_project_list" cols="12" md="3">
                                <v-item v-slot="{ isSelected, toggle }">
                                    <v-hover>
                                        <template v-slot:default="{ isHovering, props }">
                                            <v-card v-bind="props" class="mx-auto opacity-70" :color="isHovering ? 'fm_card_select' : 'fm_card'" rounded="0" density="compact">
                                                <v-card-title> {{ n.fileName + " [" + n.Id + "]" }} </v-card-title>
                                                <v-card-subtitle>{{ n.stats.birthtime + " / " + n.stats.mtime }}</v-card-subtitle>
                                                <v-card-text class="py-0">
                                                    <v-row align="center" no-gutters>
                                                        <v-col class="text-h3" cols="8"> {{ n.stats.size }} </v-col>

                                                        <v-col class="text-right" cols="4">
                                                            <v-icon icon="mdi-folder" size="60"></v-icon>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                                <v-card-text> {{ n.info.Remark }} </v-card-text>
                                                <v-divider></v-divider>
                                                <v-card-actions>
                                                    <v-btn icon="mdi-delete" @click="n.toDel = true" size="small" :variant="isHovering ? 'flat' : 'text'" :color="isHovering ? 'fm_orange' : 'fm_white'" density="comfortable"></v-btn>
                                                    <v-spacer></v-spacer>
                                                    <v-btn icon="mdi-eye" @click="n.toDel = true" size="small" :variant="isHovering ? 'flat' : 'text'" :color="isHovering ? 'fm_red' : 'fm_white'" density="comfortable"></v-btn>
                                                    <v-btn icon="mdi-image-search" @click="n.toDel = true" size="small" :variant="isHovering ? 'flat' : 'text'" :color="isHovering ? 'fm_red' : 'fm_white'" density="comfortable"></v-btn>
                                                    <v-btn icon="mdi-cube-scan" @click="n.toDel = true" size="small" :variant="isHovering ? 'flat' : 'text'" :color="isHovering ? 'fm_red' : 'fm_white'" density="comfortable"></v-btn>
                                                </v-card-actions>
                                                <v-expand-transition>
                                                    <v-card v-if="n.toDel" class="position-absolute w-100" height="100%" style="bottom: 0" color="fm_card_ext" rounded="0">
                                                        <v-card-text class="pb-0">
                                                            <p class="text-h5">Delete Project</p>
                                                            <v-divider></v-divider>

                                                            <p class="text-medium-emphasis">Confirm to delete the current project. Once deleted, it cannot be restored. The deleted data includes resource files, project descriptions, scene configurations, etc.</p>
                                                        </v-card-text>
                                                        <div class="submit_contain">
                                                            <v-card-actions class="fm_v_card_actions">
                                                                <v-btn class="ml-auto submit_btn" text="Delete" variant="elevated" @click="del_project_click(n)"></v-btn>
                                                                <v-btn class="ml-auto submit_btn" text="Close" variant="elevated" @click="n.toDel = false"> </v-btn>
                                                            </v-card-actions>
                                                        </div>
                                                    </v-card>
                                                </v-expand-transition>
                                            </v-card> </template
                                    ></v-hover>
                                </v-item>
                            </v-col>
                        </v-row>
                    </v-item-group>
                </v-main>
                <v-navigation-drawer location="right" permanent temporary v-model="mainStore_project.drawer" width="400">
                    <div v-show="(mainStore_project.project_modify_type = 'CreateProject')" class="r_modify_div">
                        <v-text-field prepend-icon="mdi-black-mesa" label="Name" variant="outlined" v-model="mainStore_project.project_info.name" rounded="0" density="compact"></v-text-field>
                        <v-textarea prepend-icon="mdi-hololens" label="Remark" variant="outlined" v-model="mainStore_project.project_info.info" rounded="0" density="compact"></v-textarea>
                        <v-select prepend-icon="mdi-database-search" label="Template" variant="outlined" v-model="mainStore_project.project_info.wizard" :items="mainStore_project.wizard_list" rounded="0" density="compact" class="mx-auto"> </v-select>
                        <v-file-input id="upload_inputs" ref="upload_inputs" multiple label="Select Resouse Files( ZIP File )" accept=".zip" variant="outlined" rounded="0" density="compact"></v-file-input>
                        <div class="submit_contain">
                            <v-card-actions class="fm_v_card_actions">
                                <v-btn class="ml-auto submit_btn" variant="elevated" rounded="0" text="Create" @click="create_and_uploadFiles"></v-btn>
                                <v-btn class="ml-auto submit_btn" variant="elevated" rounded="0" text="Close" @click=""></v-btn>
                            </v-card-actions>
                        </div>
                    </div>
                </v-navigation-drawer>
            </v-layout>
        </div>
        <div class="main_container_status_no_pm">
            <span id="project_log_output">{{ mainStore_project.project_log }}</span>
        </div>
        <!--  -->
    </div>
</template>
<!--  script  -->
<script setup>
import { ref, onMounted, onUnmounted, onUpdated, onActivated } from "vue";
import { useStoreForProject } from "@/stores/globle.js";
const mainStore_project = useStoreForProject();
//

//
onMounted(() => {
    getProjectList();
    getWizardList();
});
//
function getProjectList() {
    axios
        .get("/project_user_lists")
        .then((response) => {
            mainStore_project.user_project_list = response.data;
            mainStore_project.project_list = [];
            for (var i in response.data) {
                mainStore_project.project_list.push(response.data[i]["fileName"]);
            }
        })
        .catch((error) => {
            mainStore_project.project_log = error;
            console.error(error);
        });
}
//
function getWizardList() {
    axios
        .get("project_wizard_lists")
        .then((res) => {
            mainStore_project.wizard_list = [];
            var count = 0;
            for (var i in res.data) {
                count += 1;
                mainStore_project.wizard_list.push(res.data[i]["fileName"]);
            }
            mainStore_project.project_log = "+- From js: Get project List [ Count: " + count + " ] ok.";
        })
        .catch(function (error) {
            // 请求失败处理
            mainStore_project.project_log = error;
            console.log(error);
        });
}
//
function del_project_click(obj) {
    obj.toDel = false;
    mainStore_project.project_selected_to_modify = obj;
    //
    axios
        .post("/delete_project?Name=" + obj.info.Name + "&Type=PROJECT")
        .then((response) => {
            getProjectList();
            mainStore_project.project_log = "+- From js: Delete project [ " + mainStore_project.project_info.name + " ] ok.";
        })
        .catch((error) => {
            mainStore_project.project_log = error;
            console.error(error);
        });
}
//
function create_new_project_ck() {
    mainStore_project.drawer = !mainStore_project.drawer;
    mainStore_project.project_selected_to_modify = "CreateProject";
}
//
function create_and_uploadFiles() {
    const formData = new FormData();
    if (upload_inputs.files) {
        for (var i = 0; i < upload_inputs.files.length; i++) {
            formData.append("files", upload_inputs.files[i]);
        }
    }
    //
    axios
        .post("/create_and_upload_res?Name=" + mainStore_project.project_info.name + "&Wizard=" + mainStore_project.project_info.wizard + "&Remark=" + mainStore_project.project_info.info, formData)
        .then((response) => {
            getProjectList();
            mainStore_project.drawer = false;
            mainStore_project.project_log = "+- From js: Create project [ " + mainStore_project.project_info.name + " ] ok.";
        })
        .catch((error) => {
            mainStore_project.project_log = error;
            console.error(error);
        });
}
</script>

<!--  style  -->
<style scoped>
.main_contain_project {
    padding: 8px;
    padding-right: 0px;
}
.submit_btn {
    height: 24px;
    width: 50%;
    border: none;
    font-size: 12px !important;
    color: white !important;
    background-color: #cf1415;
    border-radius: 0px !important;
    text-align: center;
}
.submit_contain {
    width: 100%;
    position: absolute;
    bottom: 2px;
    left: 0px;
}
.fm_v_card_actions {
    padding: 0rem;
}
.r_modify_div {
    margin: 0;
    border-left: 1px solid var(--fm_toolbar_boder);
    height: 100%;
    padding-left: 10px;
    padding-right: 8px;
    padding-top: 20px;
    background-color: var(--fm_toolbar);
}
</style>
