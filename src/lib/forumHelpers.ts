import type { ForumCategorySlug } from "../types";
import { getComments } from "./storage";

export const CATEGORY_SHORT_LABEL: Record<ForumCategorySlug, string> = {
  health: "Health",
  career: "Career",
  healing: "Healing",
  parenting: "Parenting",
  community: "Community",
};

export const HUB_BANNER: Record<ForumCategorySlug, string> = {
  health: "linear-gradient(125deg, #4a7c78 0%, #5a9a94 45%, #7d6b93 100%)",
  career: "linear-gradient(125deg, #7d6b93 0%, #9b87b3 50%, #4a7c78 100%)",
  healing: "linear-gradient(125deg, #e8b4b8 0%, #c98a8f 40%, #7d6b93 100%)",
  parenting: "linear-gradient(125deg, #c5ddd9 0%, #4a7c78 55%, #3a635f 100%)",
  community: "linear-gradient(125deg, #dcd4e8 0%, #7d6b93 45%, #e8b4b8 100%)",
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
