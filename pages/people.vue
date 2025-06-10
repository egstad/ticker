<template>
  <div class="container">
    <TallyTitle class="tally-title">
      <template #title>World Population</template>
      <template #subtitle>
        <div class="subtitle-content">
          <span>(Simulated)</span>
        </div>
        <Pill>
          <button @click="handleRandomizeWithRotation">
            <IconRefresh class="refresh" ref="refreshIcon" />
          </button>
        </Pill>
      </template>
    </TallyTitle>
    <TallyCounter class="tally-count" :value="count" :digits="requiredDigits" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import TallyTitle from "~/components/TallyTitle.vue";
import IconRefresh from "~/components/IconRefresh.vue";

useHead({
  title: "World Population",
});

const router = useRouter();
const count = ref(8000000000); // Fallback value
const lastUpdated = ref(null);
const refreshIcon = ref(null);

// Array of counter IDs for random navigation
const counterIds = [
  "jello",
  "barks",
  "trump",
  "tiktok",
  "emails",
  "farts",
  "thoughts",
  "vape",
  "tabs",
  "terms",
  "influencers",
  "strangers",
  "truths",
];

// Fetch current world population
const fetchPopulation = async () => {
  try {
    console.log("Fetching population data...");
    // World Bank API for total population - get last 5 years to ensure we have valid data
    const response = await fetch(
      "https://api.worldbank.org/v2/country/WLD/indicator/SP.POP.TOTL?format=json&per_page=5"
    );
    const data = await response.json();
    console.log("API Response:", data);

    // Find the most recent year with valid data
    const validData = data[1].find((item) => item.value !== null);
    console.log("Most recent valid data:", validData);

    if (validData && typeof validData.value === "number") {
      count.value = validData.value;
      lastUpdated.value = new Date().toLocaleTimeString();
      console.log("Updated population to:", count.value);
    } else {
      console.log("No valid data found in response");
    }
  } catch (error) {
    console.error("Error fetching population:", error);
    // Keep using the fallback value if the API call fails
  }
};

// Computed property to determine required digits
const requiredDigits = computed(() => {
  if (!count.value) return 3;
  return Math.max(3, Math.floor(Math.log10(count.value)) + 1);
});

// Simulation parameters
// Current world population growth rate is about 0.9% per year
// To reach 8.2B by end of 2024, we need approximately:
const BIRTH_RATE = 4.5; // births per second globally
const DEATH_RATE = 1.7; // deaths per second globally

// Disaster simulation parameters
const DISASTER_TYPES = [
  {
    name: "Natural Disaster",
    probability: 0.01,
    minDeaths: 1000,
    maxDeaths: 50000,
  },
  { name: "Conflict", probability: 0.02, minDeaths: 500, maxDeaths: 20000 },
  {
    name: "Disease Outbreak",
    probability: 0.03,
    minDeaths: 200,
    maxDeaths: 10000,
  },
  {
    name: "Industrial Accident",
    probability: 0.01,
    minDeaths: 100,
    maxDeaths: 5000,
  },
];

let simulationInterval;
let lastDisaster = ref(null);

// Start the simulation
const startSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }
  simulationInterval = setInterval(() => {
    // Calculate births and deaths for this interval with some randomness
    const births = Math.floor(BIRTH_RATE * (0.8 + Math.random() * 0.4));
    const deaths = Math.floor(DEATH_RATE * (0.8 + Math.random() * 0.4));

    // Check for disasters
    DISASTER_TYPES.forEach((disaster) => {
      if (Math.random() < disaster.probability) {
        const deaths = Math.floor(
          disaster.minDeaths +
            Math.random() * (disaster.maxDeaths - disaster.minDeaths)
        );
        count.value -= deaths;
        lastDisaster.value = {
          type: disaster.name,
          deaths: deaths,
          timestamp: new Date(),
        };
        console.log(
          `Disaster occurred: ${
            disaster.name
          } - ${deaths.toLocaleString()} lives lost`
        );
      }
    });

    // Update population
    count.value += births - deaths;
  }, 700); // Update every 700ms
};

// Handle randomize with icon rotation
const handleRandomizeWithRotation = () => {
  // Get a random counter ID
  const randomIndex = Math.floor(Math.random() * counterIds.length);
  const randomId = counterIds[randomIndex];

  // Rotate the refresh icon
  refreshIcon.value?.rotate();

  // Navigate to the random counter
  router.push(`/${randomId}`);
};

// Add and remove event listeners
onMounted(async () => {
  console.log("Component mounted, fetching initial data...");
  await fetchPopulation(); // Get initial real data
  startSimulation();
});

onUnmounted(() => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
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
</style>
