import type {
  Announcement,
  Comment,
  DirectorySpotlight,
  DonationListing,
  EventItem,
  Thread,
  UserProfile,
  VendorListing,
} from "../types";
import {
  getComments,
  getDirectorySpotlights,
  getDonations,
  getEvents,
  getThreads,
  getUsers,
  getVendors,
  saveComments,
  saveDirectorySpotlights,
  saveDonations,
  saveEvents,
  saveThreads,
  saveUser,
  saveVendors,
} from "./storage";
import { setStoredPassword } from "./passwordStore";

const demoMod: UserProfile = {
  id: "user_mod_demo",
  email: "moderator@innercircle.demo",
  displayName: "Circle Care Team",
  tier: "inner_circle",
  bio: "Here to keep conversations kind, clear, and safe.",
  interests: ["community care", "moderation", "resources"],
  joinedCategories: ["community", "healing", "health", "career", "parenting"],
  isModerator: true,
  onboardingComplete: true,
  createdAt: new Date().toISOString(),
  showInDirectory: true,
  directoryHeadline: "Care team & resource navigation",
  directoryOffer: "Help with reports, safety questions, and finding the right room in the circle.",
};

/** Sample neighbors so threads and replies show varied names (demo accounts; no passwords). */
const seedNeighborMaya: UserProfile = {
  id: "user_seed_maya",
  email: "maya.b@innercircle.demo",
  displayName: "Maya B.",
  tier: "bloom",
  bio: "Mom of two, nonprofit finance, learning to rest without guilt.",
  interests: ["parenting", "career", "community meals"],
  joinedCategories: ["community", "health", "career", "healing", "parenting"],
  isModerator: false,
  onboardingComplete: true,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 400).toISOString(),
};

const seedNeighborJordan: UserProfile = {
  id: "user_seed_jordan",
  email: "jordan.t@innercircle.demo",
  displayName: "Jordan T.",
  tier: "inner_circle",
  bio: "Therapist in training · here for real talk about burnout and boundaries.",
  interests: ["healing", "career", "wellness"],
  joinedCategories: ["community", "health", "career", "healing", "parenting"],
  isModerator: false,
  onboardingComplete: true,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200).toISOString(),
};

