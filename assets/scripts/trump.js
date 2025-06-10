export function getTrumpLiesToNow(averagePerDay = 21) {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1); // Jan 1, 12:00am
  const now = new Date();

  const msElapsed = now - startOfYear;
  const liesPerMs = averagePerDay / (24 * 60 * 60 * 1000); // 21 lies/day → lies/ms

  const estimatedLies = msElapsed * liesPerMs;
  return estimatedLies;
}
