<template>
  <v-layout full-height>
    <v-navigation-drawer
      v-model="mainStore.drawer"
      :rail="mainStore.rail"
      permanent
    >
      <v-list>
        <v-list-item
          :subtitle="mainStore.user_info.email"
          :title="mainStore.user_info.fullname"
        >
          <template v-slot:prepend>
            <v-avatar>
              <v-img
                cover
                :src="mainStore.user_info.image"
                @click="view_manu"
              ></v-img>
            </v-avatar>
          </template>
          <template v-slot:append>
            <v-btn
              icon="mdi-exit-to-app"
              size="small"
              variant="text"
              @click="mainStore.logout"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <!--  -->
      <v-list density="compact" nav>
        <v-list-subheader>Project Resource</v-list-subheader>
        <v-list-item
          v-for="(item, i) in mainStore.menu_items"
          :key="i"
          :value="item"
          :active="item.active"
          :disabled="item.disabled"
          @click="route(item)"
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
          v-for="(item, i) in mainStore.menu_editor_items"
          :key="i"
          :value="item"
          :active="item.active"
          :disabled="item.disabled"
          @click="route(item)"
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

<script setup>
import { RouterView } from "vue-router";
//
import { ref } from "vue";
import { useStoreForMenu } from "@/stores/globle.js";
const mainStore = useStoreForMenu();
//
import router from "@/router/router";
function route(item) {
  router.push({ path: item.route, replace: true });
}
//
function view_manu() {
  mainStore.rail = !mainStore.rail;
  mainStore.user_info.email = "kevin.jiang@hotmail.com";
}
// const getAssetsFile = (url) => {
//   const urlArr = String(url).split('/') // 通过'/'分割成数组
//   const prefix = urlArr.slice(-2)[0] // 获取倒数第二个值
//   const fileName = urlArr.slice(-1)[0] // 获取最后一个值
//   return new URL(import.meta.url).href // 使用vite推荐的方法渲染
// }
</script>

<style scoped>
</style>