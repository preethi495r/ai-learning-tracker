# CLAUDE.md — AI Engineering Tracker

Context for Claude Code. Read `WEBSITE_SPEC.md` for the full brief; this is the load-every-session summary.

## What this is

A learning-tracker website with **three career-transition tracks**, each a shareable landing page (`/feengineer`, `/biengineer`, `/daengineer`), plus a **home page** (`/`) that explains the tracks and a **quiz recommender** (`/find-your-path`). A learner connects GitHub on her landing page; the app authorizes her via OAuth and **auto-creates her learning repo from a template**. Progress is then tracked from what she pushes.

> This started as a two-learner build; it has since grown to three tracks + a home/quiz. See **Current state & decisions** at the bottom for everything added after the original spec.

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
    curriculum-wife.ts   # feengineer track content
    curriculum-da.ts     # daengineer track content
    tracks.ts            # composes all three into Track[] (getTrack, orderedLessons, lessonsByPass)
  lib/github.ts          # fetchRepoPaths() + computeCompletion()  (public reads; retries 409 while a new repo initializes)
  hooks/useConnection.ts # localStorage connection state per track + signOut
  hooks/useProgress.ts   # resolves connection, fetches tree, computes states
  app/api/auth/login/route.ts     # VALID_TRACKS set lists the 3 slugs
  app/api/auth/callback/route.ts
  app/api/repo/generate/route.ts  # TEMPLATE_ENV map: slug -> *_TEMPLATE env key
  app/page.tsx                   # HOME: hero + 3 persona cards + Find-your-path card + 3-step strip
  app/find-your-path/page.tsx    # QUIZ recommender (client, no backend). Static route beats /[track]
  app/[track]/page.tsx           # connect card OR dashboard
  app/[track]/lesson/[id]/page.tsx
  components/            # ConnectCard, GoLocalPanel, ConnectionBadge, ProgressBar,
                        # LessonCard, StatusPill, ResourceList, RefreshButton, CopyCommand
