export type MembershipTier = "seedling" | "bloom" | "inner_circle";

export type ForumCategorySlug =
  | "health"
  | "career"
  | "healing"
  | "parenting"
  | "community";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  tier: MembershipTier;
  bio: string;
  interests: string[];
  joinedCategories: ForumCategorySlug[];
  isModerator: boolean;
  onboardingComplete: boolean;
  createdAt: string;
  /** Opt in to appear in the Inner Circle member directory */
  showInDirectory?: boolean;
  /** Short line shown on directory card */
  directoryHeadline?: string;
  /** Skills, trades, or how you’d like to connect */
  directoryOffer?: string;
}

export type DonationKind = "clothes" | "services";

/** Donate clothes/items or offer/request neighborly services */
export interface DonationListing {
  id: string;
  kind: DonationKind;
  title: string;
  description: string;
  logistics: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

/** Trusted vendor / business space */
export interface VendorListing {
  id: string;
  businessName: string;
  category: string;
  description: string;
  websiteUrl?: string;
  contactNote: string;
  circlePartner?: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
}

/** Featured orgs or groups in the directory (not tied to a login) */
export interface DirectorySpotlight {
  id: string;
  name: string;
  headline: string;
  description: string;
  tags: string[];
  linkLabel?: string;
  linkUrl?: string;
}

export interface Thread {
  id: string;
  categorySlug: ForumCategorySlug;
  title: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
  heartUserIds: string[];
  /** JPEG data URLs (demo); omit or empty when no photos */
  attachmentDataUrls?: string[];
}

export interface Comment {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface FeedItem {
  id: string;
  type: "thread" | "event" | "announcement" | "challenge";
  title: string;
  summary: string;
  meta: string;
  href: string;
}

export interface EventItem {
  id: string;
  title: string;
  dateISO: string;
  endISO?: string;
  location: string;
  virtual: boolean;
  description: string;
  rsvpUserIds: string[];
}

export interface ResourceDoc {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "link";
  url: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  dateISO: string;
  pinned?: boolean;
}

export interface Report {
  id: string;
  targetType: "thread" | "comment";
  targetId: string;
  threadId?: string;
  reason: string;
  reporterId: string;
  reporterName: string;
  createdAt: string;
  status: "open" | "resolved";
}
