# CLAUDE.md — AI Engineering Tracker

Context for Claude Code. Read `WEBSITE_SPEC.md` for the full brief; this is the load-every-session summary.

## What this is

A learning-tracker website for **two learners**, one track each, with shareable landing pages (`/frontendengineer`, `/biengineer`). A learner connects GitHub on her landing page; the app authorizes her via OAuth and **auto-creates her learning repo from a template**. Progress is then tracked from what she pushes.

## Who this is for (important)

**I am building this for two other people — the learners are not me.** Never wire my own GitHub account, identity, or repos into the progress tracking or repo creation. A learner's repo owner comes from *her* OAuth login (or the manual connect form), never from my local git config. Use `<owner>` / `<repo>` in examples, never my username. UI copy addresses the learner (she/her).

## Architecture — two responsibilities, split by trust

- **Progress tracking = NO backend.** The learner's repo is **public**. The browser makes ONE unauthenticated GitHub tree call and derives completion: a lesson is done ⇔ `${repoPath}/DONE.md` exists. Never route progress reads through a token or server route.
- **Auth + one-time repo creation = a tiny serverless backend.** Three Route Handlers (`/api/auth/login`, `/api/auth/callback`, `/api/repo/generate`) do GitHub OAuth and generate-from-template. Runs on Vercel Hobby (free).

## Hard constraints (do not violate)

- The **only** backend is OAuth + repo generation. No database, no progress store, no webhooks, no server session beyond the short-lived state/token cookies in the spec.
- `GITHUB_CLIENT_SECRET` is server-only and must never reach the client. OAuth scope stays minimal: **`public_repo`**.
- The OAuth token is used **only** to create the repo. After that, reads are public + client-side. Let the token cookie expire.
- Learner repos are **public**; placeholder files in templates are `notes.md` / `.gitkeep` — **never** `DONE.md`.
- Completion rule is the whole contract: `${repoPath}/DONE.md` exists. `repoPath` + `COMPLETION_MARKER` come from the curriculum files.
- Keep the frontend minimal (owner preference). No state managers, ORMs, or auth libraries — the OAuth flow is a few `fetch` calls. **No classes unless clearly necessary** — prefer function components + hooks.

## Tech stack

Next.js (App Router) + TypeScript + Tailwind. Serverless Route Handlers (Node runtime). localStorage for connection state + cached progress. Vercel free Hobby.

## Project structure

```
src/
  data/
    curriculum.ts        # biengineer track content + types
    curriculum-wife.ts   # frontendengineer track content
    tracks.ts            # composes both into Track[]
  lib/github.ts          # fetchRepoPaths() + computeCompletion()  (public reads)
  hooks/useConnection.ts # localStorage connection state per track + signOut
  hooks/useProgress.ts   # resolves connection, fetches tree, computes states
  app/api/auth/login/route.ts
  app/api/auth/callback/route.ts
  app/api/repo/generate/route.ts
  app/[track]/page.tsx           # connect card OR dashboard
  app/[track]/lesson/[id]/page.tsx
  components/            # ConnectCard, GoLocalPanel, ConnectionBadge, ProgressBar,
                        # LessonCard, StatusPill, ResourceList, RefreshButton, CopyCommand
```

## Track config

| slug              | curriculum          | default repo name        | template env key    |
| ----------------- | ------------------- | ------------------------ | ------------------- |
| frontendengineer  | curriculum-wife.ts  | fullstack-ai-journey     | FRONTEND_TEMPLATE   |
| biengineer        | curriculum.ts       | ai-engineering-journey   | BI_TEMPLATE         |

## Env vars (Vercel, server-only unless noted)

```
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
OAUTH_STATE_SECRET
FRONTEND_TEMPLATE=<you>/fullstack-ai-journey-template
BI_TEMPLATE=<you>/ai-engineering-journey-template
# OAUTH_REDIRECT_URI optional; otherwise derive from request origin
```

## Conventions

- Content changes go in the curriculum files only. Don't hardcode lessons in components.
- Every lesson page shows the exact done-command for that lesson's `repoPath`, with a copy button.
- Derive lesson counts from the data, never hardcode a number.
- Open external resource links in a new tab. Keep layout calm, legible, accessible.

## When unsure

Prefer the simplest thing that satisfies the completion rule and keeps progress reads public. If a feature would need a database, a persistent server session, or private-repo reads, it's out of scope — flag it instead of building it.
