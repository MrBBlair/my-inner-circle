import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UserProfile } from "../types";
import { ensureSeedData } from "../lib/seed";
import {
  getSessionUserId,
  getUsers,
  normalizeUser,
  pushAdminNotification,
  saveUser,
  setSessionUserId,
} from "../lib/storage";
import { notifyServerSignup } from "../lib/apiClient";
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
    phone: string;
    address: string;
    birthdateISO: string;
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
    return u ? normalizeUser(u) : null;
  });

  const refreshUser = useCallback(() => {
    const id = getSessionUserId();
    if (!id) {
      setUser(null);
      return;
    }
    const u = getUsers()[id];
    setUser(u ? normalizeUser(u) : null);
  }, []);

  const enterPreview = useCallback(() => {
    const profile = ensurePreviewUser();
    setSessionUserId(profile.id);
    setUser(normalizeUser(profile));
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
    setUser(normalizeUser(found));
    return { ok: true };
  }, []);

  const signup = useCallback(
    (input: {
      email: string;
      password: string;
      displayName: string;
      phone: string;
      address: string;
      birthdateISO: string;
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
        bio: "",
        interests: [],
        joinedCategories: [],
        isModerator: false,
        isSiteAdmin: false,
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
        phone: input.phone.trim(),
        city: "",
        address: input.address.trim(),
        birthdateISO: input.birthdateISO,
        memberApprovalStatus: "pending",
      };

      saveUser(profile);
      pushAdminNotification({
        kind: "member_signup",
        title: "New member application",
        body: `${profile.displayName} signed up and needs membership approval.`,
        actorId: profile.id,
        actorName: profile.displayName,
        href: "/admin",
        relatedId: profile.id,
      });
      setStoredPassword(id, input.password);
      void notifyServerSignup(profile);
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
    const next = normalizeUser({ ...current, ...patch });
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
