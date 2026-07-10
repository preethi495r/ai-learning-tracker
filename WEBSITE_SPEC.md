# AI Engineering Tracker — Build Spec (Option B: OAuth + auto-create)

A personal learning-tracker website for **two learners**, each with her own curriculum ("track"). Each track has a shareable landing page. On that page a learner clicks **Connect GitHub**; the app authorizes her via GitHub OAuth and **automatically creates her learning repo** (pre-populated from a template). From then on, the site tracks her progress from what she pushes to that repo, and shows the next lesson.

This document is the build brief for **Claude Code**. Curriculum content is in `curriculum.ts` and `curriculum-wife.ts`.

---

## 1. Architecture at a glance

Two responsibilities, split by trust level:

- **Progress tracking — no backend.** A learner's repo is **public**. The browser makes one unauthenticated GitHub API call to read the repo's file tree and derive progress. A lesson is complete when `${repoPath}/DONE.md` exists. This never needs a token.
- **Auth + one-time repo creation — a tiny serverless backend.** Three Vercel serverless routes handle GitHub OAuth and creating the learner's repo from a template. The GitHub client secret lives only in server env vars. This runs on Vercel's **free Hobby tier** (a few invocations per learner).

```
Landing page /[track]
   │  "Connect GitHub"
   ▼
/api/auth/login ─→ GitHub OAuth ─→ /api/auth/callback (exchanges code→token, httpOnly cookie)
   │
   ▼
/api/repo/generate  ── generate-from-template ──▶  learner's new PUBLIC repo (pre-filled)
   │
   ▼
Dashboard /[track]  ── one unauthenticated tree read ──▶  progress + next lesson
```

**Design rule:** the token is used only to create the repo. All ongoing progress reads are public + client-side. Never route progress reads through the token.

---

## 2. Tech stack

- **Next.js (App Router) + TypeScript + Tailwind CSS.** Minimal, matches owner preference.
- **Serverless Route Handlers** for the three auth/repo endpoints (Node runtime).
- **No database.** localStorage holds the learner's `{owner, repo, branch}` and cached progress. The OAuth token lives only in a short-lived httpOnly cookie during creation.
- **Vercel** (free Hobby) for hosting + serverless.

Keep it small: no state managers, no ORMs, no auth libraries — the OAuth flow is a few lines of fetch.

---

## 3. Tracks & landing pages

Two tracks, each its own shareable URL (there is no shared home page — share the deep links):

| Track slug         | Learner              | Curriculum file       | Default repo name         | Template repo (server env)     |
| ------------------ | -------------------- | --------------------- | ------------------------- | ------------------------------ |
| `frontendengineer` | wife (Full-Stack AI) | `curriculum-wife.ts`  | `fullstack-ai-journey`    | `FRONTEND_TEMPLATE`            |
| `biengineer`       | sister-in-law (AI Eng)| `curriculum.ts`      | `ai-engineering-journey`  | `BI_TEMPLATE`                  |

- `/frontendengineer` and `/biengineer` are the landing/dashboard pages.
- `/` may 404 or redirect to a neutral "pick your link" note; it is never shared.
- Both curriculum files export the same shape (`lessons`, `PASSES`, `COMPLETION_MARKER`, helpers). Compose them in `src/data/tracks.ts`:

```ts
import { lessons as biLessons, PASSES as biPasses } from "./curriculum";
import { lessons as feLessons, PASSES as fePasses } from "./curriculum-wife";

export interface Track {
  slug: "frontendengineer" | "biengineer";
  label: string;
  lessons: typeof biLessons;
  passes: typeof biPasses;
  defaultRepoName: string;
  templateEnvKey: "FRONTEND_TEMPLATE" | "BI_TEMPLATE";
}

export const tracks: Track[] = [ /* build from the two imports */ ];
export const getTrack = (slug: string) => tracks.find((t) => t.slug === slug);
```

---

## 4. Data model

Use the curriculum files as-is. Shapes (defined there):

```ts
type ResourceType = "video" | "docs" | "article" | "course" | "interactive";
interface Resource { title: string; url: string; type: ResourceType; note?: string }
interface Lesson {
  id: string; pass: 1 | 2; order: number; repoPath: string;
  title: string; objective: string; topics: string[]; build: string;
  resources: Resource[];
}
export const COMPLETION_MARKER = "DONE.md";
```

UI works with `LessonState = Lesson & { complete: boolean; isNext: boolean }`.

---

## 5. Progress logic (public, client-side — unchanged by OAuth)

One request gets the whole tree. `lib/github.ts`:

