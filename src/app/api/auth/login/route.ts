// GET /api/auth/login?track=<slug>
// Starts GitHub OAuth: sets a short-lived httpOnly state cookie (CSRF), then
// redirects to GitHub's authorize page. Scope is minimal: public_repo.

import { NextRequest, NextResponse } from "next/server";
import { createHmac, randomUUID } from "crypto";

export const runtime = "nodejs";

const VALID_TRACKS = new Set(["feengineer", "biengineer", "daengineer"]);

function redirectUri(req: NextRequest): string {
  if (process.env.OAUTH_REDIRECT_URI) return process.env.OAUTH_REDIRECT_URI;
  return `${req.nextUrl.origin}/api/auth/callback`;
}

// Sign the state with the server secret so the callback can verify it wasn't forged.
function sign(value: string): string {
  const secret = process.env.OAUTH_STATE_SECRET ?? "";
  const mac = createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${mac}`;
}

export function GET(req: NextRequest) {
  const track = req.nextUrl.searchParams.get("track") ?? "";
  if (!VALID_TRACKS.has(track)) {
    return NextResponse.json({ error: "Unknown track" }, { status: 400 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "Server missing GITHUB_CLIENT_ID" },
      { status: 500 }
    );
  }

  const nonce = randomUUID();
  const state = sign(`${nonce}:${track}`);

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", redirectUri(req));
  authorize.searchParams.set("scope", "public_repo");
  authorize.searchParams.set("state", state);

  const res = NextResponse.redirect(authorize.toString());
  res.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes — long enough to authorize, short-lived otherwise
  });
  return res;
}
