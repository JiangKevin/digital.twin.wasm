import { ref, computed } from "vue";
import { defineStore } from "pinia";
//
export const useStoreForHome = defineStore("globle", () => {
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
export const useStoreForLogin = defineStore("globle", () => {
  const count = ref(0);
  //



  //
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});