```ts
import { COMPLETION_MARKER } from "@/data/curriculum";

export async function fetchRepoPaths(
  owner: string, repo: string, branch = "main"
): Promise<string[]> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" }
  );
  if (res.status === 404) throw new Error("Repo or branch not found (is it public? is the branch 'main'?)");
  if (res.status === 403) throw new Error("GitHub rate limit hit — try again shortly.");
  if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
  const data = await res.json();
  return (data.tree ?? []).map((n: { path: string }) => n.path);
}

export function computeCompletion(paths: string[]): Set<string> {
  const suffix = "/" + COMPLETION_MARKER;
  const done = new Set<string>();
  for (const p of paths) if (p.endsWith(suffix)) done.add(p.slice(0, -suffix.length));
  return done;
}
```

`useProgress(track)`:
1. Read `{owner, repo, branch}` from localStorage (keyed by track slug).
2. `fetchRepoPaths` → `computeCompletion`.
3. Map over the track's `orderedLessons()` → attach `complete`.
4. `isNext` = first lesson in order with `complete === false`.
5. Cache states in localStorage (per track); show cached instantly, then revalidate.

**Rate limits:** unauthenticated GitHub allows ~60 req/hour/IP; one request per load/refresh is fine.

---

## 6. Auth + repo creation (the serverless backend)

Three Route Handlers. The GitHub OAuth **client secret** is a server-only env var and must never reach the client. Request scope **`public_repo`** (create/read public repos only — minimal).

### 6.1 `GET /api/auth/login?track=<slug>`
- Generate a random `state`; store it (and the track) in a short-lived httpOnly cookie.
- Redirect to:
  `https://github.com/login/oauth/authorize?client_id=…&redirect_uri=<origin>/api/auth/callback&scope=public_repo&state=…`