const seedDonations: DonationListing[] = [
  {
    id: "don_coats",
    kind: "clothes",
    title: "Gently used winter coats (sizes M–XL)",
    description:
      "Two puffer coats and a wool wrap — dry-cleaned, no stains. Happy to pass to someone who needs warmth this season.",
    logistics: "Pickup near downtown; can meet at the Saturday walk if easier.",
    authorId: demoMod.id,
    authorName: demoMod.displayName,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: "don_professional",
    kind: "clothes",
    title: "Interview-ready blazers & slacks",
    description: "Switching careers — donating navy and black blazer sets, sizes 10/12.",
    logistics: "Ship or local handoff; message with your general area.",
    authorId: demoMod.id,
    authorName: demoMod.displayName,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
  },
  {
    id: "don_resume",
    kind: "services",
    title: "Free resume review (2 slots / month)",
    description:
      "HR lead offering 30-minute resume and LinkedIn headline feedback for Bloom+ members pivoting roles.",
    logistics: "Virtual; sign up via Contact with subject “Resume circle.”",
    authorId: demoMod.id,
    authorName: demoMod.displayName,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

const seedVendors: VendorListing[] = [
  {
    id: "ven_tea",
    businessName: "Bloom & Steep Teas",
    category: "Wellness & retail",
    description:
      "Black-owned loose-leaf blends; Inner Circle members get 10% off first order with code INNERCIRCLE.",
    websiteUrl: "https://example.com",
    contactNote: "Owner: Janelle · orders@example.com",
    circlePartner: true,
    authorId: demoMod.id,
    authorName: demoMod.displayName,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "ven_therapy",
    businessName: "Harbor Light Counseling (collective)",
    category: "Mental health",
    description:
      "Sliding-scale telehealth with clinicians who center women of color. Not affiliated with Inner Circle — vetted partner list.",
    websiteUrl: "https://example.com",
    contactNote: "Intake line in bio; mention Inner Circle for waitlist priority where available.",
    circlePartner: true,
    authorId: demoMod.id,
    authorName: demoMod.displayName,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString(),
  },
];

const seedSpotlights: DirectorySpotlight[] = [
  {
    id: "spot_book",
    name: "Sisters Who Read",
    headline: "Monthly hybrid book & rest club",
    description:
      "Fiction and memoir picks by Black women authors. Chapters in three cities + Zoom option.",
    tags: ["Social", "Literacy", "Rest"],
    linkLabel: "Interest form (demo)",
    linkUrl: "https://example.com",
  },
  {
    id: "spot_care",
    name: "Care Collective Mutual Aid",
    headline: "Meal trains & childcare swaps",
    description:
      "Neighbor-led support for postpartum weeks, surgery recovery, and elder check-ins.",
    tags: ["Mutual aid", "Parenting", "Healing"],
  },
];

const seedThreads: Thread[] = [
  {
    id: "t_welcome",
    categorySlug: "community",
    title: "Welcome — introduce yourself",
    authorId: demoMod.id,
    authorName: demoMod.displayName,
    body: "Share your name (or initials), what brought you here, and one thing you’re proud of this week. This is a judgment-free zone.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    heartUserIds: [seedNeighborMaya.id, seedNeighborJordan.id],
  },
  {
    id: "t_gratitude",
    categorySlug: "healing",
    title: "Micro-boundaries that changed everything",
    authorId: demoMod.id,
    authorName: demoMod.displayName,
    body: "What’s one small boundary you set that made your week feel lighter? Let’s collect ideas for anyone who needs inspiration.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    heartUserIds: [seedNeighborJordan.id],
  },
  {
    id: "t_potluck",
    categorySlug: "community",
    title: "Spring potluck — who’s bringing what?",
    authorId: seedNeighborMaya.id,
    authorName: seedNeighborMaya.displayName,
    body: "Thinking next Saturday afternoon, park pavilion if weather holds. I’ll bring mac and cheese and paper goods. Drop your dish + any allergies below so we can label things.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    heartUserIds: [],
  },
  {
    id: "t_sleep",
    categorySlug: "health",
    title: "Sleep hacks that don’t feel like another chore",
    authorId: seedNeighborJordan.id,
    authorName: seedNeighborJordan.displayName,
    body: "My brain won’t shut off until 1 a.m. I’ve tried strict schedules and they backfire. What’s actually worked for you — especially if you share a bed or have little ones?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    heartUserIds: [demoMod.id],
  },
  {
    id: "t_advocate",
    categorySlug: "health",
    title: "Advocating for yourself at the doctor (scripts welcome)",
    authorId: demoMod.id,
    authorName: demoMod.displayName,
    body: "If you’ve found phrases that help you get taken seriously — or ways to bring a friend or notes — please share. No medical advice, just peer experience.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    heartUserIds: [],
  },
  {
    id: "t_salary",
    categorySlug: "career",
    title: "Negotiating after a “budget freeze” email",
    authorId: seedNeighborMaya.id,
    authorName: seedNeighborMaya.displayName,
    body: "Got promoted in practice but HR says raises are frozen company-wide. I have another offer at lower title but higher cash. How would you approach the conversation?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    heartUserIds: [seedNeighborJordan.id],
  },
  {
    id: "t_burnout",
    categorySlug: "career",
    title: "Quiet quitting vs. setting limits — what’s working?",
    authorId: seedNeighborJordan.id,
    authorName: seedNeighborJordan.displayName,
    body: "Not trying to debate labels — I’m curious what concrete changes helped you protect energy without blowing up your reputation.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    heartUserIds: [],
  },
  {
    id: "t_therapy_ask",
    categorySlug: "healing",
    title: "First therapy session this week — any gentle tips?",
    authorId: seedNeighborMaya.id,
    authorName: seedNeighborMaya.displayName,
    body: "Finally booked. I’m nervous I’ll freeze or overshare. If you remember your first session, what helped you settle in?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    heartUserIds: [demoMod.id, seedNeighborJordan.id],
  },
  {
    id: "t_school_lunch",
    categorySlug: "parenting",
    title: "Packing lunches when nobody agrees on anything",
    authorId: demoMod.id,
    authorName: demoMod.displayName,
    body: "One kid only eats beige food, the other is vegetarian this month. Share your low-drama wins — I’ll take freezer ideas too.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    heartUserIds: [],
  },
  {
    id: "t_childcare",
    categorySlug: "parenting",
    title: "Backup childcare swaps in our area?",
    authorId: seedNeighborJordan.id,
    authorName: seedNeighborJordan.displayName,
    body: "Single parent here — looking to trade a few hours on weekends with another family. If you’ve done informal swaps, how did you set expectations?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    heartUserIds: [seedNeighborMaya.id],
  },
];

const seedComments: Comment[] = [
  {
    id: "c_welcome_1",
    threadId: "t_welcome",
    authorId: seedNeighborMaya.id,
    authorName: seedNeighborMaya.displayName,
    body: "Hi — Maya, two kids, joined after a friend sent me a screenshot of the healing room. Proud moment: I finally deleted work email off my phone last night.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 45).toISOString(),
  },
  {
    id: "c_welcome_2",
    threadId: "t_welcome",
    authorId: seedNeighborJordan.id,
    authorName: seedNeighborJordan.displayName,
    body: "Jordan here. I’m in grad school and chronically underslept 😅 Proud of: showing up to supervision even when I wanted to ghost.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 120).toISOString(),
  },
  {
    id: "c_welcome_3",
    threadId: "t_welcome",
    authorId: demoMod.id,
    authorName: demoMod.displayName,
    body: "So glad you’re both here. Take your time exploring rooms — you can join spaces from the Neighborhood overview whenever you’re ready.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 130).toISOString(),
  },
  {
    id: "c_welcome_4",
    threadId: "t_welcome",
    authorId: seedNeighborMaya.id,
    authorName: seedNeighborMaya.displayName,
    body: "That tip about joining rooms helped — I wasn’t sure if I was “allowed” to lurk first. Lurking today, posting tomorrow 💛",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 200).toISOString(),
  },
  {
    id: "c_gratitude_1",
    threadId: "t_gratitude",
    authorId: seedNeighborJordan.id,
    authorName: seedNeighborJordan.displayName,
    body: "I started saying “I need to check my calendar” instead of yes on the spot. Small phrase, huge pause.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "c_gratitude_2",
    threadId: "t_gratitude",
    authorId: seedNeighborMaya.id,
    authorName: seedNeighborMaya.displayName,
    body: "No calls after 8 p.m. unless it’s my sister. My team adjusted faster than I expected when I named it once in standup.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
  },
  {
    id: "c_gratitude_3",
    threadId: "t_gratitude",
    authorId: demoMod.id,
    authorName: demoMod.displayName,
    body: "Love these examples. Boundaries aren’t punishment — they’re information. Thanks for modeling that here.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "c_salary_1",
    threadId: "t_salary",
    authorId: seedNeighborJordan.id,
    authorName: seedNeighborJordan.displayName,
    body: "I’d document impact metrics for 90 days and ask for a written plan if freeze lifts — then decide if the other offer is your real floor.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
  },
  {
    id: "c_salary_2",
    threadId: "t_salary",
    authorId: demoMod.id,
    authorName: demoMod.displayName,
    body: "Career room isn’t for legal advice, but many members have used a concise one-pager + 15-min conversation to reopen comp talks. You’re not wrong to ask.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 38).toISOString(),
  },
  {
    id: "c_sleep_1",
    threadId: "t_sleep",
    authorId: seedNeighborMaya.id,
    authorName: seedNeighborMaya.displayName,
    body: "Dim lights + boring podcast in one earbud. Not cute but I’m asleep before the host finishes the intro.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
  },
  {
    id: "c_sleep_2",
    threadId: "t_sleep",
    authorId: demoMod.id,
    authorName: demoMod.displayName,
    body: "If worry-spirals hit, some folks keep a notebook by the bed for a two-minute brain dump — saves it for tomorrow instead of 2 a.m.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
  },
  {
    id: "c_potluck_1",
    threadId: "t_potluck",
    authorId: demoMod.id,
    authorName: demoMod.displayName,
    body: "I can bring a big green salad (nuts on the side). Gluten-free dressing in a separate jar.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
  },
];

const seedEvents: EventItem[] = [
  {
    id: "ev_coffee",
    title: "Virtual coffee & intention setting",
    dateISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    endISO: new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60,
    ).toISOString(),
    location: "Zoom (link in RSVP confirmation)",
    virtual: true,
    description: "A gentle start to the week: share one goal and one kindness you’ll offer yourself.",
    rsvpUserIds: [],
  },
  {
    id: "ev_walk",
    title: "Local mindful walk (Eastside chapter)",
    dateISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    endISO: new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 10 + 1000 * 60 * 90,
    ).toISOString(),
    location: "Riverside Park — main entrance",
    virtual: false,
    description: "All paces welcome. We’ll pair up for conversation prompts optional.",
    rsvpUserIds: [],
  },
];

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    title: "Community guidelines refresh",
    body: "We lead with empathy, respect privacy, and remove content that threatens safety. Report anything that doesn’t feel right.",
    dateISO: new Date().toISOString(),
    pinned: true,
  },
  {
    id: "a2",
    title: "New: weekly gratitude challenge",
    body: "Bloom + Inner Circle members can join from Wellness. Starts every Monday.",
    dateISO: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export function ensureSeedData() {
  const users = getUsers();
  if (!users[demoMod.id]) {
    saveUser(demoMod);
    setStoredPassword(demoMod.id, "circlecare");
  }
  if (!users[seedNeighborMaya.id]) {
    saveUser(seedNeighborMaya);
  }
  if (!users[seedNeighborJordan.id]) {
    saveUser(seedNeighborJordan);
  }

  let threads = getThreads();
  const knownThreadIds = new Set(threads.map((t) => t.id));
  const newThreads = seedThreads.filter((t) => !knownThreadIds.has(t.id));
  if (newThreads.length) {
    saveThreads([...newThreads, ...threads]);
    threads = getThreads();
  }

  const threadIds = new Set(threads.map((t) => t.id));
  const comments = getComments();
  const knownCommentIds = new Set(comments.map((c) => c.id));
  const newComments = seedComments.filter(
    (c) => !knownCommentIds.has(c.id) && threadIds.has(c.threadId),
  );
  if (newComments.length) {
    saveComments([...comments, ...newComments]);
  }

  const events = getEvents();
  if (events.length === 0) {
    saveEvents(seedEvents);
  }

  if (getDonations().length === 0) {
    saveDonations(seedDonations);
  }
  if (getVendors().length === 0) {
    saveVendors(seedVendors);
  }
  if (getDirectorySpotlights().length === 0) {
    saveDirectorySpotlights(seedSpotlights);
  }
}
