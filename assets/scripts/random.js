/**
 * Generates a random number within a specified range
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @param {number} [decimals=0] - Number of decimal places (0 for integers)
 * @returns {number} Random number within the specified range
 */
export const randomNum = (min, max, decimals = 0) => {
  const num = Math.random() * (max - min) + min;
  return Number(num.toFixed(decimals));
};

/**
 * Generates a large random number by multiplying a base number with a multiplier
 * @param {number} [baseDigits=8] - Number of digits in the base number
 * @param {number} [minMultiplier=1] - Minimum multiplier
 * @param {number} [maxMultiplier=1000] - Maximum multiplier
 * @returns {number} Large random number
 */
export const randomLargeNum = (
  baseDigits = 8,
  minMultiplier = 1,
  maxMultiplier = 1000
) => {
  const base = Math.floor(Math.random() * Math.pow(10, baseDigits));
  const multiplier =
    Math.floor(Math.random() * (maxMultiplier - minMultiplier + 1)) +
    minMultiplier;
  return base * multiplier;
};
