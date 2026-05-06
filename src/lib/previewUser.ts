import type { UserProfile } from "../types";
import { getUsers, saveUser } from "./storage";
import previewBackgroundPhoto from "../assets/welcome/hero-2.png";
import previewProfilePhoto from "../assets/welcome/hero-1.png";

/** Stable id for local preview sessions (no password). */
export const PREVIEW_USER_ID = "mic_preview_guest";

export function ensurePreviewUser(): UserProfile {
  const users = getUsers();
  const existing = users[PREVIEW_USER_ID];
  if (existing?.onboardingComplete) {
    if (existing.profileImageDataUrl && existing.backgroundImageDataUrl && existing.statusLine) return existing;
    const next = {
      ...existing,
      statusLine: existing.statusLine || "Previewing the circle and getting a feel for the community.",
      profileImageDataUrl: existing.profileImageDataUrl || previewProfilePhoto,
      backgroundImageDataUrl: existing.backgroundImageDataUrl || previewBackgroundPhoto,
    };
    saveUser(next);
    return next;
  }

  const profile: UserProfile = {
    id: PREVIEW_USER_ID,
    email: "preview@innercircle.local",
    displayName: "Preview guest",
    bio: "Browsing in preview mode on this device only.",
    interests: ["Preview"],
    joinedCategories: ["community", "health", "career", "healing", "parenting"],
    isModerator: false,
    isSiteAdmin: false,
    onboardingComplete: true,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    statusLine: "Previewing the circle and getting a feel for the community.",
    profileImageDataUrl: previewProfilePhoto,
    backgroundImageDataUrl: previewBackgroundPhoto,
    phone: "",
    address: "",
    memberApprovalStatus: "approved",
  };
  saveUser(profile);
  return profile;
}

export function isPreviewUser(user: UserProfile | null): boolean {
  return user?.id === PREVIEW_USER_ID;
}
