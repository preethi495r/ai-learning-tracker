# OAuth & Template Setup (one-time, ~15 minutes)

Do these once. None of it costs money — GitHub OAuth Apps are free and the tracker runs on Vercel's free Hobby tier.

## 1. Create the two template repos

For each learner:
1. Create a new **public** GitHub repo under your account:
   - `ai-engineering-journey-template` (for the `biengineer` track)
   - `fullstack-ai-journey-template` (for the `frontendengineer` track)
2. Upload the contents of the matching starter zip (`biengineer-template.zip` / `frontendengineer-template.zip`) — the `pass-1/…`, `pass-2/…` folders, each with a `notes.md` placeholder, plus the README and `.gitignore`.
3. In each repo: **Settings → General → check "Template repository."**

> The placeholder in every lesson folder is `notes.md`, never `DONE.md` — so a freshly generated repo shows 0% complete, as it should.

## 2. Create a GitHub OAuth App

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   (or go to https://github.com/settings/developers).
2. Fill in:
   - **Application name:** anything (e.g. "AI Learning Tracker").
   - **Homepage URL:** your Vercel URL (you can edit this after the first deploy).
   - **Authorization callback URL:** `https://<your-vercel-domain>/api/auth/callback`
3. Create it. Copy the **Client ID**. Click **Generate a new client secret** and copy that too (shown once).

For local development, add a second callback URL `http://localhost:3000/api/auth/callback` (GitHub OAuth Apps allow one callback URL per app; if you need both, either use a separate dev OAuth App or rely on the prod URL and test the flow on a preview deploy).

Reference: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps

## 3. Set Vercel environment variables

In the tracker's Vercel project → **Settings → Environment Variables**:

```
GITHUB_CLIENT_ID        = <from step 2>
GITHUB_CLIENT_SECRET    = <from step 2>          # secret — server only
OAUTH_STATE_SECRET      = <any long random string>
FRONTEND_TEMPLATE       = <your-username>/fullstack-ai-journey-template
BI_TEMPLATE             = <your-username>/ai-engineering-journey-template
```

(Optional) `OAUTH_REDIRECT_URI = https://<domain>/api/auth/callback` if you don't want it derived from the request origin.

Redeploy after setting env vars so they take effect.

## 4. Scope & permissions (what the learner grants)

- The app requests only **`public_repo`** — permission to create and read public repos. Nothing else (no private repos, no org access, no profile write).
- The token is used once, to create her repo from the template. After that the app reads her public repo without any token.

## 5. Smoke test

1. Visit `https://<domain>/biengineer`.
2. Click **Connect GitHub & create my repo**, authorize, keep the default repo name.
3. Confirm a new public repo appears in the authorizing account with all the lesson folders.
4. The dashboard should show 0 / N complete.
5. In that repo, add `pass-1/01-setup/DONE.md`, push, hit **Refresh** on the dashboard — the first lesson flips to complete.

If step 3 fails with "already exists," pick a different repo name or delete the earlier repo — the app will offer to connect the existing one instead.
