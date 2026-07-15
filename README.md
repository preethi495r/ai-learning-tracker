# AI Career Tracks

A learning-tracker website for people transitioning into AI roles. Each track is a shareable landing page where a learner connects their GitHub account — the app auto-creates their learning repo from a template, then tracks progress from what they push.

**Live:** [ai-tracker-eight-ebon.vercel.app](https://ai-tracker-eight-ebon.vercel.app)

---

## Tracks

| Path | From → To | Curriculum |
|---|---|---|
| `/feengineer` | Full-Stack Developer → AI Engineer | `curriculum-wife.ts` |
| `/biengineer` | BI / Data Engineer → AI Engineer | `curriculum.ts` |
| `/daengineer` | Data Analyst → AI Engineer | `curriculum-da.ts` |
| `/aipm` | Product Manager → AI Product Manager | `curriculum-pm.ts` |

A quiz at `/find-your-path` helps learners pick the right track.

---

## How it works

**Progress tracking has no backend.** A learner's repo is public. The browser makes one unauthenticated GitHub API call, reads the file tree, and marks a lesson complete when `<repoPath>/DONE.md` exists. No token required.

**Repo creation uses a tiny serverless backend.** On first connect, the learner goes through GitHub OAuth (`public_repo` scope only). The app uses the token once — to generate their repo from a template — then lets it expire. All subsequent reads are public and client-side.

```
/[track] → "Connect GitHub"
    ↓
/api/auth/login → GitHub OAuth → /api/auth/callback
    ↓
/api/repo/generate  →  learner's new public repo (pre-filled from template)
    ↓
/[track] dashboard  →  one unauthenticated tree read → progress + next lesson
```

---

## Tech stack

- **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS**
- **Serverless Route Handlers** (Node runtime) for the three auth/repo endpoints
- **localStorage** for connection state and cached progress — no database
- **Vercel Hobby** (free) for hosting

No state managers, ORMs, or auth libraries. The OAuth flow is a handful of `fetch` calls.

---

## Project structure

```
src/
  data/
    curriculum.ts          # biengineer lessons
    curriculum-wife.ts     # feengineer lessons
    curriculum-da.ts       # daengineer lessons
    curriculum-pm.ts       # aipm lessons
    tracks.ts              # composes all four tracks
  lib/github.ts            # fetchRepoPaths() + computeCompletion()
  hooks/
    useConnection.ts       # localStorage connection state per track
    useProgress.ts         # fetches tree, computes lesson states
  app/
    page.tsx               # home — hero, 4 persona cards, quiz CTA
    find-your-path/        # quiz recommender (client-only, no backend)
    [track]/page.tsx       # curriculum preview (unconnected) or dashboard
    [track]/lesson/[id]/   # lesson detail + done command + resources
    api/auth/login/        # starts OAuth flow
    api/auth/callback/     # exchanges code → token, sets cookie
    api/repo/generate/     # creates repo from template
  components/              # ConnectCard, GoLocalPanel, LessonCard, etc.
```

---

## Local development

### 1. Clone and install

```bash
git clone https://github.com/harigovind-s-menon/ai-tracker.git
cd ai-tracker
npm install
```

### 2. Create a GitHub OAuth App

See `OAUTH_SETUP.md` for the full checklist. Set the callback URL to:

```
http://localhost:3000/api/auth/callback
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
OAUTH_STATE_SECRET=a_long_random_string

FRONTEND_TEMPLATE=your-username/fullstack-ai-journey-template
BI_TEMPLATE=your-username/ai-engineering-journey-template
DA_TEMPLATE=your-username/data-analyst-ai-journey-template
PM_TEMPLATE=your-username/ai-pm-journey-template
```

Each `*_TEMPLATE` value is an `owner/repo` pointing to a public GitHub repo with the "Template repository" flag enabled.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying

Push to `main` — Vercel auto-deploys. Set the same env vars in your Vercel project settings (server-only; never expose `GITHUB_CLIENT_SECRET` to the client).

The `OAUTH_REDIRECT_URI` env var pins the callback URL and must match your GitHub OAuth App's Authorization callback URL exactly:

```
https://your-domain.vercel.app/api/auth/callback
```

---

## Completion rule

A lesson is done when `<repoPath>/DONE.md` exists in the learner's repo. The exact command is shown on every lesson page with a copy button:

```bash
touch <repoPath>/DONE.md && git add -A && git commit -m "done: <lesson-id>" && git push
```

Template repos use `notes.md` / `.gitkeep` as placeholders — never `DONE.md`.

---

## Adding content

All curriculum changes go in `src/data/`. Lesson `repoPath` values are stable identifiers — don't rename them (it would break completion keys for learners who already have repos). To insert a lesson without renumbering, assign it a new `order` value and a new `repoPath` folder.

---

## License

Private. All rights reserved.
