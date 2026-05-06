/**
 * Writes src/content/crownBlogData.ts — 24 monthly posts (May 2026–Apr 2028).
 * Run: node scripts/generate-crown-blog.mjs
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "src", "content", "crownBlogData.ts");

function seededRandom(seedStr) {
  let s = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    s ^= seedStr.charCodeAt(i);
    s = Math.imul(s, 16777619);
  }
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

function shuffle(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

/** Long read (~10–12 min): first edition, May 2026 */
function may2026FirstEdition() {
  return [
    `Welcome to the first edition of the Inner Circle Blog Space — a monthly letter for women who want friendship that is honest, paced for real life, and grounded in mutual care. If your heart tightens when you think about unread messages, this is for you. If you miss people you love and still feel “too behind” to reach out, this is for you too.`,
    `Most of us were never handed a map for adult friendship. Childhood gave us proximity; school gave us routine. Adulthood gives us moves, caregiving shifts, grief spikes, career pivots, and phones that make presence feel optional. Inner Circle exists because connection should not depend on having a perfect schedule — it should be sturdy enough for imperfect weeks.`,
    `This essay is about rhythm: not productivity, not performance, but the gentle pulse of showing up for others and yourself with integrity. Rhythm is how trust survives when life is loud. It is how you stay woven into a community without turning relationships into another job you are failing at.`,
    `Start by naming what friendship costs you right now, without judgment. Time? Emotional bandwidth? Money? Physical energy? Fear of being misunderstood? Whatever shows up is information, not a verdict on your character. Many capable women assume they are “bad friends” when they are simply under-resourced, over-committed, or healing from burnout.`,
    `Next, downgrade your ideal from cinematic to livable. Weekly mimosas might be fun, but friendship that lasts often looks like a two-sentence voice note, a meme that says “thinking of you,” a ride offered, a meal dropped on a porch, or a saved seat at circle night. Consistency beats intensity. Predictability lowers anxiety for everyone.`,
    `Pick one small ritual you can repeat without heroics. Examples: a “first Monday” photo of something ordinary that made you smile; a fifteen-minute catch-up on the same weekday; a shared playlist you both add one song to; a quarterly dinner that goes on the calendar before the quarter fills. Rituals create structure that love can travel along.`,
    `When your ritual needs shrinking, shrink it. A thirty-second “I’m underwater, love you, talk soon” message preserves more connection than a month of silence born from shame. If you have been absent, return plainly: “I ghosted my own life for a bit — not you. Want to reconnect in a low-key way?” Most friends exhale when the ambiguity ends.`,
    `Repair is a skill you can practice. Misread tone in a text? Say it. Hurt someone’s feelings? Own impact first, explanation second: “I think I hurt you. I’m sorry. Can we talk?” Repair is not groveling; it is modeling that the relationship matters more than being flawlessly right.`,
    `Boundaries are part of friendship, not the opposite of it. “I can’t talk tonight — can we do Saturday?” is a boundary. “I can’t be your only support for this crisis — can we build a wider net?” is also a boundary. Clear limits protect intimacy from resentment. Practice short sentences until they become boring; boring boundaries are sustainable boundaries.`,
    `Distribute care across more than one “best” friendship when possible. Concentrated dependency can burn people out. Build a quilt: one friend for laughter, one for prayer or meaning-making, one for pragmatic help, one for history, one for creativity. Community-style support matches Inner Circle’s spirit — neighbor energy, not solo heroism.`,
    `Online and hybrid connection counts. Inner Circle’s forums, neighborhood threads, and event RSVPs can be bridge tools, especially for caregivers, shift workers, rural neighbors, or anyone in a tender season. Show up imperfectly in the thread you can tolerate, then take one relationship deeper offline when it is safe and welcome.`,
    `If comparison steals joy, zoom out. Social feeds show highlights, not errands, therapy, or midnight worries. Someone else’s visible dinner party is not evidence that your quieter life is failing. Friendships have private seasons. Protect your gaze and reinvest attention into relationships where you feel seen.`,
    `Money and logistics quietly shape friendship. If you feel shame about not being able to afford outings, say so kindly and suggest walks, potlucks, park meetups, or free community events. If you can cover a small cost sometimes and it brings you joy, offer without making it a power play — “I’ve got this one” can be love language.`,
    `Caregiving chapters (children, elders, partners, disabled kin) deserve special gentleness. You may have less time for spontaneous hangs. Name your reality once, then invite friends into specific help: rides, meals, kid coverage for an hour, phone company while you fold laundry. People often want to assist but fear guessing wrong.`,
    `Work stress is real friendship friction. If your job consumes evenings, batch your social energy intentionally: one protected friendship block a week beats reactive scrolling. If your career demands travel, use travel-mode rituals — postcards, quick voice recordings, predictable “I’m alive” texts — until you land again.`,
    `Grief and transitions reorder friendships. Some people will disappear; others will surprise you. Let the losses be sad without deciding you are unlovable. Let new closeness be allowed without guilt. Your story does not have to stay legible to everyone who knew an older version of you.`,
    `Friendship across difference requires humility. Listen more than you lecture. Ask consent before offering advice on bodies, parenting, money, or faith. Believe people about their lived experience. Curiosity without entitlement keeps cross-cultural and cross-generational connection from becoming extraction.`,
    `Digital safety still matters: ask before sharing screenshots, protect others’ private stories, and treat DMs like living rooms — not broadcast booths. Trust is the currency of Inner Circle; treat it like cash, not loose change.`,
    `Celebrate progress without perfectionism. If you sent the text, made the apology, held the boundary, attended the event, or simply rested so you could be human later — that counts. Friendship is not a scoreboard. It is a practice you return to because people are worth it, including you.`,
    `Before May ends, choose one move: send a specific encouragement to one person, schedule one repeating touchpoint, or initiate one honest repair. Small integrity compounds. Inner Circle grows when we normalize steadiness over sparkle — neighbors who mean what they say, and say what they can keep.`,
    `Thank you for reading the first Inner Circle Blog Space letter. A new long read will be waiting on the first of each month, on topics that support your health, belonging, purpose, and joy. Until then, may your friendships feel spacious enough to hold your real life — the beautiful parts and the fragile ones too.`,
  ];
}

