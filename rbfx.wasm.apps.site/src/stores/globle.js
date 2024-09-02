import { ref, computed } from "vue";
import { defineStore } from "pinia";
//
export const useStoreForMenu = defineStore("menu", () => {
  var drawer = ref(true);
  var rail = ref(false);
  var is_logined = ref(true);
  //
  var menu_items = [
    { text: "All Proejcts", icon: "mdi-folder", active: true, disabled: false, route: "/home" },
    { text: "Files Browse", icon: "mdi-view-list", active: false, disabled: false, route: "/login" },
  ];
  //
  var user_info = { username: "admin", password: "", token: "", image: "../assets/img/85.jpg", email: "kevin.jiang@fmbj.com.cn", fullname: "Kevin Jiang" };
  //
  function logout() {
    is_logined = false;
    //
    user_info.email = "kevin.jiang@hotmail.com";
    user_info.token = "";
    user_info.password = "";
  }

  //
  return { menu_items, drawer, rail, user_info, logout };
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
