// POST /api/repo/generate  body: { track, repoName }
// Reads the short-lived token cookie, resolves the track's template repo from
// server env, and creates the LEARNER's PUBLIC repo from that template.
// Owner = the authed user's login (never the builder's identity).

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const TEMPLATE_ENV: Record<
  string,
  "FRONTEND_TEMPLATE" | "BI_TEMPLATE" | "DA_TEMPLATE" | "PM_TEMPLATE"
> = {
  feengineer: "FRONTEND_TEMPLATE",
  biengineer: "BI_TEMPLATE",
  daengineer: "DA_TEMPLATE",
  aipm: "PM_TEMPLATE",
};

const GH = { Accept: "application/vnd.github+json" };

export async function POST(req: NextRequest) {
  const token = req.cookies.get("gh_token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Not authorized. Reconnect GitHub." },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const track: string = body.track ?? "";
  const repoName: string = (body.repoName ?? "").trim();

  const envKey = TEMPLATE_ENV[track];
  if (!envKey) {
    return NextResponse.json({ error: "Unknown track" }, { status: 400 });
  }
  if (!repoName) {
    return NextResponse.json({ error: "Missing repo name" }, { status: 400 });
  }

  const template = process.env[envKey];
  if (!template || !template.includes("/")) {
    return NextResponse.json(
      { error: `Server missing/invalid ${envKey}` },
      { status: 500 }
    );
  }
  const [templateOwner, templateRepo] = template.split("/");

  const auth = { ...GH, Authorization: `Bearer ${token}` };

  // Whose account the repo is created in — the learner who just authorized.
  const userRes = await fetch("https://api.github.com/user", { headers: auth });
  if (!userRes.ok) {
    return NextResponse.json(
      { error: "Could not read GitHub user — token expired?" },
      { status: 401 }
    );
  }
  const login: string = (await userRes.json()).login;

  const genRes = await fetch(
    `https://api.github.com/repos/${templateOwner}/${templateRepo}/generate`,
    {
      method: "POST",
      headers: auth,
      body: JSON.stringify({
        owner: login,
        name: repoName,
        private: false,
        include_all_branches: false,
      }),
    }
  );

  if (genRes.status === 201) {
    const res = NextResponse.json({
      owner: login,
      repo: repoName,
      branch: "main",
    });
    res.cookies.delete("gh_token"); // token no longer needed; reads are public
    return res;
  }

  // 422 = repo name already exists in the account. Offer to connect it instead.
  if (genRes.status === 422) {
    return NextResponse.json(
      {
        alreadyExists: true,
        owner: login,
        repo: repoName,
        branch: "main",
        error: `A repo named "${repoName}" already exists.`,
      },
      { status: 200 }
    );
  }

  const detail = await genRes.json().catch(() => ({}));
  return NextResponse.json(
    { error: detail.message || `GitHub error ${genRes.status}` },
    { status: 502 }
  );
}
