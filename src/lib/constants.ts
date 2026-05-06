/** Public nonprofit homepage (marketing QR, redirects). */
export const PUBLIC_WEBSITE_URL = "https://www.myinnercircleinc.org";

/** Seeded site admin (local demo only — rotate before production). Used in `seed.ts`, Login hints, and admin UI. */
export const DEMO_SITE_ADMIN_EMAIL = "siteadmin@test.com";
export const DEMO_SITE_ADMIN_PASSWORD = "SA123456!";
export const DEMO_SITE_ADMIN_DISPLAY_NAME = "Site Administrator";

/** Set `VITE_ZEFFY_URL` in `.env.local` to your nonprofit’s Zeffy campaign or embed target. */
export function getMonetaryGivingUrl(): string {
  const v = import.meta.env.VITE_ZEFFY_URL as string | undefined;
  return v && v.length > 0 ? v : "https://www.zeffy.com/";
}

/** ICS / branding */
export const CALENDAR_PRODUCT_ID = "-//My Inner Circle//EN";