function angleForMeta(meta) {
  const lens = meta.title.toLowerCase();
  const area = meta.cat.toLowerCase();
  return {
    lede: `This month we explore ${lens} — practical, grounded guidance for real life rather than picture-perfect ideals.`,
    sections: [
      {
        h: "Clarity beats intensity.",
        p1: `When questions around ${area} feel messy, begin with one truthful sentence about what you need and what you can offer. Clarity lowers anxiety for everyone — including you.`,
        p2: `If someone you love is carrying weight in this area, ask what help would feel helpful before you rush to fix. Presence often beats prescriptions.`,
        p3: `Write the sentence in notes first if your voice shakes. Clarity does not require courage to arrive fully formed — only honesty to begin.`,
      },
      {
        h: "Small steps beat heroic bursts.",
        p1: `Choose one micro-action for the next seven days: a walk, a boundary, a scheduled call, a quiet hour, a budget line, one question for a clinician, one apology, one celebration, one hour of deliberate rest.`,
        p2: `Momentum comes from repetition. Heroic bursts often collapse into shame cycles. Inner Circle culture cheers for steady, not flashy.`,
      },
      {
        h: "Use structure without losing warmth.",
        p1: `Forums, RSVP events, and neighbor threads exist to reduce isolation. You can lurk briefly, then introduce yourself with one honest line — visibility invites mirroring.`,
        p2: `If you are private, generalize details enough to protect people while still receiving support. Safety and storytelling can coexist.`,
      },
      {
        h: "Expect seasons of capacity.",
        p1: `Some months you sow; some months you rest. In every chapter — including seasons shaped by ${meta.cat.toLowerCase()} — you have permission to change tempo without abandoning your values.`,
        p2: `When bandwidth dips, shorten commitments rather than vanishing. Ghosting corrodes trust; honest scaling preserves it.`,
      },
      {
        h: "Repair and gratitude grow roots.",
        p1: `Thank people specifically. Acknowledge late replies, loud weeks, and learning edges. Repair builds reputations; pretending you never struggle does not.`,
        p2: `If this topic touched an old wound and you responded sharply, return when regulated. Vulnerability with boundaries can deepen trust.`,
      },
      {
        h: "Try a seven-day experiment.",
        p1: `Pick one idea from this essay and test it for seven days — not perfectly, just honestly. Note what felt lighter, what felt scary, and what you might repeat.`,
        p2: `Experiments reduce shame because they treat change as data, not as a verdict on your character.`,
      },
      {
        h: "Share wisely in community spaces.",
        p1: `You can be truthful without narrating every private detail. Generalize when needed; name your feelings; protect other people’s stories.`,
        p2: `Inner Circle rooms work best when members follow community guidelines, use reporting tools, and assume good faith while still keeping boundaries.`,
      },
      {
        h: "When you wobble, return to your values.",
        p1: `Ask: “What kind of person do I want to be in conflict, in fatigue, in joy?” Let that answer orient your next action more than your fear does.`,
        p2: `Values are not vibes — they are commitments you practice when nobody is applauding.`,
      },
      {
        h: "Close with one forward question.",
        p1: `Ask weekly: “What would make next week feel five percent kinder to my future self?” Answer practically — then schedule it.`,
        p2: `We will see you next month with a new topic — same neighbor heart, fresh angle.`,
      },
    ],
  };
}

