import { ref, computed } from "vue";
import { defineStore } from "pinia";
import avatarImgUrl from "@/assets/img/85.jpg";
//
export const useStoreForMenu = defineStore("menu", () => {
  var drawer = ref(true);
  var rail = ref(false);
  var is_logined = ref(true);
  var login_log = ref("");
  //
  var menu_items = [
    { text: "All Proejcts", icon: "mdi-folder", active: true, disabled: false, route: "/all_project" },
    { text: "Files Browse", icon: "mdi-view-list", active: false, disabled: false, route: "/files_browse" },
  ];
  var menu_editor_items = [
    { text: "CAD Editor", icon: "mdi-ruler-square-compass", active: false, disabled: false, route: "/digital_twin_editor" },
    { text: "Scene Editor", icon: "mdi-microsoft-xbox-controller", active: false, disabled: false, route: "/cascad_editor" },
  ];
  //
  var user_info = { username: "admin", password: "", token: "", image: avatarImgUrl, email: "kevin.jiang@fmbj.com.cn", fullname: "Kevin Jiang" };
  //
  function logout() {
    is_logined = false;
    //
    user_info.username = "";
    user_info.password = "";
    user_info.token = "";
    user_info.image = "";
    user_info.email = "";
    user_info.fullname = "";
  }

  //
  return { menu_items, menu_editor_items, drawer, rail, user_info, logout };
});
//
export const useStoreForHome = defineStore("home", () => {
  const count = ref(0);
  //

  //
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});
//
export const useStoreForLogin = defineStore("login", () => {
  const count = ref(0);
  //

  //
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});
