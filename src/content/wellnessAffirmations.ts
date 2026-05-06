/**
 * Base lines expanded into exactly 365 affirmations, then re-ordered per year via `wellnessSchedule`.
 */

const SEEDS = [
  "You are allowed to take up space — your needs matter.",
  "Small steps still move mountains; progress is not a race.",
  "Rest is not a reward you earn; it is part of how you thrive.",
  "Your boundaries are an act of love for you and for others.",
  "You can be both healing and hopeful at the same time.",
  "Showing up imperfectly still counts as showing up.",
  "Community does not require performance — only presence.",
  "You do not owe anyone a performance of strength.",
  "Tears are not weakness; they are release.",
  "Asking for help is wisdom, not failure.",
  "You are not late to your own life.",
  "Comparison steals the story only you can tell.",
  "Silence with yourself is not wasted time.",
  "Your pace is legitimate even if it looks quiet.",
  "Forgiving yourself is practice, not a one-time event.",
  "You can change your mind without owing the world a thesis.",
  "Softness and strength can share the same spine.",
  "Joy does not need permission to be small.",
  "Disappointment does not erase your worth.",
  "You belong in rooms where you do not have to shrink.",
  "Your no can be a complete sentence.",
  "Energy is finite; budget it like love.",
  "Healing is nonlinear; zigzags are still forward.",
  "You are more than what you produce in a day.",
  "Care for your body without bargaining with it.",
  "Friendship can be as simple as honest presence.",
  "You do not have to earn rest with exhaustion first.",
  "Clarity often arrives after a pause, not a push.",
  "Your anger can protect something tender.",
  "You can outgrow people without villainizing them.",
  "Hope can be quiet and still be real.",
  "You are allowed to enjoy good days without guilt.",
  "Mistakes are data, not a verdict on your character.",
  "Listening to yourself is a skill that grows with use.",
  "You do not have to explain your healing timeline.",
  "Saying ‘not today’ can be brave.",
  "Your inner voice deserves the kindness you give friends.",
  "Peace can look like a boundary, not just a beach.",
  "You can want more and still honor what you have.",
  "Love for others starts from honesty with yourself.",
] as const;

const VARIANTS = [
  "",
  " Let it land without fixing anything.",
  " You are not behind.",
  " Permission granted to pause.",
  " One small honest step is enough.",
  " The people who get it do not need perfection.",
  " Hydration counts as care.",
  " You can revisit this tomorrow.",
  " Say it kinder inside your own head.",
  " Nothing about you is too much.",
] as const;

function stripTrailingPeriod(s: string): string {
  return s.replace(/\.\s*$/, "");
}

/** Build 365 unique enough lines from seeds × variants (iterate variant outer for spread). */
function buildAffirmations365(): string[] {
  const out: string[] = [];
  for (let v =           0; v < VARIANTS.length && out.length < 365; v++) {
    for (let s = 0; s < SEEDS.length && out.length < 365; s++) {
      const base = SEEDS[s];
      const add = VARIANTS[v];
      if (!add) {
        out.push(base);
        continue;
      }
      const core = stripTrailingPeriod(base);
      out.push(`${core} —${add}`.replace(/\s+—\s*—/g, " —"));
    }
  }
  while (out.length < 365) {
    out.push(SEEDS[out.length % SEEDS.length]);
  }
  return out.slice(0, 365);
}

export const AFFIRMATIONS_365: readonly string[] = buildAffirmations365();
