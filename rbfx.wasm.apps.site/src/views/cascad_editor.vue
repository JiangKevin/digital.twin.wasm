<!-- template -->
<template>
    <div class="main_container_toolbar">ADFADS</div>
    <div class="main_container_content">
        <button type="button" @click="mainStore.increment()">count is {{ mainStore.count }}</button>
    </div>
    <div class="main_container_status"><span>asdfasdf</span></div>
</template>
<!--  script  -->
<script setup>
import { ref } from "vue";
import { useStoreForMenu } from "@/stores/globle.js";
const mainStore = useStoreForMenu();
</script>

<!--  style  -->
<style scoped>
/* .card {
  width: 100%;
  background-color: rgb(25, 204, 109);
} */
</style>
