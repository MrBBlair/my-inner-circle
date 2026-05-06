import { monthlyChallengePoolIndex } from "../lib/wellnessSchedule";

export type MonthlyWellnessChallenge = {
  id: string;
  title: string;
  summary: string;
  weeks: string[];
};

export const MONTHLY_WELLNESS_CHALLENGES: readonly MonthlyWellnessChallenge[] = [
  {
    id: "gratitude-ledger",
    title: "Gratitude in specifics",
    summary:
      "Each week, name three concrete moments you are thankful for — not generic luck, but real scenes, people, or sensations. Notice how specificity changes what you remember.",
    weeks: [
      "Week 1: Three tiny wins before noon.",
      "Week 2: One person + why they mattered this month.",
      "Week 3: A sound, scent, or texture you’re glad exists.",
      "Week 4: Something hard you survived — evidence only.",
    ],
  },
  {
    id: "boundary-hydration",
    title: "Boundaries & basics",
    summary:
      "Pair one gentle boundary practice with physical basics (sleep, water, movement). The goal is sustainability, not a makeover.",
    weeks: [
      "Week 1: One clear no without over-explaining.",
      "Week 2: A bedtime or wind-down you protect twice.",
      "Week 3: Walk or stretch without a podcast — five minutes counts.",
      "Week 4: Ask once for what you need, even if the answer is scary.",
    ],
  },
  {
    id: "connection-notes",
    title: "Reach without performing",
    summary:
      "Send short, honest notes to people you appreciate — no essays, no expectation of reply. Connection as a gift, not a transaction.",
    weeks: [
      "Week 1: One voice memo under ninety seconds.",
      "Week 2: A two-sentence text to someone you miss lightly.",
      "Week 3: Thank someone for something small they did long ago.",
      "Week 4: Offer one specific, low-pressure invite (tea, walk, call).",
    ],
  },
  {
    id: "body-neutrality",
    title: "Body as teammate",
    summary:
      "Practice naming what your body did for you instead of how it looked. Shift criticism into gratitude where you can.",
    weeks: [
      "Week 1: Morning: thank one organ or system in one sentence.",
      "Week 2: After meals — one neutral or kind line aloud.",
      "Week 3: Dress for comfort once without apologizing.",
      "Week 4: Move in a way that feels like play, not punishment.",
    ],
  },
  {
    id: "digital-diet",
    title: "Tech margin",
    summary:
      "Create small pockets of the day without scrolling — enough to hear your own mind again.",
    weeks: [
      "Week 1: First twenty minutes awake — no phone.",
      "Week 2: One meal without a screen.",
      "Week 3: Delete or mute one trigger app or account.",
      "Week 4: Replace thirty minutes of scroll with voice or paper.",
    ],
  },
  {
    id: "repair-attempts",
    title: "Gentle repair",
    summary:
      "If you bump someone you love, try a simple repair: name what happened, your part, and what you want next. Short beats perfect.",
    weeks: [
      "Week 1: One ‘I was sharp — I’m sorry’ without a but.",
      "Week 2: Ask: what would feel better next time?",
      "Week 3: Accept someone else’s repair without grading it.",
      "Week 4: Notice where you avoid repair — curiosity only.",
    ],
  },
  {
    id: "joy-permission",
    title: "Joy without guilt",
    summary:
      "Schedule delight that does not earn your keep. Fun is not the opposite of growth.",
    weeks: [
      "Week 1: Fifteen minutes of silly or nostalgic play.",
      "Week 2: Buy or borrow one small thing purely for pleasure.",
      "Week 3: Dance, sing, or create badly — on purpose.",
      "Week 4: Tell someone what made you laugh hard recently.",
    ],
  },
  {
    id: "community-care",
    title: "Neighbor energy",
    summary:
      "Offer one neighborly act a week — supplies, encouragement, or presence — scaled to your actual bandwidth.",
    weeks: [
      "Week 1: Share a resource link or surplus item.",
      "Week 2: Check in on someone who’s been quiet.",
      "Week 3: Join a thread in the circle with encouragement only.",
      "Week 4: Restock a little free library or mutual-aid box if you can.",
    ],
  },
  {
    id: "money-clarity",
    title: "Money without shame",
    summary:
      "Look at numbers kindly — five minutes, a cup of tea, one small adjustment. Shame hides information; clarity builds choice.",
    weeks: [
      "Week 1: Know one true number (balance, bill, debt) without fixing.",
      "Week 2: Cancel one subscription you don’t use.",
      "Week 3: Move a small amount toward savings or a debt — symbolic counts.",
      "Week 4: Thank past-you for one good money choice.",
    ],
  },
  {
    id: "sleep-sanctuary",
    title: "Sleep as advocacy",
    summary:
      "Treat sleep like a boundary with the world — dim light, cooler room, same rough bedtime when possible.",
    weeks: [
      "Week 1: Screens off thirty minutes before target sleep.",
      "Week 2: Same wake time four days — gentleness on weekends.",
      "Week 3: One wind-down ritual you repeat.",
      "Week 4: Nap or rest without calling it lazy.",
    ],
  },
  {
    id: "creativity-drip",
    title: "Make something ugly",
    summary:
      "Low-stakes making: journal scraps, voice notes, doodles. Process over polish.",
    weeks: [
      "Week 1: Five minutes of ink or pencil — no destination.",
      "Week 2: One voice note poem — delete allowed.",
      "Week 3: Rearrange a corner for beauty you like, not trends.",
      "Week 4: Share one line or image if it feels safe.",
    ],
  },
  {
    id: "seasonal-release",
    title: "Let something go",
    summary:
      "Each week release one thing — digital, physical, or emotional — that no longer fits who you’re becoming.",
    weeks: [
      "Week 1: Donate or recycle a pile you’ve delayed.",
      "Week 2: Unfollow or archive stale threads.",
      "Week 3: Name one story about yourself you’re done replaying.",
      "Week 4: Forgive a small mistake — yours or theirs — to move lighter.",
    ],
  },
];

export function getMonthlyChallengeFor(date: Date): MonthlyWellnessChallenge {
  const pool = MONTHLY_WELLNESS_CHALLENGES;
  const idx = monthlyChallengePoolIndex(date.getFullYear(), date.getMonth(), pool.length);
  return pool[idx];
}
