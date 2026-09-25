import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "anna_moga_admin";

export function adminToken() {
  const password = process.env.ADMIN_PASSWORD || "";
  return password ? createHash("sha256").update("anna-moga-admin:" + password).digest("hex") : "";
}

export async function isAdminAuthenticated() {
  const expected = adminToken();
  if (!expected) return false;

  const store = await cookies();
  const actual = store.get(COOKIE_NAME)?.value || "";

  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const adminCookieName = COOKIE_NAME;
