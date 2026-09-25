import { NextRequest, NextResponse } from "next/server";
import { adminCookieName, adminToken } from "../../../../lib/adminAuth";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") || "");
  const configured = process.env.ADMIN_PASSWORD || "";

  if (!configured) {
    return NextResponse.redirect(new URL("/admin/login?error=not-configured", request.url), 303);
  }

  if (password !== configured) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/admin/orders", request.url), 303);
  response.cookies.set(adminCookieName, adminToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