### 6.2 `GET /api/auth/callback?code=…&state=…`
- Verify `state` matches the cookie (CSRF protection).
- Exchange the code for a token (server-side POST to `https://github.com/login/oauth/access_token` with `client_id`, `client_secret`, `code`).
- Set the token in an httpOnly, Secure, SameSite=Lax cookie (short maxAge — it's only needed to create the repo).
- Redirect back to `/<track>?connected=1`.

### 6.3 `POST /api/repo/generate`  body: `{ track, repoName }`
- Read the token cookie. Look up the track's template repo from server env (`FRONTEND_TEMPLATE` / `BI_TEMPLATE`, each `owner/name`).
- Get the authed user's login: `GET https://api.github.com/user`.
- Create the repo from template:
  `POST https://api.github.com/repos/{templateOwner}/{templateRepo}/generate`
  headers `Accept: application/vnd.github+json`, `Authorization: Bearer <token>`
  body `{ owner: <login>, name: <repoName>, private: false, include_all_branches: false }`
- On success: return `{ owner: <login>, repo: <repoName>, branch: "main" }`.
- Handle **422 already exists**: return a flag so the UI offers "just connect the existing repo" instead.
- The client then stores `{owner, repo, branch}` in localStorage (this is the "connected" state) and routes to the dashboard.

> After generation the token is no longer needed. Let the cookie expire or clear it; ongoing reads are public.

### Env vars (set in Vercel project settings)
Server-only (secret):
```
GITHUB_CLIENT_ID=…
GITHUB_CLIENT_SECRET=…
OAUTH_STATE_SECRET=…                # random string to sign/verify state
FRONTEND_TEMPLATE=<you>/fullstack-ai-journey-template
BI_TEMPLATE=<you>/ai-engineering-journey-template
```
`redirect_uri` is derived from the request origin (works for localhost + prod) or set `OAUTH_REDIRECT_URI` explicitly.

See `OAUTH_SETUP.md` for the GitHub OAuth App creation checklist.

---

## 7. Connect experience (on each landing page)

`/[track]` when **not connected** shows a focused connect card:
- Headline for the track ("Your Full-Stack + AI journey" / "Your AI Engineering journey").
- Primary button **"Connect GitHub & create my repo"** → `GET /api/auth/login?track=<slug>`.
- A pre-filled, editable **repo name** field (track default).
- Small print: this authorizes the app to create one public repo in your account (scope `public_repo`); nothing else. It's your repo.
- Secondary option **"I already have my repo"** → a manual connect form (owner/repo/branch) that validates via `fetchRepoPaths` and stores to localStorage. This is the fallback for a returning learner on a new device (no OAuth needed to just read a public repo).

After OAuth returns (`?connected=1`), auto-call `/api/repo/generate` with the chosen name, then:
- On success → store connection, show a **"Go local"** panel with a copy-able:
  ```
  git clone https://github.com/<owner>/<repo>.git
  cd <repo>
  ```
  and an optional **"Download starter .zip"** link (same files) for anyone who prefers not to clone.
- Then render the dashboard.

`/[track]` when **connected**: the dashboard (section 8), with a "Connected as `owner/repo`" badge + Sign out (clears that track's localStorage) + a link back to the clone panel.

---

## 8. Pages & routes

- `GET /api/auth/login`, `GET /api/auth/callback`, `POST /api/repo/generate` — section 6.
- `/[track]` — landing + connect card when not connected; dashboard when connected:
  - Header: track title, overall progress (`X / N`, percent), connection badge + Sign out.
  - "Current lesson" callout = the `isNext` lesson.
  - Pass 1 / Pass 2 sections; each lesson a card (number, title, one-line objective, status pill, resource count).
  - Refresh button (re-reads the tree).
  - Guard: unknown slug → 404.
- `/[track]/lesson/[id]` — lesson detail:
  - Objective, "What you'll cover" (topics), "Build this" (`build`).
  - **Mark it done** block: the exact `touch <repoPath>/DONE.md && git add -A && git commit -m "done: <id>" && git push`, with copy button.
  - **Learning material**: the `resources` list, tagged by `type`, opening in new tabs.
  - Prev / Next in curriculum order. Unknown id → 404.

Keep the reading UI calm, legible, responsive, and accessible (single column, generous line-height, one accent color, clear checkmarks).

---

## 9. Components (suggested)

- `ConnectCard` — the OAuth CTA + repo-name field + "already have a repo" fallback form.
- `GoLocalPanel` — the `git clone` block (+ optional zip download).
- `ConnectionBadge` — "Connected as owner/repo" + Sign out.
- `ProgressBar`, `LessonCard`, `StatusPill`, `ResourceList`, `RefreshButton`, `CopyCommand`.
- Hooks: `useConnection(track)` (localStorage connection state + signOut), `useProgress(track)`.

No classes unless clearly necessary (owner preference) — function components + hooks.

---

## 10. Build order for Claude Code

1. Scaffold Next.js + TypeScript + Tailwind (App Router). Write the repo-root `CLAUDE.md` first (adapt the provided one).
2. Add `curriculum.ts` + `curriculum-wife.ts` to `src/data/`; build `tracks.ts` (section 3).
3. `lib/github.ts` (section 5) + `useProgress`.
4. The three serverless routes (section 6) + `useConnection`. Keep the secret server-side.
5. `/[track]` connect card (`ConnectCard`) → OAuth → auto-generate → `GoLocalPanel`.
6. `/[track]` dashboard (guarded by connection) with progress UI.
7. `/[track]/lesson/[id]` with the done-block + resources.
8. localStorage caching + Refresh; 404s for unknown track/lesson.
9. Polish: loading/error states, 422-already-exists handling, sign-out.
10. Deploy (section 11).

---

## 11. Deploy (GitHub + Vercel)

1. Create the two **template repos** on GitHub from the provided starter zips, and mark each as a **Template repository** (Settings → check "Template repository"). Keep them public.
2. Create a **GitHub OAuth App** (see `OAUTH_SETUP.md`); note the Client ID + generate a Client Secret.
3. Push the tracker app to its own GitHub repo; import to Vercel.
4. Set env vars (section 6): client id/secret, state secret, and the two `*_TEMPLATE` values.
5. Set the OAuth App's callback URL to `https://<your-vercel-domain>/api/auth/callback` (add the localhost one too for dev).
6. Share `https://<domain>/frontendengineer` and `https://<domain>/biengineer`.

All of this fits Vercel Hobby (free) and public GitHub repos — no paid plan required.

---

## 12. Constraints (do not violate)

- **Progress is git-derived and read client-side from a public repo.** Never gate progress reads behind the token or a server route.
- The **only** backend is: OAuth login/callback + repo generation. Don't add a database, a progress store, webhooks, or server-side session beyond the short-lived cookies described.
- **Secret stays server-side.** `GITHUB_CLIENT_SECRET` never ships to the client. Scope stays minimal (`public_repo`).
- Placeholder files in templates are `notes.md`/`.gitkeep` — **never** `DONE.md` (that would mark lessons complete).
- Repo identities come from OAuth (the authed user) or the manual connect form — **never** from the builder's own git identity.
- Keep the frontend minimal; no classes unless necessary.
