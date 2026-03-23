import type { UserProfile } from "../types";
import { getUsers, saveUser } from "./storage";

/** Stable id for local preview sessions (no password). */
export const PREVIEW_USER_ID = "mic_preview_guest";

export function ensurePreviewUser(): UserProfile {
  const users = getUsers();
  const existing = users[PREVIEW_USER_ID];
  if (existing?.onboardingComplete) return existing;

  const profile: UserProfile = {
    id: PREVIEW_USER_ID,
    email: "preview@innercircle.local",
    displayName: "Preview guest",
    tier: "inner_circle",
    bio: "Browsing in preview mode on this device only.",
    interests: ["Preview"],
    joinedCategories: ["community", "health", "career", "healing", "parenting"],
    isModerator: false,
    onboardingComplete: true,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  saveUser(profile);
  return profile;
}

export function isPreviewUser(user: UserProfile | null): boolean {
  return user?.id === PREVIEW_USER_ID;
}
