<script setup>
import { ref } from "vue";
import { useStoreForHome } from "@/stores/globle.js";
const mainStore = useStoreForHome();
//
</script>

<template>
  <div class="main_container">
    <button type="button" @click="mainStore.increment()">
      count is {{ mainStore.count }}
    </button>
  </div>
</template>

<style scoped>
/* .card {
  width: 100%;
  background-color: rgb(25, 204, 109);
} */
</style>
