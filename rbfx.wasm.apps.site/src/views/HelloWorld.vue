<script setup>
import { ref } from "vue";
import { useStore } from "@/stores/globle.js";
const mainStore = useStore();
//
</script>

<template>

  <div class="card">
    <button type="button" @click="mainStore.increment()">count is {{ mainStore.count }}</button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
