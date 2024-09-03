<template>
  <v-layout full-height>
    <v-navigation-drawer
      v-model="mainStore_menu.drawer"
      :rail="mainStore_menu.rail"
      permanent
    >
      <v-list>
        <v-list-item
          :subtitle="mainStore_menu.user_info.email"
          :title="mainStore_menu.user_info.fullname"
        >
          <template v-slot:prepend>
            <v-avatar>
              <v-img
                cover
                :src="mainStore_menu.user_info.image"
                @click="view_manu_ck"
              ></v-img>
            </v-avatar>
          </template>
          <template v-slot:append>
            <v-btn
              icon="mdi-exit-to-app"
              size="small"
              variant="text"
              @click="logout_ck"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <!--  -->
      <v-list density="compact" nav>
        <v-list-subheader>Project Resource</v-list-subheader>
        <v-list-item
          v-for="(item, i) in mainStore_menu.menu_items"
          :key="i"
          :value="item"
          :active="item.active"
          :disabled="item.disabled"
          @click="route_ck(item)"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
      </v-list>
      <!--  -->
      <v-list density="compact" nav>
        <v-list-subheader>Editor Resource</v-list-subheader>
        <v-list-item
          v-for="(item, i) in mainStore_menu.menu_editor_items"
          :key="i"
          :value="item"
          :active="item.active"
          :disabled="item.disabled"
          @click="route_ck(item)"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
      </v-list>
      <!--  -->
    </v-navigation-drawer>
    <!--  -->
    <v-main>
      <RouterView></RouterView>
    </v-main>
    <!--  -->
  </v-layout>
</template>
<!--  js  -->
<script setup>
import { RouterView } from "vue-router";
//
import { ref } from "vue";
import { useStoreForMenu } from "@/stores/globle.js";
const mainStore_menu = useStoreForMenu();
//
import router from "@/router/router";
function route_ck(item) {
  if (mainStore_menu.is_logined) {
    router.push({ path: item.route, replace: true });
  } else {
    router.push({ path: "login", replace: true });
  }
}
//
function view_manu_ck() {
  mainStore_menu.rail = !mainStore_menu.rail;
}
//
function logout_ck() {
  mainStore_menu.logout();
  router.push({ path: "login", replace: true });
}
</script>
<!--  -->
<style scoped>
</style>