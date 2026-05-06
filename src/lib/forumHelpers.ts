import type { ForumCategorySlug } from "../types";
import { getComments } from "./storage";

/** URL-safe slug for neighborhood circle requests */
export function slugifyForumSlug(raw: string): string {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return s.length > 0 ? s : "circle";
}

export const CATEGORY_SHORT_LABEL: Record<ForumCategorySlug, string> = {
  health: "Health",
  career: "Career",
  healing: "Healing",
  parenting: "Parenting",
  community: "Community",
};

export const HUB_BANNER: Record<ForumCategorySlug, string> = {
  health: "linear-gradient(125deg, #6b3fa0 0%, #892456 48%, #5c1538 100%)",
  career: "linear-gradient(125deg, #b4233d 0%, #892456 50%, #6b3fa0 100%)",
  healing: "linear-gradient(125deg, #ea8f80 0%, #892456 42%, #6b3fa0 100%)",
  parenting: "linear-gradient(125deg, #f5d9e9 0%, #ea8f80 50%, #892456 100%)",
  community: "linear-gradient(125deg, #ebe0f7 0%, #892456 42%, #ea8f80 92%)",
};

export function avatarToneClass(name: string): string {
  const tones = ["nd-avatar--teal", "nd-avatar--purple", "nd-avatar--blush", "nd-avatar--ink"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i) * (i + 1)) % 997;
  return tones[h % tones.length] ?? tones[0];
}

export function formatRelativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  const now = Date.now();
  const sec = Math.floor((now - t) / 1000);
  if (sec < 45) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function displayInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function commentCountForThread(threadId: string): number {
  return getComments().filter((c) => c.threadId === threadId).length;
}
