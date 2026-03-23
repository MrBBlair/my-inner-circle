import type {
  Comment,
  DirectorySpotlight,
  DonationListing,
  EventItem,
  ForumCategorySlug,
  Report,
  Thread,
  UserProfile,
  VendorListing,
} from "../types";

export type { ForumCategorySlug } from "../types";

const KEYS = {
  users: "mic_users",
  session: "mic_session",
  threads: "mic_threads",
  comments: "mic_comments",
  events: "mic_events",
  reports: "mic_reports",
  donations: "mic_donations",
  vendors: "mic_vendors",
  directorySpotlights: "mic_directory_spotlights",
  seed: "mic_seed_v1",
} as const;

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers(): Record<string, UserProfile> {
  return readJSON(KEYS.users, {});
}

export function saveUser(profile: UserProfile) {
  const all = getUsers();
  all[profile.id] = profile;
  writeJSON(KEYS.users, all);
}

export function getSessionUserId(): string | null {
  return readJSON<string | null>(KEYS.session, null);
}

export function setSessionUserId(id: string | null) {
  writeJSON(KEYS.session, id);
}

export function getThreads(): Thread[] {
  return readJSON(KEYS.threads, []);
}

export function saveThreads(threads: Thread[]) {
  writeJSON(KEYS.threads, threads);
}

export function getComments(): Comment[] {
  return readJSON(KEYS.comments, []);
}

export function saveComments(comments: Comment[]) {
  writeJSON(KEYS.comments, comments);
}

export function getEvents(): EventItem[] {
  return readJSON(KEYS.events, []);
}

export function saveEvents(events: EventItem[]) {
  writeJSON(KEYS.events, events);
}

export function getReports(): Report[] {
  return readJSON(KEYS.reports, []);
}

export function saveReports(reports: Report[]) {
  writeJSON(KEYS.reports, reports);
}

export function getDonations(): DonationListing[] {
  return readJSON(KEYS.donations, []);
}

export function saveDonations(list: DonationListing[]) {
  writeJSON(KEYS.donations, list);
}

export function getVendors(): VendorListing[] {
  return readJSON(KEYS.vendors, []);
}

export function saveVendors(list: VendorListing[]) {
  writeJSON(KEYS.vendors, list);
}

export function getDirectorySpotlights(): DirectorySpotlight[] {
  return readJSON(KEYS.directorySpotlights, []);
}

export function saveDirectorySpotlights(list: DirectorySpotlight[]) {
  writeJSON(KEYS.directorySpotlights, list);
}

export function isSeeded(): boolean {
  return localStorage.getItem(KEYS.seed) === "1";
}

export function markSeeded() {
  localStorage.setItem(KEYS.seed, "1");
}

export const TIER_LABELS: Record<
  UserProfile["tier"],
  { label: string; blurb: string }
> = {
  seedling: {
    label: "Seedling",
    blurb: "Forum read-only, affirmations, and public events.",
  },
  bloom: {
    label: "Bloom",
    blurb: "Post in joined categories, RSVP, and resource library.",
  },
  inner_circle: {
    label: "Inner Circle",
    blurb: "Full community access, challenges, and priority updates.",
  },
};

export function canPost(tier: UserProfile["tier"]): boolean {
  return tier === "bloom" || tier === "inner_circle";
}

export function canJoinChallenges(tier: UserProfile["tier"]): boolean {
  return tier === "inner_circle";
}

export const CATEGORY_META: Record<
  ForumCategorySlug,
  { title: string; description: string }
> = {
  health: {
    title: "Health & vitality",
    description: "Movement, sleep, nutrition, and gentle accountability.",
  },
  career: {
    title: "Career & ambition",
    description: "Negotiation, pivots, leadership, and confident next steps.",
  },
  healing: {
    title: "Healing & boundaries",
    description: "Recovery, self-trust, therapy wins, and emotional safety.",
  },
  parenting: {
    title: "Parenting & family",
    description: "Raising littles, co-parenting, and caring for yourself too.",
  },
  community: {
    title: "Community pulse",
    description: "Introductions, wins, and circle-wide conversation.",
  },
};
