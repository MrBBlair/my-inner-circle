import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MembershipTier, UserProfile } from "../types";
import { ensureSeedData } from "../lib/seed";
import {
  getSessionUserId,
  getUsers,
  saveUser,
  setSessionUserId,
} from "../lib/storage";
import { checkStoredPassword, setStoredPassword } from "../lib/passwordStore";
import { ensurePreviewUser } from "../lib/previewUser";

type AuthContextValue = {
  user: UserProfile | null;
  refreshUser: () => void;
  enterPreview: () => void;
  login: (email: string, password: string) => { ok: boolean; message?: string };
  signup: (input: {
    email: string;
    password: string;
    displayName: string;
    tier: MembershipTier;
  }) => { ok: boolean; message?: string };
  logout: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  ensureSeedData();

  const [user, setUser] = useState<UserProfile | null>(() => {
    const id = getSessionUserId();
    if (!id) return null;
    const u = getUsers()[id];
    return u ?? null;
  });

  const refreshUser = useCallback(() => {
    const id = getSessionUserId();
    if (!id) {
      setUser(null);
      return;
    }
    setUser(getUsers()[id] ?? null);
  }, []);

  const enterPreview = useCallback(() => {
    const profile = ensurePreviewUser();
    setSessionUserId(profile.id);
    setUser(profile);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const e = normalizeEmail(email);
    const users = getUsers();
    const found = Object.values(users).find(
      (u) => normalizeEmail(u.email) === e,
    );
    if (!found) return { ok: false, message: "No account found for that email." };
    if (!checkStoredPassword(found.id, password))
      return { ok: false, message: "Incorrect password." };
    setSessionUserId(found.id);
    setUser(found);
    return { ok: true };
  }, []);

  const signup = useCallback(
    (input: {
      email: string;
      password: string;
      displayName: string;
      tier: MembershipTier;
    }) => {
      const e = normalizeEmail(input.email);
      const users = getUsers();
      const exists = Object.values(users).some(
        (u) => normalizeEmail(u.email) === e,
      );
      if (exists) return { ok: false, message: "An account with this email already exists." };

      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `u_${Date.now()}`;

      const profile: UserProfile = {
        id,
        email: e,
        displayName: input.displayName.trim(),
        tier: input.tier,
        bio: "",
        interests: [],
        joinedCategories: [],
        isModerator: false,
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
      };

      saveUser(profile);
      setStoredPassword(id, input.password);
      setSessionUserId(id);
      setUser(profile);
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(() => {
    setSessionUserId(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    const id = getSessionUserId();
    if (!id) return;
    const current = getUsers()[id];
    if (!current) return;
    const next = { ...current, ...patch };
    saveUser(next);
    setUser(next);
  }, []);

  const value = useMemo(
    () => ({
      user,
      refreshUser,
      enterPreview,
      login,
      signup,
      logout,
      updateProfile,
    }),
    [user, refreshUser, enterPreview, login, signup, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
