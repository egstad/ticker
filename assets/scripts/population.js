// Constants for population simulation
const BIRTH_RATE = 4.5; // births per second globally
const DEATH_RATE = 1.7; // deaths per second globally
const FALLBACK_POPULATION = 8000000000;

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

// Fetch current world population from World Bank API
const fetchPopulation = async () => {
  try {
    const response = await fetch(
      "https://api.worldbank.org/v2/country/WLD/indicator/SP.POP.TOTL?format=json&per_page=5"
    );
    const data = await response.json();

    // Find the most recent year with valid data
    const validData = data[1].find((item) => item.value !== null);

    if (validData && typeof validData.value === "number") {
      return validData.value;
    }
  } catch (error) {
    console.error("Error fetching population:", error);
  }
  return FALLBACK_POPULATION;
};

// Get initial population data and simulation parameters
export const getPopulationCounter = async () => {
  const initialPopulation = await fetchPopulation();

  return {
    id: "population",
    title: "World Population",
    subtitle: "(Updates are simulated)",
    value: initialPopulation,
    rate: BIRTH_RATE - DEATH_RATE, // Net growth rate
    speed: 0.7, // Update every 700ms
    isPositive: true,
    disasterTypes: DISASTER_TYPES,
  };
};