function paragraphsForTopic(topic, releaseLabel) {
  const hook = [
    `${topic.lede}`,
    `This month’s essay is for women building meaningful rooms — online and in person — with honesty, moderation, and care. Borrow what fits; leave what does not.`,
    `Inner Circle is friendship-forward: growth without grind, support without spectacle, belonging without performing perfection.`,
  ];

  const body = [];
  for (const sec of topic.sections) {
    body.push(`${sec.h} ${sec.p1}`);
    body.push(sec.p2);
    if (sec.p3) body.push(sec.p3);
  }

  const close = [
    `Before ${releaseLabel} ends, pick one action — not five. Send one sincere message, schedule one realistic touchpoint, name one boundary, or rest one hour without apology.`,
    `Community holds when individuals practice integrity in public: in threads, at gatherings, and in how we treat people’s names, stories, and safety.`,
    `Thank you for reading. A new edition publishes on the first of next month.`,
  ];

  return [...hook, ...body, ...close];
}

function buildTopic(meta, angle) {
  return { ...meta, lede: angle.lede, sections: angle.sections };
}

const META_TOPICS = [
  { cat: "Friendship", title: "The rhythm of real friendship when life is full", excerpt: "Small rituals, honest check-ins, and repair that lasts when calendars collide." },
  { cat: "Boundaries", title: "Boundaries that feel kind, not cold", excerpt: "Scripts, timing, and the difference between a boundary and a barrier." },
  { cat: "Wellness", title: "Nervous-system care on ordinary days", excerpt: "Stress, sleep, and overstimulation — steady rhythms without a spa day." },
  { cat: "Community", title: "Finding your people when you are new in town", excerpt: "Low-pressure ways to show up until belonging catches up." },
  { cat: "Caregiving", title: "Supporting others without losing yourself", excerpt: "Micro-rest, shared load, and asking for backup." },
  { cat: "Work & purpose", title: "Career pivots with your values still intact", excerpt: "Skills, money peace, and honest storytelling while you change lanes." },
  { cat: "Grief & change", title: "Seasons of loss and the friends who stay", excerpt: "Language for hard chapters and holding both joy and ache." },
  { cat: "Money peace", title: "Friendship and finances: clarity without shame", excerpt: "Splitting costs and keeping money talk human." },
  { cat: "Faith & meaning", title: "Spiritual honesty in a busy life", excerpt: "Questions, practice, and rest — meaning without performance." },
  { cat: "Parenting", title: "Raising humans while refueling your own cup", excerpt: "The village mindset and friendship as practical support." },
  { cat: "Health", title: "Advocating for your body in appointments and friendships", excerpt: "Questions for clinicians and how friends help without playing expert." },
  { cat: "Conflict repair", title: "Repair after a misunderstanding", excerpt: "Impact, listening, and when pause helps more than speed." },
  { cat: "Joy", title: "Small delights that compound", excerpt: "Play, creativity, and neighbor energy — joy you do not have to earn." },
  { cat: "Rest", title: "Rest as resistance to hustle culture", excerpt: "Sleep, rhythm, and saying no so generosity stays sincere." },
  { cat: "Networking", title: "Warm introductions that feel mutual", excerpt: "Connect people with care and keep rooms trustworthy." },
  { cat: "Seasonal living", title: "Honoring your energy through the year", excerpt: "Adjusting expectations to match real capacity." },
  { cat: "Safety", title: "Digital safety in community spaces", excerpt: "Screenshots, DMs, and habits that protect trust." },
  { cat: "Culture", title: "Cross-cultural curiosity in friendship", excerpt: "Asking better questions and showing up to learn." },
  { cat: "Mentorship", title: "Mentorship that respects both people", excerpt: "Clarity, consent, boundaries, and healthy endings." },
  { cat: "Neighbors", title: "Neighbor care when life gets loud", excerpt: "Noise, kindness, and community glue near home." },
  { cat: "Creativity", title: "Creativity as wellness", excerpt: "Low-stakes projects and creative friendship dates." },
  { cat: "Generations", title: "Friendship across generations", excerpt: "What elders, midlife neighbors, and young adults gain together." },
  { cat: "Service", title: "Service that fits your season", excerpt: "Give-back rhythms that do not burn you out." },
  { cat: "Self-worth", title: "Befriending yourself on the hard days", excerpt: "Self-talk, community mirrors, and worth beyond productivity." },
];

