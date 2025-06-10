<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-refresh-cw"
    :style="{ transform: `rotate(${rotation}deg)` }"
  >
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path
      d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
    ></path>
  </svg>
</template>

<script setup>
import { ref } from "vue";

const rotation = ref(0);

// Function to trigger rotation
const rotate = () => {
  rotation.value += 180; // Add 180 degrees to current rotation
};

// Expose the rotate function to parent components
defineExpose({ rotate });
</script>

<style scoped>
.feather-refresh-cw {
  transition: transform 0.5s ease;
}
</style>
