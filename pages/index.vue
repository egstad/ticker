<template>
  <div class="container">
    <TallyTitle class="tally-title">
      <template #title>
        <ClientOnly>
          {{ counter.title }}
        </ClientOnly>
      </template>
      <template #subtitle>
        <ClientOnly>
          <div class="subtitle-content">
            <span>{{ counter.subtitle }}</span>
          </div>
          <Pill>
            <button @click="handleRandomizeWithRotation">
              <IconRefresh class="refresh" ref="refreshIcon" />
            </button>
          </Pill>
        </ClientOnly>
      </template>
    </TallyTitle>
    <TallyCounter class="tally-count" :value="count" :digits="requiredDigits" />
  </div>
</template>

<script setup>
import { useCounter, getRandomCounterId } from "~/composables/useCounter";
import { useRouter } from "vue-router";
import TallyTitle from "~/components/TallyTitle.vue";
import IconRefresh from "~/components/IconRefresh.vue";
import { ref, watch, onMounted } from "vue";

const router = useRouter();
const refreshIcon = ref(null);

// Start with a random counter
const randomId = getRandomCounterId();
const { count, counter, requiredDigits, handleRandomize } =
  useCounter(randomId);

// Watch for counter changes and update URL
watch(
  () => counter.value,
  (newCounter) => {
    if (newCounter) {
      router.push(`/${newCounter.id}`);
    }
  }
);

// Handle randomize with icon rotation
const handleRandomizeWithRotation = () => {
  handleRandomize();
  refreshIcon.value?.rotate();
};

// Redirect to the counter's URL on mount
onMounted(() => {
  if (counter.value) {
    router.push(`/${counter.value.id}`);
  }
});
</script>

<style scoped>
.container {
  flex: 1;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  min-height: 400px;
  display: grid;
  grid-template-columns: 1fr;
  overflow: hidden;

  /* mobile */
  grid-template-rows: 1fr 2fr;
  max-height: 60vh;

  @media (min-width: 480px) {
    max-height: 80vh;
  }

  @media (min-width: 768px) {
    max-height: 100vh;
    padding-bottom: 5vh;
  }
}

:deep(.pill) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: 0;
  margin-top: 4px;
}

.refresh {
  display: block;
  height: auto;
  width: 14px;
}

.tally-count {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.subtitle-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

small {
  font-family: "LTUnivers Typewriter", monospace;
  text-transform: uppercase;
  font-size: 9px;
  margin-top: 4px;
  display: block;
}
</style>