const rand = seededRandom("inner-circle-blog-v1");
/** May 2026 is always the flagship friendship edition; remaining topics shuffled for variety. */
const orderedMeta = [META_TOPICS[0], ...shuffle(META_TOPICS.slice(1), rand)];

const header = `/** Generated by scripts/generate-crown-blog.mjs — do not edit by hand; re-run the script. */\n`;

const imports = `import missionFemaleFriends from "../assets/welcome/official/mission-female-friends.jpg";
import impactWellness from "../assets/welcome/official/impact-wellness-worth.png";
import impactBackToSchool from "../assets/welcome/official/impact-back-to-school.png";
import impactMentorship from "../assets/welcome/official/impact-mentorship-sisterhood.png";
import heroMulticultural from "../assets/welcome/official/hero-multicultural.png";
import heroTransforming from "../assets/welcome/official/hero-transforming-world.png";

const CROWN_ASSETS = [
  missionFemaleFriends,
  impactWellness,
  impactBackToSchool,
  impactMentorship,
  heroMulticultural,
  heroTransforming,
] as const;
`;

const rows = [];
for (let i = 0; i < 24; i++) {
  const year = 2026 + Math.floor((4 + i) / 12);
  const month = ((4 + i) % 12) + 1;
  const releaseISO = `${year}-${String(month).padStart(2, "0")}-01`;
  const dateLabel = new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const meta = orderedMeta[i];
  const slug = slugify(`${releaseISO}-${meta.title}`);
  const id = `crown-${releaseISO}`;
  const srcExpr = `CROWN_ASSETS[${i % 6}]`;

  const angle = angleForMeta(meta);
  const topic = buildTopic(meta, angle);
  const paras = i === 0 ? may2026FirstEdition() : paragraphsForTopic(topic, dateLabel);
  const readMins = i === 0 ? 11 : 10;

  const tips =
    i === 0
      ? [
          "Send one ‘no agenda’ check-in voice memo this week — under ninety seconds.",
          "Schedule a repeating 20-minute friendship maintenance block.",
          "When you err, lead with impact: ‘I think I hurt you. Can we talk?’",
        ]
      : [
          "Choose one line from this essay to act on within seven days.",
          "Tell someone something specific you appreciate about them.",
          "If you are maxed out, shorten the ritual — do not delete your whole circle.",
        ];

  const paraStr = paras.map((p) => JSON.stringify(p)).join(",\n    ");
  const tipsStr = tips.map((t) => JSON.stringify(t)).join(", ");

  rows.push(`  {
    id: ${JSON.stringify(id)},
    slug: ${JSON.stringify(slug)},
    releaseDateISO: ${JSON.stringify(releaseISO)},
    dateISO: ${JSON.stringify(releaseISO)},
    dateLabel: ${JSON.stringify(dateLabel)},
    category: ${JSON.stringify(meta.cat)},
    title: ${JSON.stringify(meta.title)},
    excerpt: ${JSON.stringify(meta.excerpt)},
    readMins: ${readMins},
    src: ${srcExpr},
    alt: ${JSON.stringify(`Blog artwork for Inner Circle: ${meta.title}`)},
    paragraphs: [
    ${paraStr}
    ],
    tips: [${tipsStr}],
  }`);
}

const file = `${header}${imports}

export const CROWN_BLOG_SCHEDULE = [
${rows.join(",\n")}
] as const;
`;

writeFileSync(OUT, file, "utf8");
console.log("Wrote", OUT);
