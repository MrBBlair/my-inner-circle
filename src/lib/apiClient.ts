import type { UserProfile } from "../types";

const base = (): string =>
  typeof import.meta.env.VITE_API_BASE === "string" ? import.meta.env.VITE_API_BASE : "/api";


export async function notifyServerSignup(
  profile: Pick<
    UserProfile,
    | "id"
    | "email"
    | "displayName"
    | "birthdateISO"
    | "phone"
    | "city"
    | "address"
    | "memberApprovalStatus"
  >,
): Promise<void> {
  try {
    await fetch(`${base()}/registry/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: profile.id,
        email: profile.email,
        displayName: profile.displayName,
        birthdateISO: profile.birthdateISO ?? "",
        phone: profile.phone ?? "",
        city: profile.city ?? "",
        address: profile.address ?? "",
        memberApprovalStatus: profile.memberApprovalStatus ?? "pending",
      }),
    });
  } catch {
    /* Offline or API down — SPA still works */
  }
}

export async function apiBulkEmail(
  adminSecret: string,
  payload: { bccRecipients: string[]; subject: string; htmlBody: string },
): Promise<{ ok: boolean; error?: string }> {
  try {
    const r = await fetch(`${base()}/admin/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminSecret}`,
      },
      body: JSON.stringify(payload),
    });
    const j = (await r.json()) as { ok?: boolean };
    return r.ok && j.ok ? { ok: true } : { ok: false, error: "Request failed" };
  } catch {
    return { ok: false, error: "network" };
  }
}

export async function apiBirthdaySweep(adminSecret: string): Promise<{ ok: boolean }> {
  try {
    const r = await fetch(`${base()}/jobs/birthdays`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminSecret}` },
    });
    const j = (await r.json()) as { ok?: boolean };
    return r.ok && j.ok ? { ok: true } : { ok: false };
  } catch {
    return { ok: false };
  }
}
