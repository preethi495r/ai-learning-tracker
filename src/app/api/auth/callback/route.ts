// GET /api/auth/callback?code=…&state=…
// Verifies state (CSRF), exchanges the code for a token server-side, stores it in
// a short-lived httpOnly cookie, then redirects to /<track>?connected=1.
// The client secret NEVER leaves the server.

import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

export const runtime = "nodejs";

function verify(signed: string | undefined): { track: string } | null {
  if (!signed) return null;
  const dot = signed.lastIndexOf(".");
  if (dot < 0) return null;
  const value = signed.slice(0, dot);
  const mac = signed.slice(dot + 1);
  const secret = process.env.OAUTH_STATE_SECRET ?? "";
  const expected = createHmac("sha256", secret).update(value).digest("hex");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const track = value.split(":")[1];
  if (!track) return null;
  return { track };
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state") ?? undefined;
  const cookieState = req.cookies.get("oauth_state")?.value;

  const home = new URL("/", req.nextUrl.origin);

  // State must be present, match the cookie, and carry a valid signature.
  if (!code || !state || state !== cookieState) {
    home.searchParams.set("error", "oauth_state");
    return NextResponse.redirect(home);
  }
  const verified = verify(state);
  if (!verified) {
    home.searchParams.set("error", "oauth_state");
    return NextResponse.redirect(home);
  }

  const tokenRes = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    }
  );
  const tokenData = await tokenRes.json().catch(() => ({}));
  const token: string | undefined = tokenData.access_token;

  const dest = new URL(`/${verified.track}`, req.nextUrl.origin);
  if (!token) {
    dest.searchParams.set("error", "oauth_token");
    const res = NextResponse.redirect(dest);
    res.cookies.delete("oauth_state");
    return res;
  }

  dest.searchParams.set("connected", "1");
  const res = NextResponse.redirect(dest);
  // Token needed only to create the repo — short-lived, httpOnly.
  res.cookies.set("gh_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  res.cookies.delete("oauth_state");
  return res;
}
