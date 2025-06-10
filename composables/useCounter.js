import { ref, computed, watch, onUnmounted, onMounted } from "vue";
import { getTrumpLiesToNow } from "@/assets/scripts/trump";
import { randomLargeNum, randomNum } from "@/assets/scripts/random";

const counters = [
  {
    id: "people",
    title: "World Population",
    subtitle: "(Simulated)",
    value: 8000000000,
    rate: 2.8, // Net change per second (births - deaths)
    speed: 0.7,
    isPositive: true,
  },
  {
    id: "jello",
    title: "Jello Shots",
    subtitle: "(Tonight)",
    value: 0,
    rate: 1,
    speed: 1.5,
    isPositive: true,
  },
  {
    id: "barks",
    title: "Barks from dog next door",
    subtitle: "(Ongoing)",
    value: randomLargeNum(6, 1, 10),
    rate: 1,
    speed: 0.5,
    isPositive: true,
  },
  {
    id: "trump",
    title: "Trump lies this year",
    subtitle: "(~21 per day)",
    value: getTrumpLiesToNow(),
    rate: 1,
    speed: 4114,
    isPositive: true,
  },
  {
    id: "tiktok",
    title: "TikTok's Watched",
    subtitle: "(Today)",
    value: randomNum(25, 999, 3),
    rate: 1,
    speed: 12,
    isPositive: true,
  },
  {
    id: "emails",
    title: "Spam emails received",
    subtitle: "(You won't believe #28492)",
    value: 134928,
    rate: 1, // ~3000 per second
    speed: 0.1,
    isPositive: true,
  },
  {
    id: "farts",
    title: "Farts",
    subtitle: "(No escape)",
    value: randomNum(12, 999, 3),
    rate: 1,
    speed: 3,
    isPositive: true,
  },
  {
    id: "thoughts",
    title: "My bad vibes",
    subtitle: "(Temporarily out of stock)",
    value: 0,
    rate: 0,
    speed: 1.5,
    isPositive: true,
  },
  {
    id: "vape",
    title: "Vape hits",
    subtitle: "(Per minute, probably)",
    value: randomNum(12, 999, 3),
    rate: 1,
    speed: 60,
    isPositive: true,
  },
  {
    id: "tabs",
    title: "Browser tabs I've opened",
    subtitle: "(None of them closed)",
    value: randomLargeNum(6, 2, 5),
    rate: 1,
    speed: 52,
    isPositive: true,
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    subtitle: "(Unread)",
    value: randomLargeNum(6, 2, 5),
    rate: 1,
    speed: 3,
    isPositive: true,
  },
  {
    id: "influencers",
    title: "Influencer Apologies",
    subtitle: "(This week)",
    value: randomNum(120, 999, 3),
    rate: 1,
    speed: 5,
    isPositive: true,
  },
  {
    id: "strangers",
    title: "Strangers who've smiled",
    subtitle: "(Today)",
    value: randomLargeNum(8, 29, 8),
    rate: 333,
    speed: 1.5,
    isPositive: true,
  },
  {
    id: "truths",
    title: "Truths Ignored",
    subtitle: "(Accumulating faster than answers)",
    value: randomLargeNum(10, 10, 10),
    rate: 66666,
    speed: 1.5,
    isPositive: true,
  },
];

// Function to get a random counter ID
export function getRandomCounterId() {
  const randomIndex = Math.floor(Math.random() * counters.length);
  return counters[randomIndex].id;
}

export function useCounter(initialId) {
  const count = ref(0);
  const currentIndex = ref(0);
  const lastUpdated = ref(null);
  let simulationInterval = null;

  // Find initial counter
  const initialIndex = counters.findIndex((c) => c.id === initialId);
  if (initialIndex !== -1) {
    currentIndex.value = initialIndex;
    count.value = counters[initialIndex].value;
  } else {
    // Fallback to first counter if ID not found
    currentIndex.value = 0;
    count.value = counters[0].value;
  }

  const counter = computed(() => counters[currentIndex.value]);

  // Computed property to determine required digits
  const requiredDigits = computed(() => {
    const value = count.value || 0;
    return Math.max(3, Math.ceil(Math.log10(value + 1)));
  });

  // Function to randomize the counter
  const randomize = () => {
    currentIndex.value = (currentIndex.value + 1) % counters.length;
    const counter = counters[currentIndex.value];

    // Generate new random number for barks counter
    if (counter.id === "barks") {
      counter.value = randomLargeNum();
    }

    count.value = counter.value;
    lastUpdated.value = new Date().toLocaleTimeString();

    if (simulationInterval) {
      clearInterval(simulationInterval);
    }
    startSimulation();
  };

  // Start the simulation
  const startSimulation = () => {
    const counter = counters[currentIndex.value];
    if (simulationInterval) {
      clearInterval(simulationInterval);
    }
    simulationInterval = setInterval(() => {
      // Calculate change based on the counter's rate
      const change = Math.round(counter.rate * (0.8 + Math.random() * 0.4));
      count.value = Math.round(
        count.value + (counter.isPositive ? change : -change)
      );
    }, counter.speed * 1000);
  };

  // Start simulation only on client-side
  onMounted(() => {
    startSimulation();
  });

  // Cleanup on unmount
  onUnmounted(() => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
    }
  });

  return {
    count,
    counter,
    requiredDigits,
    handleRandomize: randomize,
    lastUpdated,
  };
}
