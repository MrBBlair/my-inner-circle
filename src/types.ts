/** Site admin must approve new self-serve signups before full app access. */
export type MemberApprovalStatus = "pending" | "approved" | "declined";

export type ForumCategorySlug =
  | "health"
  | "career"
  | "healing"
  | "parenting"
  | "community";

/** How members register / pay attention for an event */
export type EventRegistrationMode = "free" | "rsvp" | "ticket" | "other";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  interests: string[];
  joinedCategories: ForumCategorySlug[];
  isModerator: boolean;
  /** Full site administrator (dashboard, neighborhood approvals, galleries, curated events). */
  isSiteAdmin?: boolean;
  onboardingComplete: boolean;
  createdAt: string;
  /** Opt in to appear in the Inner Circle member directory */
  showInDirectory?: boolean;
  /** Short line shown on directory card */
  directoryHeadline?: string;
  /** Skills, trades, or how you’d like to connect */
  directoryOffer?: string;
  /** Short status/life update shown on the home profile tile. */
  statusLine?: string;
  phone?: string;
  city?: string;
  /** Full mailing address (street, city, state/ZIP as applicable) — collected at signup for directory. */
  address?: string;
  /** Profile/avatar photo data URL for the local demo. Use hosted URLs in production. */
  profileImageDataUrl?: string;
  /** Account background/cover photo data URL for the local demo. Use hosted URLs in production. */
  backgroundImageDataUrl?: string;
  /** ISO date yyyy-mm-dd (local intent; stored as typed string) */
  birthdateISO?: string;
  /** New signups default to pending until a site admin approves. */
  memberApprovalStatus?: MemberApprovalStatus;
}

/** Blog Space article (scheduled in repo or added by site admin in-browser). */
export interface CrownBlogPost {
  slug: string;
  id: string;
  /** Public on this date at local midnight (inclusive). */
  releaseDateISO: string;
  dateISO: string;
  dateLabel: string;
  category: string;
  title: string;
  excerpt: string;
  readMins: number;
  /** Image URL, data URL, or the `CROWN_BLOG_DEFAULT_HERO_SENTINEL` string from `crownChronicles`. */
  src: string;
  alt: string;
  paragraphs: string[];
  tips?: string[];
  photoFocus?: "lower";
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
  /** When set, thread lives inside a neighborhood group silo only */
  neighborhoodGroupId?: string;
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
  registrationMode?: EventRegistrationMode;
  /** Display price hint for ticket mode (whole currency units, USD intent) */
  ticketPriceUsd?: number;
  /** Primary donation / pay-what-you-can link shown on RSVP card */
  donationUrl?: string;
  /** Neighborhood group-only event when set */
  neighborhoodGroupId?: string;
}

export interface ResourceDoc {
  id: string;
  title: string;
  description: string;
  /** On-site guide at `/resources/{slug}` */
  type: "guide" | "link";
  slug?: string;
  /** External URL when `type` is `"link"` */
  url?: string;
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

/** Member request for a new neighborhood discussion circle */
export interface NeighborhoodGroupRequest {
  id: string;
  proposedName: string;
  proposedSlug: string;
  description: string;
  requestedByUserId: string;
  requestedByName: string;
  createdAt: string;
  status: "pending" | "approved" | "declined";
}

/** Approved subgroup with its own thread silo */
export interface NeighborhoodGroup {
  id: string;
  slug: string;
  name: string;
  description: string;
  approvedAt: string;
  approvedFromRequestId: string;
}

/** Admin-managed event photo */
export interface EventGalleryPhoto {
  id: string;
  /** Optional tie to calendar event */
  eventId?: string;
  title: string;
  caption: string;
  /** Data URL (demo) or external HTTPS URL */
  imageDataUrl?: string;
  imageUrl?: string;
  sortOrder: number;
  createdAt: string;
}

export type AdminNotificationKind =
  | "member_signup"
  | "circle_request"
  | "moderation_report"
  | "support_message"
  | "public_contact"
  | "member_listing"
  | "vendor_listing"
  | "admin_action";

/** Site-admin attention item; local demo inbox, ready to back with email/push in production. */
export interface AdminNotification {
  id: string;
  kind: AdminNotificationKind;
  title: string;
  body: string;
  createdAt: string;
  readAt?: string;
  actorId?: string;
  actorName?: string;
  href?: string;
  relatedId?: string;
}
