/** Deterministic pseudo-random (0 inclusive, 1 exclusive). */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle; returns new permutation of 0..n-1. */
export function seededShuffleIndices(n: number, seed: number): number[] {
  const rng = mulberry32(seed);
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Local calendar day-of-year: 1 = Jan 1, 365 or 366 = Dec 31. */
export function getLocalDayOfYear(date: Date): number {
  const y = date.getFullYear();
  const noon = (m: number, d: number) => new Date(y, m, d, 12, 0, 0, 0).getTime();
  const t0 = noon(0, 1);
  const t = noon(date.getMonth(), date.getDate());
  return Math.round((t - t0) / 86400000) + 1;
}

/** Map day-of-year to quote index after yearly shuffle (1-based doy). */
export function affirmationIndexForDay(year: number, dayOfYear: number, poolLength = 365): number {
  const doy = Math.min(Math.max(dayOfYear, 1), poolLength);
  const perm = seededShuffleIndices(poolLength, year * 100_003 + 42_901);
  return perm[doy - 1];
}

/** `monthIndex`: 0 = January. Maps calendar month to challenge index after yearly shuffle of `poolLength` items. */
export function monthlyChallengePoolIndex(year: number, monthIndex: number, poolLength = 12): number {
  const m = ((monthIndex % 12) + 12) % 12;
  const n = Math.max(1, poolLength);
  const perm = seededShuffleIndices(n, year * 97_981 + 17_389);
  return perm[m % n];
}
