import type {
  AdminNotification,
  Comment,
  CrownBlogPost,
  DirectorySpotlight,
  DonationListing,
  EventGalleryPhoto,
  EventItem,
  ForumCategorySlug,
  NeighborhoodGroup,
  NeighborhoodGroupRequest,
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
  adminNotifications: "mic_admin_notifications",
  donations: "mic_donations",
  vendors: "mic_vendors",
  directorySpotlights: "mic_directory_spotlights",
  neighborhoodGroupRequests: "mic_neighborhood_group_requests",
  neighborhoodGroups: "mic_neighborhood_groups",
  gallery: "mic_event_gallery",
  adminCrownBlogs: "mic_admin_crown_blogs",
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

const apiBase = (): string =>
  typeof import.meta.env.VITE_API_BASE === "string" ? import.meta.env.VITE_API_BASE : "/api";

function notifyAdminServer(note: AdminNotification) {
  try {
    void fetch(`${apiBase()}/admin/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
  } catch {
    /* Offline or API down — local admin inbox still works. */
  }
}

export function getUsers(): Record<string, UserProfile> {
  const raw = readJSON<Record<string, UserProfile & { tier?: unknown }>>(KEYS.users, {});
  const out: Record<string, UserProfile> = {};
  for (const id of Object.keys(raw)) {
    out[id] = normalizeUser(raw[id]);
  }
  return out;
}

export function saveUser(profile: UserProfile) {
  const all = getUsers();
  all[profile.id] = normalizeUser(profile);
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

function isAdminNotificationRecord(x: unknown): x is AdminNotification {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.kind === "string" &&
    typeof o.title === "string" &&
    typeof o.body === "string" &&
    typeof o.createdAt === "string" &&
    (o.readAt === undefined || typeof o.readAt === "string") &&
    (o.actorId === undefined || typeof o.actorId === "string") &&
    (o.actorName === undefined || typeof o.actorName === "string") &&
    (o.href === undefined || typeof o.href === "string") &&
    (o.relatedId === undefined || typeof o.relatedId === "string")
  );
}

export function getAdminNotifications(): AdminNotification[] {
  const raw = readJSON<unknown>(KEYS.adminNotifications, []);
  if (!Array.isArray(raw)) return [];
  return raw.filter(isAdminNotificationRecord).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function saveAdminNotifications(list: AdminNotification[]) {
  writeJSON(KEYS.adminNotifications, list.slice(0, 100));
  window.dispatchEvent(new Event("mic_admin_notifications_changed"));
}

export function pushAdminNotification(input: Omit<AdminNotification, "id" | "createdAt"> & { id?: string; createdAt?: string }) {
  const note: AdminNotification = {
    id: input.id ?? crypto.randomUUID?.() ?? `admin_note_${Date.now()}`,
    createdAt: input.createdAt ?? new Date().toISOString(),
    kind: input.kind,
    title: input.title,
    body: input.body,
    readAt: input.readAt,
    actorId: input.actorId,
    actorName: input.actorName,
    href: input.href,
    relatedId: input.relatedId,
  };
  saveAdminNotifications([note, ...getAdminNotifications()]);
  notifyAdminServer(note);
}

export function markAdminNotificationRead(id: string) {
  const readAt = new Date().toISOString();
  saveAdminNotifications(getAdminNotifications().map((n) => (n.id === id ? { ...n, readAt } : n)));
}

export function markAllAdminNotificationsRead() {
  const readAt = new Date().toISOString();
  saveAdminNotifications(getAdminNotifications().map((n) => (n.readAt ? n : { ...n, readAt })));
}

export function getUnreadAdminNotificationCount(): number {
  return getAdminNotifications().filter((n) => !n.readAt).length;
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

export function normalizeUser(profile: UserProfile & { tier?: unknown }): UserProfile {
  const { tier: _omitTier, ...rest } = profile;
  const approval: UserProfile["memberApprovalStatus"] =
    rest.memberApprovalStatus === "pending" || rest.memberApprovalStatus === "declined"
      ? rest.memberApprovalStatus
      : "approved";

  return {
    ...rest,
    isSiteAdmin: rest.isSiteAdmin === true,
    statusLine: rest.statusLine ?? "",
    phone: rest.phone ?? "",
    city: rest.city ?? "",
    address: rest.address ?? "",
    profileImageDataUrl: rest.profileImageDataUrl ?? "",
    backgroundImageDataUrl: rest.backgroundImageDataUrl ?? "",
    birthdateISO: rest.birthdateISO ?? "",
    memberApprovalStatus: approval,
  };
}

/** Full app, directory, and onboarding (for non–site-admin accounts). */
export function hasApprovedMembership(profile: UserProfile): boolean {
  if (profile.isSiteAdmin === true) return true;
  return profile.memberApprovalStatus === "approved";
}

export function getNeighborhoodGroupRequests(): NeighborhoodGroupRequest[] {
  return readJSON(KEYS.neighborhoodGroupRequests, []);
}

export function saveNeighborhoodGroupRequests(list: NeighborhoodGroupRequest[]) {
  writeJSON(KEYS.neighborhoodGroupRequests, list);
}

export function getNeighborhoodGroups(): NeighborhoodGroup[] {
  return readJSON(KEYS.neighborhoodGroups, []);
}

export function saveNeighborhoodGroups(list: NeighborhoodGroup[]) {
  writeJSON(KEYS.neighborhoodGroups, list);
}

export function getEventGalleryPhotos(): EventGalleryPhoto[] {
  return readJSON(KEYS.gallery, []);
}

export function saveEventGalleryPhotos(list: EventGalleryPhoto[]) {
  writeJSON(KEYS.gallery, list);
}

function isCrownBlogPostRecord(x: unknown): x is CrownBlogPost {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.slug === "string" &&
    typeof o.id === "string" &&
    typeof o.releaseDateISO === "string" &&
    typeof o.dateISO === "string" &&
    typeof o.dateLabel === "string" &&
    typeof o.category === "string" &&
    typeof o.title === "string" &&
    typeof o.excerpt === "string" &&
    typeof o.readMins === "number" &&
    typeof o.src === "string" &&
    typeof o.alt === "string" &&
    Array.isArray(o.paragraphs) &&
    o.paragraphs.every((p) => typeof p === "string") &&
    (o.tips === undefined ||
      (Array.isArray(o.tips) && o.tips.every((t) => typeof t === "string"))) &&
    (o.photoFocus === undefined || o.photoFocus === "lower")
  );
}

/** Site-admin-authored blog posts (localStorage). */
export function getAdminCrownBlogPosts(): CrownBlogPost[] {
  const raw = readJSON<unknown>(KEYS.adminCrownBlogs, []);
  if (!Array.isArray(raw)) return [];
  return raw.filter(isCrownBlogPostRecord);
}

export function saveAdminCrownBlogPosts(posts: CrownBlogPost[]) {
  writeJSON(KEYS.adminCrownBlogs, posts);
}

export function isSeeded(): boolean {
  return localStorage.getItem(KEYS.seed) === "1";
}

export function markSeeded() {
  localStorage.setItem(KEYS.seed, "1");
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
