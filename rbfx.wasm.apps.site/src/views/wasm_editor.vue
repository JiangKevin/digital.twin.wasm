<script setup>
import { ref } from "vue";
import { useStoreForHome } from "@/stores/globle.js";
const mainStore = useStoreForHome();
//
</script>

<template>
  <div class="main_container">
    <div class="main_container_toolbar">ADFADS</div>
    <div class="main_container_content">
      <button type="button" @click="mainStore.increment()">
        count is {{ mainStore.count }}
      </button>
    </div>
    <div class="main_container_status"><span>asdfasdf</span></div>
  </div>
</template>

<style scoped>
/* .card {
  width: 100%;
  background-color: rgb(25, 204, 109);
} */
</style>
