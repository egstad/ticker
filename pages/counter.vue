<template>
  <div class="container">
    <TallyCounter class="tally-count" :value="count" :digits="requiredDigits" />
    <Pill class="number">
      <input
        type="number"
        v-model="count"
        :max="MAX_VALUE"
        min="0"
        @keydown.stop
      />
    </Pill>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed, ref, watch } from "vue";

const count = ref(0);
const MAX_VALUE = 999999999999;

// Watch for changes and enforce max value
watch(count, (newValue) => {
  if (newValue > MAX_VALUE) {
    count.value = MAX_VALUE;
  }
});

// Computed property to determine required digits
const requiredDigits = computed(() => {
  return Math.max(3, Math.floor(Math.log10(count.value)) + 1);
});

// Handle keyboard events
const handleKeyDown = (event) => {
  if (event.key === "ArrowUp") {
    count.value++;
  } else if (event.key === "ArrowDown") {
    count.value = Math.max(0, count.value - 1);
  }
};

// Add and remove event listeners
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
.container {
  flex: 1;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  overflow: hidden;
}

.tally-count {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.number {
  position: fixed;
  bottom: 8px;
  left: 8px;
}
</style>