```

> The repo-ROOT `curriculum.ts` / `curriculum-wife.ts` are stale original-delivery copies — the app ONLY reads `src/data/*`. Edit content in `src/data/`. (Root copies can be deleted; left in place for now.)

## Track config

| slug          | curriculum          | default repo name        | template env key    |
| ------------- | ------------------- | ------------------------ | ------------------- |
| feengineer    | curriculum-wife.ts  | fullstack-ai-journey     | FRONTEND_TEMPLATE   |
| biengineer    | curriculum.ts       | ai-engineering-journey   | BI_TEMPLATE         |
| daengineer    | curriculum-da.ts    | data-analyst-ai-journey  | DA_TEMPLATE         |
| aipm          | curriculum-pm.ts    | ai-pm-journey            | PM_TEMPLATE         |

> Slug note: the frontend track slug was renamed `frontendengineer` → **`feengineer`** (old path 404s). `daengineer` (Data Analyst → AI Engineer) was added later, then **`aipm`** (Product Manager → AI Product Manager — the first track whose destination is NOT "AI Engineer"). `getTrack`/`tracks` live in `src/data/tracks.ts` (aliased imports of the four curriculum files).

## Env vars (Vercel, server-only unless noted)

```
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
OAUTH_STATE_SECRET
FRONTEND_TEMPLATE=harigovind-s-menon/fullstack-ai-journey-template
BI_TEMPLATE=harigovind-s-menon/ai-engineering-journey-template
DA_TEMPLATE=harigovind-s-menon/data-analyst-ai-journey-template
PM_TEMPLATE=harigovind-s-menon/ai-pm-journey-template
OAUTH_REDIRECT_URI=https://ai-tracker-eight-ebon.vercel.app/api/auth/callback
```

All of the above are set in Vercel (Production) and mirrored in local `.env.local`. `OAUTH_REDIRECT_URI` is pinned (not derived) so OAuth works regardless of which Vercel alias is hit — it MUST equal the GitHub OAuth App's Authorization callback URL.

## Conventions

- Content changes go in the curriculum files only. Don't hardcode lessons in components.
- Every lesson page shows the exact done-command for that lesson's `repoPath`, with a copy button.
- Derive lesson counts from the data, never hardcode a number.
- Open external resource links in a new tab. Keep layout calm, legible, accessible.

## When unsure

Prefer the simplest thing that satisfies the completion rule and keeps progress reads public. If a feature would need a database, a persistent server session, or private-repo reads, it's out of scope — flag it instead of building it.

---

# Current state & decisions (resume here)

Everything below reflects work done after the original spec. Read it before resuming.

## Live deployment
- **Owner GitHub account:** `harigovind-s-menon` (owns the app repo + the 3 template repos). This is the *builder*, not a learner — never wire it into progress/repo-creation logic.
- **App repo (private):** `github.com/harigovind-s-menon/ai-tracker`.
- **Vercel project:** `harigovind-ss-projects/ai-tracker` (a *different* Vercel account/team, `harigovindsmenon14-7798`). Git-connected → **push to `main` auto-deploys to Production**.
- **Production domain (stable alias):** `https://ai-tracker-eight-ebon.vercel.app`
  - Share links: `/feengineer`, `/biengineer`, `/daengineer`, or the home `/`. Quiz at `/find-your-path`.
- **GitHub OAuth App** client id `Ov23lifcOFLWUMynMv8E`; its Authorization callback URL is set to `https://ai-tracker-eight-ebon.vercel.app/api/auth/callback` and MUST match `OAUTH_REDIRECT_URI`. (One callback per OAuth App — changing the domain means updating both the OAuth App and the env var.)

## Deploying / CLI gotchas (corporate-proxy machine)
- Preferred deploy: **just `git push`** (auto-deploys). 
- Manual deploy needs the Vercel CLI **and** a CA bundle (Node rejects the corporate MITM cert otherwise):
  ```
  export NODE_EXTRA_CA_CERTS=/Users/<you>/.system-ca.pem
  vercel --prod --yes        # vercel binary: ~/.nvm/versions/node/v24.15.0/bin/vercel
  ```
  `~/.system-ca.pem` was built from the macOS keychains (`security find-certificate -a -p ...`). Every `vercel` invocation needs `NODE_EXTRA_CA_CERTS`. `vercel ls`'s status column renders oddly through the CLI (`UNKNOWN`); verify deploys by curling the live URL instead.

## ⚠️ Git commit-author gotcha (caused failed deploys)
Vercel's git integration attributes each deploy to the **commit author email** and rejects authors not connected to the Vercel account. Early commits used a bogus `menon@users.noreply.github.com` and were rejected ("deploy from a different account").
- **Fix in place:** repo git config is set to the real identity — `user.name=harigovind-s-menon`, `user.email=25458596+harigovind-s-menon@users.noreply.github.com`. All new commits must use this. Don't pass a made-up `-c user.email`.
- **Outstanding (optional):** the very first commit on `origin/main` still carries the old placeholder author. Harmless (never HEAD, never deployed). A local history-scrub (`git filter-branch`) was done but the force-push to remote was declined, so remote history is un-scrubbed. To finish: `git push --force origin main` from a scrubbed local — otherwise leave it.

## Template repos (public, "Template repository" flag ON, under harigovind-s-menon)
- `fullstack-ai-journey-template` → FRONTEND_TEMPLATE (feengineer)
- `ai-engineering-journey-template` → BI_TEMPLATE (biengineer)
- `data-analyst-ai-journey-template` → DA_TEMPLATE (daengineer)
- `ai-pm-journey-template` → PM_TEMPLATE (aipm) — 17 folders `pass-1/01-setup` … `pass-2/06-capstone`.
- Each has one folder per lesson with a `notes.md` placeholder — **never `DONE.md`** (that would mark lessons complete). Adding a lesson = add its folder+notes.md to the matching template (via `gh api PUT .../contents/<path>/notes.md`). Zsh strips PATH inside loops here — set `export PATH=/opt/homebrew/bin:/usr/bin:/bin` and avoid functions, or run a `bash scriptfile`.
- The `aipm` template + its `PM_TEMPLATE` Vercel env var are **owner-run outward-facing steps**: creating a public repo and editing prod env are gated by the auto-mode classifier. A ready-to-run script lives at (session scratchpad) `make-pm-template.sh` — it `gh repo create --public`, sets `is_template=true`, and PUTs all 17 `notes.md`. Run it yourself if the agent is blocked.

## Curriculum conventions (important for edits)
- **`order` (integer) drives UI ordering**, not the folder name. So you can INSERT a lesson by giving it a new `order` and a fresh `repoPath` folder number **without renumbering existing folders** (avoids renaming template folders / breaking completion keys). Existing lesson `repoPath`s are stable identifiers — don't rename them.
- Lesson counts (as of now): **biengineer 17, feengineer 17, daengineer 16, aipm 17.** Never hardcode counts — derive from data.
- Content added this session, across tracks:
  - **Pydantic** in Python core (biengineer/daengineer); Zod called out as its equivalent (feengineer).
  - **ReAct** made explicit in the simple-agent lessons (+ arxiv 2210.03629).
  - **FastMCP** is now the spine of the Python MCP lessons; noted as the Python option in the TS track.
  - New **APIs vs MCP** compare/contrast lesson — all 3 tracks.
  - New **LangChain & LangGraph** (Py) / **LangGraph.js & LangChain.js** (TS) lesson incl. sub-agents/multi-agent — all 3 tracks.
  - New **n8n low-code GenAI workflows** lesson — all 3 tracks.
  - Sub-agents added to Claude Code + database/data-agent lessons.
- **daengineer** persona: Data Analyst with Python + basic ML (classification/sklearn), lacking prompting & AI-workflow experience. Track leans on that: dedicated Prompt Engineering lesson, a "Classical ML → LLMs" bridge, a Data Analysis Agent capstone, evals as their edge, Streamlit-first deploy.
- **aipm** persona (Product Managers, `curriculum-pm.ts`, 17 lessons): NO coding from scratch — *concept-fluency + implementation*. Each building block gets a plain-English "what it is / why it matters for product" + a hands-on build; Claude Code writes the plumbing, learner tweaks small snippets. Pass 1 = building blocks & first builds (prompting, model landscape + **OpenRouter**, vibe-coding, RAG, **ReAct** agent, **multi-agent**, **MCP**, **APIs-vs-MCP**, n8n); Pass 2 = ship & lead (direct Claude Code, evals, cost/risk, AI PRD, ship, capstone). Owner decisions: destination "AI Product Manager", **Product-only** (not PjM), light-code-OK, keep the 4 craft lessons + add the building-block concept lessons. Design rationale is in the plan file `~/.claude/plans/groovy-singing-eclipse.md`.

## Home + quiz (design decisions)
- **Design system:** `globals.css` soft radial-gradient canvas; `tailwind.config.ts` adds `shadow-card`/`shadow-lift`, `animate-fade-up`, system font stack. Keep it clean/minimal (owner preference) — lift via subtle shadow + hover, not clutter.
- **Per-track color identity:** feengineer=sky, biengineer=violet, daengineer=emerald, **aipm=rose**, quiz/helper=amber. Class strings are written out in full (Tailwind JIT can't see dynamic concatenation).
- **Home** now shows **4 persona cards** (grid `sm:grid-cols-2 lg:grid-cols-4`). Because aipm's destination isn't "AI Engineer", the hero was softened: eyebrow "AI Career Tracks", headline "Move into AI, one lesson at a time".
- **Persona cards** state who-it's-for + starting assumptions + 3 highlights. Per owner feedback, the **current role and the "→ …" destination are equal weight** (both `text-lg` bold) — do not shrink the current-role back to a small eyebrow.
- **Quiz** (`/find-your-path`): now **5 questions**, each option adds points to `{feengineer, biengineer, daengineer, aipm}`; highest wins, shows a runner-up. PM routing = a "Product manager" background option + a "how hands-on with code" question (the "not at all, I'll direct AI and lead" option is the strong aipm signal) + a "prototype & lead AI features" build option. Scoring lives in that one client file. It is NOT a curriculum track (not in `tracks`).

## Track page flow (updated)
- **`/[track]` when NOT connected now shows a full curriculum PREVIEW**, not just the connect card: track header + lesson count + a "Connect GitHub & start" CTA anchored to `#connect`, then both passes rendered with `LessonCard` in `preview` mode, then the `ConnectCard` (with the 422 "already exists" handling) in a `#connect` section at the bottom.
- `LessonCard` takes a `preview?: boolean`: hides the `StatusPill` (shows a `→` chevron instead) and drops the next-up ring. Lessons are fully readable before connecting — the lesson pages never required a connection.
- Connecting still lands on the SAME route rendering the dashboard (no explicit redirect — `connection` in localStorage flips the render). Preview branch lives in `src/app/[track]/page.tsx` `if (!connection)`.

## Known minor items
- ~~`favicon.ico` 404~~ — **fixed**: added `src/app/icon.svg` (indigo rounded square + white check). Next injects the `<link>`; a bare `/favicon.ico` hit may still 404 in dev, harmless.
- ~~Root-level `curriculum*.ts` copies~~ — **deleted** (were unreferenced; app only reads `src/data/*`).
- Metadata title is now "AI Engineering Tracker" (`src/app/layout.tsx`).
