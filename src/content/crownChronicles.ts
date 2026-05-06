import type { CrownBlogPost } from "../types";
import { getAdminCrownBlogPosts } from "../lib/storage";
import { CROWN_BLOG_SCHEDULE } from "./crownBlogData";
import missionFriends from "../assets/welcome/official/mission-female-friends.jpg";

export type { CrownBlogPost } from "../types";

/** Stored in localStorage for admin-created posts without a custom image. */
export const CROWN_BLOG_DEFAULT_HERO_SENTINEL = "__mic_default_blog_hero__";

const ALL_SCHEDULED = CROWN_BLOG_SCHEDULE as unknown as CrownBlogPost[];

function mergeScheduledWithAdmin(): CrownBlogPost[] {
  const admin = getAdminCrownBlogPosts();
  const reserved = new Set(admin.map((p) => p.slug));
  const out: CrownBlogPost[] = [...admin];
  for (const p of ALL_SCHEDULED) {
    if (!reserved.has(p.slug)) out.push(p);
  }
  return out;
}

/** Every scheduled + admin blog (any `releaseDateISO`). Use for calendar and planning views. */
export function getAllCrownBlogPostsMerged(): CrownBlogPost[] {
  return mergeScheduledWithAdmin();
}

/** Resolve hero image for hub + article pages (admin default sentinel → bundled asset). */
export function resolveCrownBlogHeroSrc(post: CrownBlogPost): string {
  if (post.src === CROWN_BLOG_DEFAULT_HERO_SENTINEL) return missionFriends;
  return post.src;
}

export function crownBlogReleaseStart(post: CrownBlogPost): Date {
  const [y, m, d] = post.releaseDateISO.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

export function isCrownBlogReleased(post: CrownBlogPost, now: Date = new Date()): boolean {
  return now.getTime() >= crownBlogReleaseStart(post).getTime();
}

/** Newest first — only posts whose release date has passed (scheduled + admin). */
export function getReleasedCrownBlogPosts(now: Date = new Date()): CrownBlogPost[] {
  return getAllCrownBlogPostsMerged()
    .filter((p) => isCrownBlogReleased(p, now))
    .sort((a, b) => {
      const byDate = b.releaseDateISO.localeCompare(a.releaseDateISO);
      return byDate !== 0 ? byDate : b.id.localeCompare(a.id);
    });
}

export function getCrownBlogPost(
  slug: string | undefined,
  now: Date = new Date(),
): CrownBlogPost | undefined {
  if (!slug) return undefined;
  const match = getAllCrownBlogPostsMerged().find((p) => p.slug === slug);
  if (!match || !isCrownBlogReleased(match, now)) return undefined;
  return match;
}

/** Built-in schedule only (not admin entries). */
export function getAllScheduledCrownBlogPosts(): CrownBlogPost[] {
  return ALL_SCHEDULED;
}

/** All slugs that exist in either schedule or admin storage (for collision checks). */
export function getAllCrownBlogSlugs(): string[] {
  const s = new Set<string>();
  for (const p of ALL_SCHEDULED) s.add(p.slug);
  for (const p of getAdminCrownBlogPosts()) s.add(p.slug);
  return [...s];
}
